const pool = require('../config/database');
const crypto = require('crypto');
const { emailTemplates, sendEmail } = require('../config/notifications');
const nodemailer = require('nodemailer');

// Create email transporter for KYC emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * KYC Verification Service
 * Handles document verification, contour checking, and auto-verification
 */

class KYCService {
  /**
   * Create KYC profile for a user
   */
  async createKYCProfile(userId, profileData, role) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO kyc_profiles (
          user_id, full_name, date_of_birth, national_id, 
          phone_verified, email_verified, address, city, 
          postal_code, country, kyc_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const result = await client.query(query, [
        userId,
        profileData.fullName,
        profileData.dateOfBirth || null,
        profileData.nationalId || null,
        false,
        false,
        profileData.address || null,
        profileData.city || null,
        profileData.postalCode || null,
        profileData.country || 'Kenya',
        'incomplete'
      ]);

      await this.logAudit(client, userId, 'KYC_PROFILE_CREATED', userId, {
        role,
        profileData
      });

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update KYC profile with role-specific data
   */
  async updateKYCProfile(userId, updates, role) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      let updateFields = [];
      let values = [];
      let paramCount = 1;

      // Common fields
      if (updates.fullName) {
        updateFields.push(`full_name = $${paramCount++}`);
        values.push(updates.fullName);
      }
      if (updates.dateOfBirth) {
        updateFields.push(`date_of_birth = $${paramCount++}`);
        values.push(updates.dateOfBirth);
      }
      if (updates.nationalId) {
        updateFields.push(`national_id = $${paramCount++}`);
        values.push(updates.nationalId);
      }
      if (updates.address) {
        updateFields.push(`address = $${paramCount++}`);
        values.push(updates.address);
      }

      // Customer specific
      if (role === 'customer' && updates.preferredPaymentMethod) {
        updateFields.push(`preferred_payment_method = $${paramCount++}`);
        values.push(updates.preferredPaymentMethod);
      }

      // Detailer specific
      if (role === 'detailer') {
        if (updates.yearsOfExperience) {
          updateFields.push(`years_of_experience = $${paramCount++}`);
          values.push(updates.yearsOfExperience);
        }
        if (updates.certifications) {
          updateFields.push(`certifications = $${paramCount++}`);
          values.push(updates.certifications);
        }
        if (updates.insuranceNumber) {
          updateFields.push(`insurance_number = $${paramCount++}`);
          values.push(updates.insuranceNumber);
        }
        if (updates.emergencyContact) {
          updateFields.push(`emergency_contact = $${paramCount++}`);
          values.push(updates.emergencyContact);
        }
        if (updates.emergencyPhone) {
          updateFields.push(`emergency_phone = $${paramCount++}`);
          values.push(updates.emergencyPhone);
        }
      }

      // Car Wash Owner (admin) specific
      if (role === 'admin') {
        if (updates.businessName) {
          updateFields.push(`business_name = $${paramCount++}`);
          values.push(updates.businessName);
        }
        if (updates.businessRegistrationNumber) {
          updateFields.push(`business_registration_number = $${paramCount++}`);
          values.push(updates.businessRegistrationNumber);
        }
        if (updates.taxIdentificationNumber) {
          updateFields.push(`tax_identification_number = $${paramCount++}`);
          values.push(updates.taxIdentificationNumber);
        }
        if (updates.numberOfEmployees) {
          updateFields.push(`number_of_employees = $${paramCount++}`);
          values.push(updates.numberOfEmployees);
        }
        if (updates.businessAddress) {
          updateFields.push(`business_address = $${paramCount++}`);
          values.push(updates.businessAddress);
        }
        if (updates.bankAccountName) {
          updateFields.push(`bank_account_name = $${paramCount++}`);
          values.push(updates.bankAccountName);
        }
        if (updates.bankAccountNumber) {
          updateFields.push(`bank_account_number = $${paramCount++}`);
          values.push(updates.bankAccountNumber);
        }
        if (updates.bankName) {
          updateFields.push(`bank_name = $${paramCount++}`);
          values.push(updates.bankName);
        }
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(userId);

      const query = `
        UPDATE kyc_profiles 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);

      await this.logAudit(client, userId, 'KYC_PROFILE_UPDATED', userId, updates);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Upload KYC document
   */
  async uploadDocument(userId, documentData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO kyc_documents (
          user_id, document_type, document_number,
          front_image_url, back_image_url, verification_status,
          expiry_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await client.query(query, [
        userId,
        documentData.documentType,
        documentData.documentNumber || null,
        documentData.frontImageUrl,
        documentData.backImageUrl || null,
        'pending',
        documentData.expiryDate || null
      ]);

      await this.logAudit(client, userId, 'DOCUMENT_UPLOADED', userId, {
        documentType: documentData.documentType
      });

      await client.query('COMMIT');
      
      // Trigger auto-verification
      this.autoVerifyDocument(result.rows[0].id);
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Auto-verify document using contour checking and pattern matching
   * This is a simulated verification - in production, integrate with services like:
   * - AWS Rekognition
   * - Google Cloud Vision
   * - Azure Computer Vision
   * - Onfido, Jumio, or similar KYC providers
   */
  async autoVerifyDocument(documentId) {
    try {
      const document = await pool.query(
        'SELECT * FROM kyc_documents WHERE id = $1',
        [documentId]
      );

      if (document.rows.length === 0) {
        throw new Error('Document not found');
      }

      const doc = document.rows[0];

      // Simulated verification checks
      const verificationResults = {
        hasValidContour: await this.checkContour(doc.front_image_url),
        hasValidText: await this.checkTextExtraction(doc.front_image_url),
        hasValidFormat: await this.checkImageFormat(doc.front_image_url),
        isNotTampered: await this.checkTampering(doc.front_image_url),
        hasValidExpiry: doc.expiry_date ? new Date(doc.expiry_date) > new Date() : true,
      };

      // Check if back image exists for documents that require it
      if (doc.back_image_url) {
        verificationResults.backImageValid = await this.checkContour(doc.back_image_url);
      }

      // Determine verification status
      const allChecksPass = Object.values(verificationResults).every(check => check === true);
      const verificationStatus = allChecksPass ? 'verified' : 'pending';

      // Update document status
      await pool.query(
        `UPDATE kyc_documents 
         SET verification_status = $1, 
             verification_notes = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [
          verificationStatus,
          JSON.stringify(verificationResults),
          documentId
        ]
      );

      // If verified, check if all required documents are verified
      if (verificationStatus === 'verified') {
        await this.checkAndUpdateKYCStatus(doc.user_id);
      }

      return { status: verificationStatus, results: verificationResults };
    } catch (error) {
      console.error('Auto-verification error:', error);
      return { status: 'pending', error: error.message };
    }
  }

  /**
   * Check document contour (simulated)
   * In production, use image processing libraries or cloud services
   */
  async checkContour(imageUrl) {
    // Simulate contour detection
    // Check if image has valid rectangular boundaries
    // Check for proper aspect ratio
    // Check for clear edges
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        resolve(Math.random() > 0.05);
      }, 100);
    });
  }

  /**
   * Check text extraction from document (simulated)
   */
  async checkTextExtraction(imageUrl) {
    // Simulate OCR text extraction
    // Verify presence of expected fields (name, ID number, etc.)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.1);
      }, 100);
    });
  }

  /**
   * Check image format and quality (simulated)
   */
  async checkImageFormat(imageUrl) {
    // Check image resolution
    // Check image clarity
    // Check file format
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.05);
      }, 50);
    });
  }

  /**
   * Check for image tampering (simulated)
   */
  async checkTampering(imageUrl) {
    // Check for digital alterations
    // Check metadata
    // Check for cloning/copy-paste
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.02);
      }, 100);
    });
  }

  /**
   * Check and update overall KYC status
   */
  async checkAndUpdateKYCStatus(userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get user role
      const userResult = await client.query(
        'SELECT role FROM users WHERE id = $1',
        [userId]
      );
      const role = userResult.rows[0].role;

      // Check required documents based on role
      const requiredDocs = this.getRequiredDocuments(role);
      
      const verifiedDocs = await client.query(
        `SELECT document_type FROM kyc_documents 
         WHERE user_id = $1 AND verification_status = 'verified'`,
        [userId]
      );

      const verifiedDocTypes = verifiedDocs.rows.map(d => d.document_type);
      const allDocsVerified = requiredDocs.every(doc => verifiedDocTypes.includes(doc));

      if (allDocsVerified) {
        // Update KYC status to pending_review
        await client.query(
          `UPDATE kyc_profiles 
           SET kyc_status = 'pending_review',
               kyc_submitted_at = NOW(),
               updated_at = NOW()
           WHERE user_id = $1`,
          [userId]
        );

        // Update user status to pending (for admin review)
        await client.query(
          `UPDATE users 
           SET status = 'pending',
               updated_at = NOW()
           WHERE id = $1`,
          [userId]
        );

        await this.logAudit(client, userId, 'KYC_SUBMITTED_FOR_REVIEW', userId, {
          verifiedDocuments: verifiedDocTypes
        });
      }

      await client.query('COMMIT');
      return allDocsVerified;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get required documents based on user role
   */
  getRequiredDocuments(role) {
    switch (role) {
      case 'customer':
        return ['national_id']; // or passport
      case 'detailer':
        return ['national_id', 'proof_of_address'];
      case 'admin': // Car Wash Owner
        return ['national_id', 'business_license', 'tax_certificate'];
      default:
        return ['national_id'];
    }
  }

  /**
   * Admin: Manually verify/reject KYC
   */
  async reviewKYC(adminId, userId, decision, notes) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const status = decision === 'approve' ? 'verified' : 'rejected';
      const userStatus = decision === 'approve' ? 'active' : 'rejected';

      // Update KYC profile
      await client.query(
        `UPDATE kyc_profiles 
         SET kyc_status = $1,
             kyc_reviewed_at = NOW(),
             kyc_reviewed_by = $2,
             rejection_reason = $3,
             updated_at = NOW()
         WHERE user_id = $4`,
        [status, adminId, decision === 'reject' ? notes : null, userId]
      );

      // Update user status
      await client.query(
        `UPDATE users 
         SET status = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [userStatus, userId]
      );

      await this.logAudit(client, userId, `KYC_${decision.toUpperCase()}D`, adminId, {
        notes
      });

      await client.query('COMMIT');
      return { success: true, status };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Generate OTP for phone verification
   */
  async sendPhoneOTP(userId, phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `INSERT INTO phone_verifications (user_id, phone, otp_code, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, phone, otp, expiresAt]
    );

    // In production, send SMS via Twilio, Africa's Talking, etc.
    console.log(`OTP for ${phone}: ${otp}`);
    
    return { success: true, message: 'OTP sent' };
  }

  /**
   * Verify phone OTP
   */
  async verifyPhoneOTP(userId, phone, otpCode) {
    const result = await pool.query(
      `SELECT * FROM phone_verifications 
       WHERE user_id = $1 AND phone = $2 AND otp_code = $3 
       AND verified = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, phone, otpCode]
    );

    if (result.rows.length === 0) {
      // Increment attempts
      await pool.query(
        `UPDATE phone_verifications 
         SET attempts = attempts + 1 
         WHERE user_id = $1 AND phone = $2 AND verified = false`,
        [userId, phone]
      );
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Mark as verified
    await pool.query(
      `UPDATE phone_verifications SET verified = true WHERE id = $1`,
      [result.rows[0].id]
    );

    // Update KYC profile
    await pool.query(
      `UPDATE kyc_profiles SET phone_verified = true WHERE user_id = $1`,
      [userId]
    );

    return { success: true, message: 'Phone verified' };
  }

  /**
   * Generate email verification code and send email
   */
  async sendEmailVerification(userId, email) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `INSERT INTO email_verifications (user_id, email, verification_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, email, verificationCode, expiresAt]
    );

    // Get user's name for email
    const userResult = await pool.query(
      'SELECT full_name FROM kyc_profiles WHERE user_id = $1',
      [userId]
    );
    const userName = userResult.rows[0]?.full_name || 'User';

    // Send email with verification code
    try {
      const transporter = createTransporter();
      const emailContent = emailTemplates.emailVerification(userName, verificationCode);
      
      await transporter.sendMail({
        from: `"AutoFlow Pro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`Verification code sent to ${email}: ${verificationCode}`);
      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, message: 'Failed to send verification email' };
    }
  }

  /**
   * Verify email code
   */
  async verifyEmail(userId, email, verificationCode) {
    const result = await pool.query(
      `SELECT * FROM email_verifications 
       WHERE user_id = $1 AND email = $2 AND verification_token = $3
       AND verified = false AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [userId, email, verificationCode]
    );

    if (result.rows.length === 0) {
      return { success: false, message: 'Invalid or expired verification code' };
    }

    const verification = result.rows[0];

    // Mark as verified
    await pool.query(
      `UPDATE email_verifications SET verified = true WHERE id = $1`,
      [verification.id]
    );

    // Update KYC profile
    await pool.query(
      `UPDATE kyc_profiles SET email_verified = true WHERE user_id = $1`,
      [verification.user_id]
    );

    return { success: true, message: 'Email verified successfully', userId: verification.user_id };
  }

  /**
   * Get KYC status for user
   */
  async getKYCStatus(userId) {
    const profile = await pool.query(
      'SELECT * FROM kyc_profiles WHERE user_id = $1',
      [userId]
    );

    const documents = await pool.query(
      'SELECT * FROM kyc_documents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return {
      profile: profile.rows[0] || null,
      documents: documents.rows || [],
      isComplete: profile.rows[0]?.kyc_status === 'verified'
    };
  }

  /**
   * Get pending KYC reviews (Admin)
   */
  async getPendingReviews() {
    const result = await pool.query(
      `SELECT 
        u.id, u.email, u.role, u.full_name, u.phone,
        kp.kyc_status, kp.kyc_submitted_at, kp.business_name,
        COUNT(kd.id) as document_count
      FROM users u
      INNER JOIN kyc_profiles kp ON u.id = kp.user_id
      LEFT JOIN kyc_documents kd ON u.id = kd.user_id
      WHERE kp.kyc_status = 'pending_review'
      GROUP BY u.id, u.email, u.role, u.full_name, u.phone, kp.kyc_status, kp.kyc_submitted_at, kp.business_name
      ORDER BY kp.kyc_submitted_at DESC`
    );

    return result.rows;
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId, userId) {
    const result = await pool.query(
      'SELECT * FROM kyc_documents WHERE id = $1 AND user_id = $2',
      [documentId, userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId, userId) {
    const result = await pool.query(
      'DELETE FROM kyc_documents WHERE id = $1 AND user_id = $2 RETURNING *',
      [documentId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Document not found or access denied');
    }

    return result.rows[0];
  }

  /**
   * Get audit log
   */
  async getAuditLog(userId) {
    const result = await pool.query(
      `SELECT al.*, u.full_name as changed_by_name
       FROM kyc_audit_log al
       LEFT JOIN users u ON al.changed_by = u.id
       WHERE al.user_id = $1
       ORDER BY al.created_at DESC
       LIMIT 100`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Log audit trail
   */
  async logAudit(client, userId, action, changedBy, changes, ipAddress = null, userAgent = null) {
    await client.query(
      `INSERT INTO kyc_audit_log (user_id, action, changed_by, changes, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, changedBy, JSON.stringify(changes), ipAddress, userAgent]
    );
  }
}

module.exports = new KYCService();
