# KYC API Usage Examples

## Authentication
All requests (except email verification confirmation) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Create KYC Profile

**Endpoint:** `POST /api/kyc/profile`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "nationalId": "12345678",
  "address": "123 Main Street",
  "city": "Nairobi",
  "postalCode": "00100"
}
```

**Response (201):**
```json
{
  "message": "KYC profile created successfully",
  "profile": {
    "id": "uuid-here",
    "user_id": "user-uuid",
    "full_name": "John Doe",
    "kyc_status": "incomplete",
    "created_at": "2026-01-12T10:30:00Z"
  }
}
```

---

## 2. Update KYC Profile (Customer)

**Endpoint:** `PUT /api/kyc/profile`

**Request Body:**
```json
{
  "preferredPaymentMethod": "mpesa",
  "address": "Updated address"
}
```

---

## 3. Update KYC Profile (Detailer)

**Request Body:**
```json
{
  "yearsOfExperience": 5,
  "certifications": ["Car Wash Pro", "Detailing Expert"],
  "insuranceNumber": "INS-123456",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+254712345678"
}
```

---

## 4. Update KYC Profile (Car Wash Owner)

**Request Body:**
```json
{
  "businessName": "Track Wash Ltd",
  "businessRegistrationNumber": "PVT-ABC1234",
  "taxIdentificationNumber": "A001234567X",
  "numberOfEmployees": 10,
  "businessAddress": "Industrial Area, Nairobi",
  "bankAccountName": "Track Wash Ltd",
  "bankAccountNumber": "1234567890",
  "bankName": "Equity Bank",
  "bankBranch": "Westlands"
}
```

---

## 5. Upload Document

**Endpoint:** `POST /api/kyc/documents/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
frontImage: <file>
backImage: <file> (optional for some documents)
documentType: "national_id"
documentNumber: "12345678"
expiryDate: "2030-12-31"
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/kyc/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "frontImage=@/path/to/id_front.jpg" \
  -F "backImage=@/path/to/id_back.jpg" \
  -F "documentType=national_id" \
  -F "documentNumber=12345678"
```

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "doc-uuid",
    "user_id": "user-uuid",
    "document_type": "national_id",
    "document_number": "12345678",
    "front_image_url": "/uploads/kyc/front-123.jpg",
    "back_image_url": "/uploads/kyc/back-123.jpg",
    "verification_status": "pending",
    "created_at": "2026-01-12T10:30:00Z"
  },
  "note": "Auto-verification in progress"
}
```

---

## 6. Get KYC Status

**Endpoint:** `GET /api/kyc/status`

**Response (200):**
```json
{
  "profile": {
    "id": "profile-uuid",
    "user_id": "user-uuid",
    "full_name": "John Doe",
    "kyc_status": "pending_review",
    "phone_verified": true,
    "email_verified": true,
    "kyc_submitted_at": "2026-01-12T10:30:00Z"
  },
  "documents": [
    {
      "id": "doc1-uuid",
      "document_type": "national_id",
      "verification_status": "verified",
      "created_at": "2026-01-12T10:25:00Z"
    },
    {
      "id": "doc2-uuid",
      "document_type": "business_license",
      "verification_status": "verified",
      "created_at": "2026-01-12T10:28:00Z"
    }
  ],
  "isComplete": false
}
```

---

## 7. Send Phone OTP

**Endpoint:** `POST /api/kyc/verify/phone/send`

**Request Body:**
```json
{
  "phone": "+254712345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent"
}
```

**Note:** In development, OTP appears in console:
```
OTP for +254712345678: 123456
```

---

## 8. Verify Phone OTP

**Endpoint:** `POST /api/kyc/verify/phone/confirm`

**Request Body:**
```json
{
  "phone": "+254712345678",
  "otpCode": "123456"
}
```

**Response (200) - Success:**
```json
{
  "success": true,
  "message": "Phone verified"
}
```

**Response (200) - Failure:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

## 9. Send Email Verification

**Endpoint:** `POST /api/kyc/verify/email/send`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

**Note:** In development, verification URL appears in console:
```
Email verification URL: http://localhost:5173/verify-email?token=abc123...
```

---

## 10. Verify Email (Public)

**Endpoint:** `GET /api/kyc/verify/email/confirm?token=<token>`

**No authentication required**

**Response (200) - Success:**
```json
{
  "success": true,
  "message": "Email verified",
  "userId": "user-uuid"
}
```

**Response (400) - Invalid:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 11. Get Document by ID

**Endpoint:** `GET /api/kyc/documents/:documentId`

**Response (200):**
```json
{
  "id": "doc-uuid",
  "user_id": "user-uuid",
  "document_type": "national_id",
  "document_number": "12345678",
  "front_image_url": "/uploads/kyc/front-123.jpg",
  "back_image_url": "/uploads/kyc/back-123.jpg",
  "verification_status": "verified",
  "verification_notes": "{\"hasValidContour\":true,\"hasValidText\":true}",
  "created_at": "2026-01-12T10:25:00Z"
}
```

---

## 12. Delete Document

**Endpoint:** `DELETE /api/kyc/documents/:documentId`

**Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

---

## 13. Get Audit Log

**Endpoint:** `GET /api/kyc/audit-log`

**Query Parameters (optional):**
```
?userId=<user-uuid>  (admin only)
```

**Response (200):**
```json
[
  {
    "id": "audit-uuid",
    "user_id": "user-uuid",
    "action": "DOCUMENT_UPLOADED",
    "changed_by": "user-uuid",
    "changed_by_name": "John Doe",
    "changes": {
      "documentType": "national_id"
    },
    "ip_address": "192.168.1.1",
    "created_at": "2026-01-12T10:25:00Z"
  },
  {
    "id": "audit-uuid-2",
    "user_id": "user-uuid",
    "action": "KYC_PROFILE_UPDATED",
    "changed_by": "user-uuid",
    "changes": {
      "businessName": "Track Wash Ltd"
    },
    "created_at": "2026-01-12T10:20:00Z"
  }
]
```

---

## Admin Endpoints

### 14. Get Pending KYC Reviews

**Endpoint:** `GET /api/kyc/admin/pending`

**Required Role:** `admin`

**Response (200):**
```json
[
  {
    "id": "user-uuid-1",
    "email": "detailer@example.com",
    "role": "detailer",
    "full_name": "Peter Ochieng",
    "phone": "+254723456789",
    "kyc_status": "pending_review",
    "kyc_submitted_at": "2026-01-12T09:00:00Z",
    "document_count": 2
  },
  {
    "id": "user-uuid-2",
    "email": "owner@example.com",
    "role": "admin",
    "full_name": "Mary Wanjiku",
    "phone": "+254745678901",
    "kyc_status": "pending_review",
    "kyc_submitted_at": "2026-01-12T08:30:00Z",
    "business_name": "Track Wash Ltd",
    "document_count": 3
  }
]
```

---

### 15. Review KYC (Approve/Reject)

**Endpoint:** `POST /api/kyc/admin/review`

**Required Role:** `admin`

**Request Body (Approve):**
```json
{
  "userId": "user-uuid",
  "decision": "approve",
  "notes": "All documents verified successfully"
}
```

**Request Body (Reject):**
```json
{
  "userId": "user-uuid",
  "decision": "reject",
  "notes": "Business license image is not clear. Please re-upload."
}
```

**Response (200):**
```json
{
  "message": "KYC approved successfully",
  "result": {
    "success": true,
    "status": "verified"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Document not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to upload document"
}
```

---

## JavaScript/TypeScript Examples

### Upload Document with Axios

```typescript
import axios from 'axios';

const uploadDocument = async (
  frontImage: File,
  backImage: File | null,
  documentType: string,
  documentNumber?: string
) => {
  const formData = new FormData();
  formData.append('frontImage', frontImage);
  if (backImage) {
    formData.append('backImage', backImage);
  }
  formData.append('documentType', documentType);
  if (documentNumber) {
    formData.append('documentNumber', documentNumber);
  }

  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    '/api/kyc/documents/upload',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};
```

### Send and Verify Phone OTP

```typescript
// Send OTP
const sendOTP = async (phone: string) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/kyc/verify/phone/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ phone })
  });

  return response.json();
};

// Verify OTP
const verifyOTP = async (phone: string, otpCode: string) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/kyc/verify/phone/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ phone, otpCode })
  });

  const data = await response.json();
  return data.success;
};
```

### Get KYC Status

```typescript
const getKYCStatus = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/kyc/status', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};
```

### Admin: Review KYC

```typescript
const reviewKYC = async (
  userId: string, 
  decision: 'approve' | 'reject', 
  notes: string
) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/kyc/admin/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, decision, notes })
  });

  return response.json();
};
```

---

## Testing with Postman

### 1. Setup Environment
Create environment variables:
- `baseUrl`: `http://localhost:3001`
- `token`: (get from login response)

### 2. Login First
```
POST {{baseUrl}}/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```
Copy the `token` from response to environment.

### 3. Test KYC Endpoints
Use `{{baseUrl}}/api/kyc/...` with:
- Authorization: Bearer {{token}}

### 4. Upload Document
- Set body type to `form-data`
- Add files and text fields
- Send request

---

## Rate Limiting (Recommended for Production)

Add rate limiting to prevent abuse:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many OTP requests, please try again later'
});

router.post('/verify/phone/send', otpLimiter, ...);
```

---

## Webhooks (Future Enhancement)

For real-time updates, consider adding webhooks:

```typescript
// Notify external systems when KYC status changes
interface KYCWebhook {
  event: 'kyc.approved' | 'kyc.rejected' | 'kyc.submitted';
  userId: string;
  status: string;
  timestamp: string;
}

// POST to configured webhook URL
await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(webhookData)
});
```

---

**For more information, see:**
- [KYC_DOCUMENTATION.md](KYC_DOCUMENTATION.md) - Full documentation
- [KYC_TESTING_GUIDE.md](KYC_TESTING_GUIDE.md) - Testing instructions
- [KYC_IMPLEMENTATION_SUMMARY.md](KYC_IMPLEMENTATION_SUMMARY.md) - Implementation overview
