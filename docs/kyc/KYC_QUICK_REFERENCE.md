# KYC System - Quick Reference Card

## 🚀 Quick Start
1. Apply schema: `psql <db_url> -f database/kyc_schema.sql`
2. Start backend: `npm run dev:server`
3. Start frontend: `npm run dev`
4. Test registration flows

## 👥 User Types

| Type | Steps | Documents | Approval |
|------|-------|-----------|----------|
| **Customer** | 4 | National ID | Instant ✅ |
| **Detailer** | 5 | ID + Address | Admin ⏳ |
| **Car Wash Owner** | 7 | ID + Business Docs | Admin ⏳ |

## 📋 Required Documents

### Customer
- ✅ National ID (front & back)

### Detailer
- ✅ National ID (front & back)
- ✅ Proof of Address (utility/bank statement)

### Car Wash Owner
- ✅ National ID (front & back)
- ✅ Business License
- ✅ Tax Compliance Certificate

## 🔑 Key Endpoints

```
POST   /api/kyc/profile              # Create profile
POST   /api/kyc/documents/upload     # Upload docs
POST   /api/kyc/verify/phone/send    # Send OTP
POST   /api/kyc/verify/phone/confirm # Verify OTP
GET    /api/kyc/status               # Get status
GET    /api/kyc/admin/pending        # Admin: Get pending
POST   /api/kyc/admin/review         # Admin: Approve/Reject
```

## ✅ Verification Checks

Auto-verification performs:
1. ✓ Contour checking (document boundaries)
2. ✓ Text extraction (OCR)
3. ✓ Image quality validation
4. ✓ Tampering detection
5. ✓ Expiry date checking

## 📊 Database Tables

- `kyc_profiles` - User KYC info
- `kyc_documents` - Uploaded documents
- `phone_verifications` - OTP records
- `email_verifications` - Email tokens
- `kyc_audit_log` - Audit trail

## 🔐 Security

- JWT authentication required
- Role-based access control
- File type/size validation
- Audit logging enabled
- IP tracking active

## 📱 Testing

```bash
# Customer test account
Email: customer@test.com
Phone: +254712345678

# Admin test account
Email: admin@autoflow.com
Password: admin123
```

## 🎯 Status Flow

```
incomplete → pending_review → verified/rejected
```

## 🛠️ Common Commands

```bash
# Check KYC profiles
SELECT * FROM kyc_profiles ORDER BY created_at DESC LIMIT 5;

# Check documents
SELECT * FROM kyc_documents ORDER BY created_at DESC LIMIT 5;

# Check pending reviews
SELECT * FROM kyc_profiles WHERE kyc_status = 'pending_review';

# View audit log
SELECT * FROM kyc_audit_log ORDER BY created_at DESC LIMIT 10;
```

## 📝 File Limits

- Max file size: 5MB
- Formats: JPEG, PNG
- Resolution: Any (higher is better)

## ⚠️ Important Notes

1. **OTP in Development**: Check console for OTP codes
2. **Auto-verification**: Simulated (integrate real API for production)
3. **File Storage**: Currently local (use S3/cloud for production)
4. **SMS**: Console only (integrate SMS gateway for production)
5. **Email**: Console only (integrate email service for production)

## 🔄 Admin Approval Workflow

1. Login as admin
2. Go to Approvals page
3. Select pending application
4. Review documents
5. Click Approve or Reject
6. User receives notification

## 📚 Documentation Files

- `KYC_DOCUMENTATION.md` - Complete docs
- `KYC_TESTING_GUIDE.md` - Testing guide
- `KYC_IMPLEMENTATION_SUMMARY.md` - Overview
- `KYC_API_EXAMPLES.md` - API examples

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| OTP not showing | Check backend console logs |
| Upload fails | Check file size < 5MB, format = JPEG/PNG |
| Can't see pending | Ensure admin role, check database |
| Auto-verify pending | Normal - simulated system |

## 🎨 UI Components

```typescript
<KYCDocumentUpload 
  documentType="national_id"
  title="National ID"
  requiresBackImage={true}
  onUploadComplete={(id) => {...}}
/>

<PhoneVerification 
  phone="+254712345678"
  onVerified={() => {...}}
/>
```

## 🔗 Integration Needed (Production)

- [ ] SMS Gateway (Africa's Talking/Twilio)
- [ ] Email Service (SendGrid/AWS SES)
- [ ] Document Verification API (AWS Rekognition)
- [ ] Cloud Storage (AWS S3)
- [ ] Error Monitoring (Sentry)

## 📈 Success Indicators

- ✅ Customers register and activate instantly
- ✅ Detailers/Owners go to pending status
- ✅ Documents upload successfully
- ✅ OTP verification works
- ✅ Admin can approve/reject
- ✅ Audit trail records all actions

---

**Need help?** Check the full documentation files or review testing guide.
