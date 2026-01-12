# KYC System Testing Guide

## Quick Setup

### 1. Database Setup
```bash
# Apply the KYC schema to your Neon database
psql postgresql://your_neon_connection_string -f database/kyc_schema.sql
```

### 2. Start Backend Server
```bash
npm run dev:server
```

### 3. Start Frontend
```bash
npm run dev
```

## Testing Each User Type

### Test 1: Customer Registration (Car Owner)

**Expected Flow**: 4 steps, instant activation

1. **Navigate to Registration**
   - Go to http://localhost:5173
   - Click "Sign Up" or "Register"
   - Select "Customer" role

2. **Step 1: Personal Details**
   - Enter name: "Test Customer"
   - Phone: "+254712345678"
   - Email: "customer@test.com"
   - Click "Continue"

3. **Step 2: Phone Verification**
   - Check terminal/console for OTP code
   - Enter the 6-digit code
   - Should show green checkmark
   - Click "Continue"

4. **Step 3: Upload ID**
   - Click on "Front Side" upload area
   - Select a clear ID photo (front)
   - Click on "Back Side" upload area
   - Select ID photo (back)
   - Click "Upload & Verify"
   - Wait for auto-verification (should show "Verified")
   - Click "Continue"

5. **Step 4: Vehicle Details**
   - Plate: "KDA 123A"
   - Model: "Toyota Camry 2020"
   - Color: "Silver"
   - Click "Submit Profile"

**Expected Result**: 
- ✅ Redirected to Customer Dashboard
- ✅ Account status: Active
- ✅ Can start booking services

---

### Test 2: Detailer Registration

**Expected Flow**: 5 steps, requires admin approval

1. **Navigate to Registration**
   - Select "Detailer" or "Operator" role

2. **Step 1: Personal Details**
   - Name: "Test Detailer"
   - Phone: "+254723456789"
   - National ID: "12345678"
   - Invite Code: (leave blank or enter test code)
   - Click "Continue"

3. **Step 2: Phone Verification**
   - Check console for OTP
   - Enter and verify
   - Click "Continue"

4. **Step 3: Upload National ID**
   - Upload front and back photos
   - Wait for verification
   - Click "Continue"

5. **Step 4: Proof of Address**
   - Upload utility bill/bank statement
   - Wait for verification
   - Click "Continue"

6. **Step 5: Work Experience**
   - Years: "3"
   - Emergency Contact: "Jane Doe"
   - Emergency Phone: "+254734567890"
   - Click "Submit Profile"

**Expected Result**:
- ✅ Redirected to "Pending Approval" page
- ✅ Account status: Pending
- ❌ Cannot access dashboard yet
- ⏳ Waiting for admin approval

---

### Test 3: Car Wash Owner Registration

**Expected Flow**: 7 steps, requires admin approval

1. **Navigate to Registration**
   - Select "Car Wash Owner" or "Admin" role

2. **Step 1: Personal Details**
   - Name: "Test Owner"
   - Phone: "+254745678901"
   - National ID: "87654321"
   - M-Pesa Till: "123456" (optional)
   - Click "Continue"

3. **Step 2: Phone Verification**
   - Verify OTP
   - Click "Continue"

4. **Step 3: Upload National ID**
   - Upload ID photos
   - Wait for verification
   - Click "Continue"

5. **Step 4: Business Details**
   - Business Name: "Test Car Wash Ltd"
   - Registration: "PVT-TEST1234"
   - KRA PIN: "A001234567X"
   - Employees: "5"
   - Click "Continue"

6. **Step 5: Business Documents**
   - Upload Business License
   - Upload Tax Certificate
   - Wait for both to verify
   - Click "Continue"

7. **Step 6: Car Wash Locations**
   - Name: "Test Wash Westlands"
   - Location: "Westlands, Nairobi"
   - Address: "Waiyaki Way, Next to Mall"
   - Click "Add Another" to test multiple locations (optional)
   - Click "Continue"

8. **Step 7: Review & Submit**
   - Review all information
   - Click "Submit for Approval"

**Expected Result**:
- ✅ Redirected to "Pending Approval" page
- ✅ Account status: Pending
- ✅ KYC status: Pending Review
- ⏳ Waiting for admin approval

---

## Testing Admin Functions

### Prerequisites
- Have the default admin account or create one:
  - Email: admin@autoflow.com
  - Password: admin123

### Test 4: Admin KYC Review

1. **Login as Admin**
   - Email: admin@autoflow.com
   - Password: admin123

2. **Navigate to Approvals**
   - Go to Admin Dashboard
   - Click "Approvals" or "Pending Reviews"

3. **View Pending Applications**
   - Should see Test Detailer and Test Owner
   - Click on one to review

4. **Review Documents**
   - View uploaded ID documents
   - Check business documents (for car wash owner)
   - Review all profile information

5. **Approve Application**
   - Click "Approve" button
   - Add optional notes
   - Confirm approval

