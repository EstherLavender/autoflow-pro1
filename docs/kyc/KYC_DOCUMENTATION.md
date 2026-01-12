# KYC (Know Your Customer) Verification System

## Overview

The AutoFlow Pro platform now includes a comprehensive KYC verification system with differentiated onboarding flows for each user type. The system includes document upload, auto-verification using contour checking, phone and email verification, and admin review processes.

## User Types & Requirements

### 1. **Car Owner (Customer)**
**Role**: Book a wash & earn rewards

**Onboarding Steps** (4 steps):
1. **Personal Details**
   - Full name
   - Phone number (M-Pesa)
   - Email address

2. **Phone Verification**
   - OTP sent via SMS
   - 6-digit code verification
   - 10-minute expiry

3. **ID Upload**
   - National ID (front & back)
   - Auto-verification with contour checking
   - Document authenticity validation

4. **Vehicle Information**
   - License plate number
   - Car model
   - Color

**Verification**: Instant activation after ID verification

---

### 2. **Detailer (Operator)**
**Role**: Manage jobs & tips

**Onboarding Steps** (5 steps):
1. **Personal Details**
   - Full name
   - Phone number
   - National ID number
   - Invite code (optional)

2. **Phone Verification**
   - OTP verification

3. **ID Document Upload**
   - National ID (front & back)
   - Auto-verification

4. **Proof of Address**
   - Utility bill, bank statement, or rental agreement
   - Must be less than 3 months old
   - Auto-verification

5. **Work Experience**
   - Years of experience
   - Emergency contact name
   - Emergency contact phone

**Required Documents**:
- National ID
- Proof of Address

**Verification**: Requires admin approval after KYC completion

---

### 3. **Car Wash Owner (Admin)**
**Role**: Run your business

**Onboarding Steps** (7 steps):
1. **Personal Details**
   - Full name
   - Phone number
   - National ID number
   - M-Pesa Till/Paybill (optional)

2. **Phone Verification**
   - OTP verification

3. **ID Document Upload**
   - National ID (front & back)
   - Auto-verification

4. **Business Details**
   - Business name
   - Business registration number
   - Tax Identification Number (KRA PIN)
   - Number of employees

5. **Business Documents**
   - Business License/Registration Certificate
   - Tax Compliance Certificate (KRA)
   - Auto-verification for each document

6. **Car Wash Locations**
   - Add multiple locations
   - Name, location/area, full address
   - Services offered (optional)

7. **Review & Submit**
   - Review all information
   - Submit for admin approval

**Required Documents**:
- National ID
- Business License/Registration Certificate
- Tax Compliance Certificate

**Verification**: Requires admin approval (24-48 hours)

---

## Technical Implementation

### Database Schema

#### Tables Created:
1. **kyc_documents** - Stores uploaded documents
2. **kyc_profiles** - User-specific KYC information
3. **biometric_verifications** - Face matching data
4. **phone_verifications** - OTP verification records
5. **email_verifications** - Email verification tokens
6. **kyc_audit_log** - Audit trail of all KYC changes

#### Key Features:
- UUID primary keys
- Timestamp tracking (created_at, updated_at)
- Status tracking (pending, verified, rejected)
- Role-specific fields
- Foreign key relationships

### Backend Services

#### KYC Service (`server/services/kycService.js`)

**Key Methods**:

1. **Profile Management**
   - `createKYCProfile()` - Initialize KYC profile
   - `updateKYCProfile()` - Update with role-specific data
   - `getKYCStatus()` - Retrieve current status

2. **Document Verification**
   - `uploadDocument()` - Upload and trigger verification
   - `autoVerifyDocument()` - Automated verification checks
   - `checkContour()` - Document boundary detection
   - `checkTextExtraction()` - OCR validation
   - `checkImageFormat()` - Quality validation
   - `checkTampering()` - Tampering detection

3. **Identity Verification**
   - `sendPhoneOTP()` - Send SMS verification code
   - `verifyPhoneOTP()` - Validate OTP code
   - `sendEmailVerification()` - Send email verification link
   - `verifyEmail()` - Validate email token

