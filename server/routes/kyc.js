const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const kycService = require('../services/kycService');
const upload = require('../config/upload');

const router = express.Router();

/**
 * Create KYC Profile
 */
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const profileData = req.body;

    const profile = await kycService.createKYCProfile(userId, profileData, role);
    
    res.status(201).json({
      message: 'KYC profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Create KYC profile error:', error);
    res.status(500).json({ error: 'Failed to create KYC profile' });
  }
});

/**
 * Update KYC Profile
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const updates = req.body;

    const profile = await kycService.updateKYCProfile(userId, updates, role);
    
    res.json({
      message: 'KYC profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update KYC profile error:', error);
    res.status(500).json({ error: 'Failed to update KYC profile' });
  }
});

/**
 * Upload KYC Document
 * Handles front and back images of ID documents
 */
router.post('/documents/upload', 
  authenticateToken,
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { userId } = req.user;
      const { documentType, documentNumber, expiryDate } = req.body;

      if (!req.files || !req.files.frontImage) {
        return res.status(400).json({ error: 'Front image is required' });
      }

      const documentData = {
        documentType,
        documentNumber,
        frontImageUrl: req.files.frontImage[0].path,
        backImageUrl: req.files.backImage ? req.files.backImage[0].path : null,
        expiryDate: expiryDate || null
      };

      const document = await kycService.uploadDocument(userId, documentData);
      
      res.status(201).json({
        message: 'Document uploaded successfully',
        document,
        note: 'Auto-verification in progress'
      });
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

/**
 * Get KYC Status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    const status = await kycService.getKYCStatus(userId);
    
    res.json(status);
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ error: 'Failed to retrieve KYC status' });
  }
});

/**
 * Send Phone OTP
 */
router.post('/verify/phone/send', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const result = await kycService.sendPhoneOTP(userId, phone);
    
    res.json(result);
  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * Verify Phone OTP
 */
router.post('/verify/phone/confirm', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { phone, otpCode } = req.body;

    if (!phone || !otpCode) {
      return res.status(400).json({ error: 'Phone and OTP code are required' });
    }

    const result = await kycService.verifyPhoneOTP(userId, phone, otpCode);
    
    res.json(result);
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

/**
 * Send Email Verification
 */
router.post('/verify/email/send', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await kycService.sendEmailVerification(userId, email);
    
    res.json(result);
  } catch (error) {
    console.error('Send email verification error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

/**
 * Verify Email Code (protected route)
 */
router.post('/verify/email/confirm', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const result = await kycService.verifyEmail(userId, email, verificationCode);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

/**
 * Admin: Get Pending KYC Reviews
 */
router.get('/admin/pending', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await kycService.getPendingReviews();
    
    res.json(result);
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ error: 'Failed to retrieve pending reviews' });
  }
});

/**
 * Admin: Review KYC
 */
router.post('/admin/review', authenticateToken, async (req, res) => {
  try {
    const { userId: adminId, role } = req.user;
    const { userId, decision, notes } = req.body;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!userId || !decision) {
      return res.status(400).json({ error: 'User ID and decision are required' });
    }

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be approve or reject' });
    }

    const result = await kycService.reviewKYC(adminId, userId, decision, notes);
    
    res.json({
      message: `KYC ${decision}d successfully`,
      result
    });
  } catch (error) {
    console.error('Review KYC error:', error);
    res.status(500).json({ error: 'Failed to review KYC' });
  }
});

/**
 * Get Document by ID
 */
router.get('/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { documentId } = req.params;

    const document = await kycService.getDocument(documentId, userId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

/**
 * Delete Document
 */
router.delete('/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { documentId } = req.params;

    await kycService.deleteDocument(documentId, userId);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

/**
 * Get KYC Audit Log
 */
router.get('/audit-log', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    // Users can see their own audit log, admins can see all
    const targetUserId = role === 'admin' && req.query.userId ? req.query.userId : userId;

    const logs = await kycService.getAuditLog(targetUserId);
    
    res.json(logs);
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Failed to retrieve audit log' });
  }
});

module.exports = router;