6. **Verify User Status**
   - User should receive notification
   - User account status changes to "Active"
   - User can now log in and access dashboard

### Test 5: Reject Application

1. **Select an application**
2. **Click "Reject"**
3. **Enter rejection reason**: "Documents not clear"
4. **Confirm rejection**

**Expected Result**:
- ✅ User receives rejection notification
- ✅ User can see rejection reason
- ✅ User can re-upload documents

---

## Verification Checklist

### Auto-Verification Tests

Test that auto-verification correctly:

✅ **Accepts Valid Documents**
- Clear, high-quality images
- All corners visible
- Text readable
- Proper aspect ratio

❌ **Rejects Invalid Documents**
- Blurry images
- Partial document visible
- Poor lighting
- Wrong file type

### Phone Verification Tests

✅ **Valid OTP**
- Correct code within 10 minutes
- Marks phone as verified
- Updates KYC profile

❌ **Invalid OTP**
- Wrong code
- Expired code (after 10 minutes)
- Too many attempts

### Database Verification

Check that data is correctly stored:

```sql
-- Check KYC profiles
SELECT user_id, full_name, kyc_status, phone_verified 
FROM kyc_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Check documents
SELECT user_id, document_type, verification_status 
FROM kyc_documents 
ORDER BY created_at DESC 
LIMIT 5;

-- Check phone verifications
SELECT user_id, phone, verified, expires_at 
FROM phone_verifications 
ORDER BY created_at DESC 
LIMIT 5;

-- Check audit log
SELECT user_id, action, created_at 
FROM kyc_audit_log 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Common Issues & Solutions

### Issue 1: OTP Not Showing in Console
**Solution**: 
- Check backend server is running
- Look for console.log output: "OTP for +254... : 123456"
- In production, integrate SMS service

### Issue 2: Document Upload Fails
**Solution**:
- Check file size < 5MB
- Use JPEG or PNG format
- Ensure `uploads/kyc` directory exists and has write permissions

### Issue 3: Auto-Verification Always Pending
**Solution**:
- This is normal - it's a simulated system
- In production, integrate with real verification API
- For testing, verification happens after a short delay

### Issue 4: Admin Can't See Pending Reviews
**Solution**:
- Ensure user has 'admin' role in database
- Check `kyc_profiles` table has `kyc_status = 'pending_review'`
- Verify API endpoint `/api/kyc/admin/pending` is accessible

### Issue 5: Database Connection Errors
**Solution**:
- Verify `.env` file has correct DATABASE_URL
- Check Neon database is running
- Ensure KYC schema has been applied

---

## Performance Testing

### Load Test Scenarios

1. **Multiple Simultaneous Registrations**
   - 10 customers register at once
   - Check database handles concurrent inserts
   - Verify no duplicate entries

2. **Large File Uploads**
   - Upload maximum size (5MB) documents
   - Multiple documents simultaneously
   - Check upload speed and server response

3. **OTP Rate Limiting**
   - Try sending multiple OTPs quickly
   - Should have rate limiting (1 per minute)
   - Prevent spam attacks

---

## Security Testing

### Test Security Features

1. **Unauthorized Access**
   - Try accessing `/api/kyc/admin/pending` without admin role
   - Should return 403 Forbidden

2. **Token Expiration**
   - Wait for JWT token to expire
   - Try making API calls
   - Should require re-login

3. **File Type Validation**
   - Try uploading non-image files (.exe, .pdf)
   - Should reject invalid types

4. **SQL Injection Prevention**
   - Try entering SQL in form fields: `'; DROP TABLE users;--`
   - Should be properly sanitized

5. **XSS Prevention**
   - Enter script tags in text fields: `<script>alert('XSS')</script>`
   - Should be escaped in display

---

## Success Criteria

All tests pass when:

- [x] Customers can complete registration in 4 steps
- [x] Detailers complete 5 steps and await approval  
- [x] Car wash owners complete 7 steps and await approval
- [x] Phone verification works correctly
- [x] Documents upload and auto-verify
- [x] Admin can review and approve/reject
- [x] Users receive appropriate notifications
- [x] Database records all actions
- [x] Audit log tracks all changes
- [x] Security measures prevent unauthorized access

---

## Next Steps After Testing

1. **Configure SMS Gateway**
   - Sign up for Africa's Talking or Twilio
   - Add credentials to `.env`
   - Test real SMS delivery

2. **Setup Email Service**
   - Configure SendGrid or AWS SES
   - Test email notifications
   - Verify email verification links

3. **Integrate Document Verification API**
   - Choose provider (AWS Rekognition, Onfido, etc.)
   - Replace simulated verification
   - Test with real documents

4. **Configure File Storage**
   - Setup AWS S3 or similar
   - Move uploads to cloud storage
   - Update file paths in code

5. **Deploy to Production**
   - Test on staging environment
   - Perform security audit
   - Go live!

---

**Happy Testing! 🚀**

For issues or questions, check KYC_DOCUMENTATION.md