4. **Admin Functions**
   - `getPendingReviews()` - List pending applications
   - `reviewKYC()` - Approve or reject KYC

### API Endpoints

Base URL: `/api/kyc`

#### User Endpoints:
```
POST   /profile                    - Create KYC profile
PUT    /profile                    - Update KYC profile
POST   /documents/upload           - Upload document (multipart)
GET    /status                     - Get KYC status
POST   /verify/phone/send          - Send phone OTP
POST   /verify/phone/confirm       - Verify phone OTP
POST   /verify/email/send          - Send email verification
GET    /verify/email/confirm       - Verify email token
GET    /documents/:documentId      - Get document details
DELETE /documents/:documentId      - Delete document
GET    /audit-log                  - Get audit trail
```

#### Admin Endpoints:
```
GET    /admin/pending              - Get pending KYC reviews
POST   /admin/review               - Approve/reject KYC
```

### Frontend Components

#### 1. **KYCDocumentUpload** (`src/components/kyc/KYCDocumentUpload.tsx`)

Reusable document upload component with:
- Drag & drop interface
- Image preview
- File size validation (max 5MB)
- Auto-verification status tracking
- Progress indication
- Upload tips and guidelines

**Props**:
- `documentType` - Type of document
- `title` - Component title
- `description` - Helper text
- `requiresBackImage` - Whether back image is needed
- `onUploadComplete` - Callback on successful upload

#### 2. **PhoneVerification** (`src/components/kyc/PhoneVerification.tsx`)

Phone number verification component with:
- OTP code input
- Resend functionality
- Countdown timer
- Verification status tracking

**Props**:
- `phone` - Phone number to verify
- `onVerified` - Callback on successful verification

### Auto-Verification System

The system performs multiple checks on uploaded documents:

#### 1. **Contour Checking**
- Detects document boundaries
- Validates rectangular shape
- Checks aspect ratio
- Ensures all corners are visible

#### 2. **Text Extraction (OCR)**
- Extracts text from document
- Validates expected fields
- Checks for required information

#### 3. **Image Quality**
- Resolution check
- Clarity validation
- Format verification (JPEG, PNG)

#### 4. **Tampering Detection**
- Digital alteration detection
- Metadata validation
- Clone/copy-paste detection

#### 5. **Document Matching**
- Verifies document number matches input
- Checks expiry dates
- Validates document authenticity

**Success Criteria**: All checks must pass for auto-approval

### Verification Flow

```
User uploads document
         ↓
Backend receives upload
         ↓
Auto-verification triggered
         ↓
    ┌────┴────┐
    ↓         ↓
All Pass   Any Fail
    ↓         ↓
Verified  Pending Review
    ↓         ↓
    └────┬────┘
         ↓
Admin reviews (if needed)
         ↓
    ┌────┴────┐
    ↓         ↓
Approve    Reject
    ↓         ↓
Active   Rejected Status
```

## Security Features

1. **Data Encryption**
   - All documents stored securely
   - Sensitive data encrypted at rest

2. **Access Control**
   - Role-based permissions
   - Users can only access their own data
   - Admins have review access

3. **Audit Trail**
   - All actions logged
   - IP address tracking
   - User agent recording
   - Timestamp tracking

4. **Document Security**
   - File type validation
   - Size restrictions
   - Malware scanning (recommended)
   - Secure file storage

## Admin Review Process

1. **Access Pending Reviews**
   - Navigate to Admin Dashboard → Approvals
   - View list of pending KYC applications

2. **Review Application**
   - View all uploaded documents
   - Check personal information
   - Verify business details (for car wash owners)

3. **Make Decision**
   - **Approve**: User gets active status
   - **Reject**: User notified with reason
   - Add notes for transparency

4. **Notifications**
   - Email notification sent to user
   - In-app notification created
   - Audit log updated

## Integration Points

### Production Recommendations

For production deployment, integrate with:

1. **Document Verification Services**
   - AWS Rekognition
   - Google Cloud Vision API
   - Azure Computer Vision
   - Onfido
   - Jumio

2. **SMS Gateway**
   - Twilio
   - Africa's Talking
   - MessageBird

3. **Email Service**
   - SendGrid
   - AWS SES
   - Mailgun

4. **File Storage**
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage

## Environment Variables

Add to `.env`:

```env
# KYC Configuration
APP_URL=http://localhost:5173
KYC_AUTO_VERIFICATION_ENABLED=true
KYC_DOCUMENT_MAX_SIZE=5242880  # 5MB in bytes

# SMS Provider (e.g., Africa's Talking)
SMS_API_KEY=your_sms_api_key
SMS_USERNAME=your_sms_username

# Email Service
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@autoflow.com

# File Upload
UPLOAD_DIR=./uploads/kyc
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf
```

## Testing

### Manual Testing Checklist

**Customer Onboarding**:
- [ ] Can enter personal details
- [ ] Receives OTP on phone
- [ ] Can verify phone with OTP
- [ ] Can upload ID front and back
- [ ] Document auto-verification works
- [ ] Can add vehicle information
- [ ] Successfully completes onboarding

**Detailer Onboarding**:
- [ ] Can enter personal details
- [ ] Phone verification works
- [ ] Can upload National ID
- [ ] Can upload proof of address
- [ ] Can enter work experience
- [ ] Goes to pending approval status

**Car Wash Owner Onboarding**:
- [ ] Can enter personal details
- [ ] Phone verification works
- [ ] Can upload National ID
- [ ] Can enter business details
- [ ] Can upload business license
- [ ] Can upload tax certificate
- [ ] Can add multiple car wash locations
- [ ] Review screen shows all data
- [ ] Goes to pending approval status

**Admin Functions**:
- [ ] Can view pending KYC reviews
- [ ] Can view all uploaded documents
- [ ] Can approve KYC applications
- [ ] Can reject with reason
- [ ] User receives notification

## Migration Guide

To apply the KYC schema to your database:

```bash
# Connect to your Neon database
psql postgresql://your_connection_string

# Run the KYC schema
\i database/kyc_schema.sql

# Verify tables created
\dt kyc_*
```

## Future Enhancements

1. **Biometric Verification**
   - Selfie with ID matching
   - Liveness detection
   - Face recognition

2. **Advanced Document Verification**
   - Real-time document validation APIs
   - Government database integration
   - Cross-border ID verification

3. **Risk Scoring**
   - Automated risk assessment
   - Fraud detection algorithms
   - Behavioral analysis

4. **Compliance Features**
   - AML (Anti-Money Laundering) checks
   - PEP (Politically Exposed Person) screening
   - Sanctions list checking

5. **Multi-language Support**
   - Swahili translations
   - Other local languages

## Support & Troubleshooting

### Common Issues

1. **Document Upload Fails**
   - Check file size < 5MB
   - Ensure correct format (JPEG, PNG)
   - Verify upload directory permissions

2. **OTP Not Received**
   - Check SMS gateway configuration
   - Verify phone number format
   - Check SMS credits/balance

3. **Auto-Verification Always Fails**
   - Ensure good quality images
   - Check contour detection settings
   - Review verification thresholds

4. **Admin Can't See Pending Reviews**
   - Verify admin role assignment
   - Check database connections
   - Review API permissions

## Compliance Notes

This KYC system helps comply with:
- Kenya Data Protection Act
- Financial sector regulations
- Anti-fraud requirements
- Business registration laws

**Important**: Consult with legal advisors to ensure full compliance with local regulations.

---

## Quick Start

1. **Apply Database Schema**
   ```bash
   psql postgresql://your_db_url -f database/kyc_schema.sql
   ```

2. **Restart Backend Server**
   ```bash
   npm run dev:server
   ```

3. **Test Registration Flow**
   - Create new account
   - Follow onboarding steps
   - Upload test documents
   - Verify phone number

4. **Admin Review**
   - Login as admin
   - Go to Approvals page
   - Review and approve test application

---

**Last Updated**: January 12, 2026
**Version**: 1.0.0
**Author**: AutoFlow Pro Development Team
