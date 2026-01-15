# 🚗 AutoFlow Pro

> **Nairobi's #1 Car Wash Management Platform**

AutoFlow Pro is a comprehensive, modern car wash booking and management platform that digitizes the entire car wash service ecosystem. Built for car owners, detailers, and car wash business owners in Nairobi, Kenya, it provides seamless booking, real-time tracking, mobile payments via M-Pesa, and loyalty rewards - all in one platform.

---

## 🎯 Purpose & Vision

AutoFlow Pro transforms the traditional car wash industry by:

- **Eliminating inefficiencies** - No more waiting in line or making phone calls to book services
- **Empowering car owners** - Book car wash services like ordering a ride, track service progress in real-time
- **Supporting detailers** - Fair job distribution, digital payment tracking, and tip management
- **Growing businesses** - Complete management system for car wash owners to scale operations
- **Driving transparency** - Real-time updates, digital receipts, and dispute resolution

### The Problem We Solve

Traditional car wash services in Nairobi face challenges:
- Manual booking processes leading to long wait times
- No transparency in service tracking
- Cash-only payments creating security concerns
- Lack of loyalty programs to retain customers
- Difficult management for car wash business owners
- Limited opportunities for mobile/on-demand services

### Our Solution

AutoFlow Pro provides a **complete digital ecosystem** that connects customers, detailers, and car wash owners on one platform with:
- **2-tap booking** system
- **M-Pesa integration** for cashless payments
- **Real-time tracking** of service progress
- **Loyalty rewards** program (10th wash free)
- **Mobile service** options (detailers come to you)
- **Business management** tools for owners

---

## ✨ Key Features

### 🎫 For Customers (Car Owners)

#### Booking & Services
- **Quick Booking**: Book car wash services in 2 taps from anywhere in Nairobi
- **Service Selection**: Choose from Basic Wash, Full Detailing, Interior Cleaning, Mobile Service, and more
- **Location Options**: 
  - Visit nearby car wash locations
  - Request mobile service (detailer comes to you)
- **Scheduling**: Book immediately or schedule for later
- **Vehicle Management**: Add multiple vehicles with photos and details
- **Real-time Tracking**: Track your booking status from "Pending" → "In Progress" → "Completed"

#### Payments & Rewards
- **M-Pesa Integration**: Pay seamlessly with M-Pesa STK Push
- **Digital Receipts**: Automatic transaction records with M-Pesa receipt numbers
- **Loyalty Program**: Earn 1 point per wash, 10th wash is FREE
- **Transparent Pricing**: See exact costs before booking
- **Tip Detailers**: Add tips for excellent service via M-Pesa

#### Account Management
- **Dashboard**: View booking history, active bookings, and loyalty points
- **Notifications**: Email and in-app notifications for booking updates
- **Profile Management**: Update personal information and preferences
- **KYC Verification**: Upload ID documents for account verification

---

### 🧽 For Detailers (Service Providers)

#### Job Management
- **Job Dashboard**: View all assigned bookings
- **Status Updates**: Mark jobs as "In Progress" or "Completed"
- **Customer Details**: Access vehicle info and customer notes
- **Service Instructions**: Clear details on service type and requirements

#### Earnings & Tips
- **Earnings Tracker**: Monitor daily, weekly, and monthly earnings
- **Tip Management**: Receive and track tips from satisfied customers
- **Payment History**: Complete transaction records
- **Payout Information**: Track pending and completed payouts

#### Profile & Approval
- **Professional Profile**: Showcase experience, ratings, and completed jobs
- **Approval System**: Get approved by car wash owners to start working
- **Rating System**: Build reputation through customer reviews

---

### 🏢 For Car Wash Owners (Admins)

#### Business Management
- **Owner Dashboard**: Comprehensive business overview
  - Active services count
  - Total users (customers + detailers)
  - Transaction volume
  - Revenue tracking
- **Multi-location Support**: Manage multiple car wash locations
- **Business Analytics**: Performance metrics and trends

#### Service Management
- **Service Catalog**: Create and manage service offerings
  - Basic Wash (KES 300)
  - Full Detailing (KES 1,500)
  - Interior Cleaning (KES 800)
  - Mobile Service (KES 800+)
  - Package Deals
- **Pricing Control**: Set and update service prices
- **Service Categories**: Organize by type (wash, detailing, maintenance, packages)

#### User & Staff Management
- **User Overview**: View all active customers and detailers
- **Staff Approval**: Review and approve detailer applications
- **User Suspension**: Suspend or activate user accounts
- **Role Management**: Assign appropriate roles and permissions

#### Financial Management
- **Payment Tracking**: View all M-Pesa transactions
  - Transaction ID
  - Customer details
  - Amount paid
  - M-Pesa receipt number
  - Payment status (success/pending/failed)
- **Revenue Reports**: Track income by service type and date
- **Payout Management**: Manage detailer payments

#### Inventory Management (Coming Soon)
- **Stock Tracking**: Monitor cleaning supplies and equipment
- **Low Stock Alerts**: Get notified when supplies run low
- **Reorder Management**: Track inventory purchases

#### Loyalty Program Management
- **Program Configuration**: Set visits required for free wash
- **Customer Tracking**: Monitor customer loyalty progress
- **Reward Redemption**: Process free wash redemptions

---

### 🔐 Platform Admin Features

#### User Approvals
- **Detailer Verification**: Review and approve detailer applications with:
  - ID verification
  - Experience validation
  - Background checks
- **User Management**: Monitor platform users across all roles

#### Dispute Resolution
- **Complaint System**: Handle customer disputes
- **Issue Tracking**: Monitor and resolve service quality issues
- **Refund Processing**: Process refunds when necessary

---

## 🔄 User Workflow

### Customer Journey

```
1. Sign Up
   ↓
2. Add Vehicle Details (Model, License Plate, Photos)
   ↓
3. Browse Services & Locations
   ↓
4. Select Service (Basic, Detailing, Mobile)
   ↓
5. Choose Date/Time
   ↓
6. Pay with M-Pesa (STK Push)
   ↓
7. Receive Confirmation & Track Status
   ↓
8. Service Completed → Leave Review
   ↓
9. Earn Loyalty Points (10th wash FREE!)
```

### Detailer Journey

```
1. Sign Up as Detailer
   ↓
2. Upload KYC Documents
   ↓
3. Wait for Car Wash Owner Approval
   ↓
4. Get Approved ✓
   ↓
5. Receive Job Assignments
   ↓
6. Update Job Status (In Progress → Completed)
   ↓
7. Receive Payment + Tips
   ↓
8. Build Rating & Reputation
```

### Car Wash Owner Journey

```
1. Sign Up as Owner (Auto-Approved)
   ↓
2. Set Up Business Profile
   ↓
3. Create Services & Set Prices
   ↓
4. Approve Detailers
   ↓
5. Monitor Bookings & Revenue
   ↓
6. Manage Inventory
   ↓
7. Process Payments & Track Analytics
```

---

## 🔌 Integrations & APIs

### M-Pesa Daraja API (Safaricom)

**Purpose**: Enable cashless payments via M-Pesa  
**Implementation**: STK Push (Lipa Na M-Pesa Online)

#### Features:
- **STK Push**: Automated payment prompt sent to customer's phone
- **Real-time Callbacks**: Instant payment confirmation
- **Transaction Tracking**: Store M-Pesa receipt numbers
- **Payment Status**: Track pending/success/failed payments

#### Credentials (Sandbox):
```env
MPESA_CONSUMER_KEY=9t9EdgWDctNpDwCAlWudZNG1GRtX5VVGu1S1EJ8cSiX9D9kU
MPESA_CONSUMER_SECRET=n8YrAg9UsNoUYXdxtJxWjWnmiHYK2aGJn12wfyqbgx3kzUstN4hAIS11K4KV49sw
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa/callback
```

#### Endpoints:
- `POST /api/payments/mpesa/stkpush` - Initiate payment
- `POST /api/payments/mpesa/callback` - Receive payment confirmation
- `GET /api/payments/status/:checkoutRequestId` - Check payment status

---

### Email Notifications (Nodemailer)

**Purpose**: Automated email notifications for key events

#### Use Cases:
- Welcome emails on registration
- Booking confirmations
- Service completion notifications
- Payment receipts
- Approval notifications

#### Configuration:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

### File Upload (Multer)

**Purpose**: Handle image uploads for profiles and vehicles

#### Features:
- Profile pictures
- Vehicle photos
- KYC documents (ID cards, licenses)
- File validation and size limits

---

### Neon PostgreSQL Database

**Purpose**: Serverless PostgreSQL database hosting

#### Benefits:
- Auto-scaling
- High availability
- Branching for dev/test environments
- Easy backups and restores

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Sonner** - Toast notifications
- **Lucide Icons** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Neon** - Serverless PostgreSQL hosting
- **JWT** - Secure authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **dotenv** - Environment configuration

### Payment Integration
- **M-Pesa Daraja API** - Mobile money payments
- **STK Push** - Automated payment prompts

### DevOps & Deployment
- **Vercel** - Frontend hosting (recommended)
- **Railway/Render** - Backend hosting options
- **GitHub Actions** - CI/CD pipelines (optional)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Neon PostgreSQL account** ([sign up free](https://neon.tech))
- **M-Pesa Developer account** ([Daraja Portal](https://developer.safaricom.co.ke))
- **Gmail account** (for SMTP notifications)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/autoflow-pro.git
cd autoflow-pro
```

#### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

#### 3. Set Up Environment Variables

**Frontend** - Create `.env` in project root:
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend** - Create `server/.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# M-Pesa (Sandbox)
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=9t9EdgWDctNpDwCAlWudZNG1GRtX5VVGu1S1EJ8cSiX9D9kU
MPESA_CONSUMER_SECRET=n8YrAg9UsNoUYXdxtJxWjWnmiHYK2aGJn12wfyqbgx3kzUstN4hAIS11K4KV49sw
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa/callback

# Server
PORT=3001
NODE_ENV=development
```

#### 4. Set Up Database

1. Create a PostgreSQL database on [Neon](https://console.neon.tech)
2. Copy your connection string
3. Run the schema:

```bash
# Option 1: Via Neon SQL Editor
# Copy contents of database/schema.sql and run in Neon Console

# Option 2: Via psql
psql "your-neon-connection-string" -f database/schema.sql

# Run additional schemas
psql "your-neon-connection-string" -f database/kyc_schema.sql
psql "your-neon-connection-string" -f database/payments_schema.sql
```

#### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd server
node index.js
# Runs on http://localhost:3001
```

#### 6. Access the Platform

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Super Admin Login**:
  - Email: `admin@autoflow.com`
  - Password: `admin123`

---

## 📁 Project Structure

```
autoflow-pro/
├── public/                    # Static assets
│   ├── herobg.JPG            # Hero section background
│   └── robots.txt
├── src/                       # Frontend source
│   ├── components/           # React components
│   │   ├── layout/          # Layout wrappers
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── OwnerLayout.tsx
│   │   │   ├── OperatorLayout.tsx
│   │   │   └── CustomerLayout.tsx
│   │   ├── ui/              # shadcn/ui components
│   │   ├── kyc/             # KYC components
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components
│   │   ├── admin/           # Super admin pages (8 pages)
│   │   ├── owner/           # Car wash owner pages (7 pages)
│   │   ├── operator/        # Detailer pages (3 pages)
│   │   ├── customer/        # Customer pages (6 pages)
│   │   ├── onboarding/      # User onboarding flows
│   │   ├── LandingPage.tsx
│   │   └── LoginPage.tsx
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # Authentication state
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API client with all endpoints
│   │   └── utils.ts
│   ├── types/               # TypeScript types
│   └── App.tsx              # Main app component
├── server/                   # Backend API
│   ├── config/              # Configuration
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── notifications.js # Email service
│   │   └── upload.js        # File upload config
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── users.js         # User management
│   │   ├── bookings.js      # Booking management
│   │   ├── services.js      # Service catalog
│   │   ├── vehicles.js      # Vehicle management
│   │   ├── payments.js      # M-Pesa integration
│   │   ├── kyc.js           # KYC verification
│   │   ├── notifications.js # Notifications
│   │   └── uploads.js       # File uploads
│   ├── services/            # Business logic
│   │   └── kycService.js    # KYC processing
│   ├── index.js             # Server entry point
│   └── package.json
├── database/                # SQL schemas
│   ├── schema.sql           # Main database schema
│   ├── kyc_schema.sql       # KYC tables
│   └── payments_schema.sql  # Payments tables
└── package.json             # Frontend dependencies
```

---

## 🔐 Authentication & Authorization

### User Roles

1. **Customer** - Car owners who book services
2. **Detailer** - Service providers (require approval)
3. **Admin (Owner)** - Car wash business owners
4. **Super Admin** - Platform administrators

### Role-Based Access Control (RBAC)

```typescript
// Route Protection
/customer/*     → Customer role only
/operator/*     → Detailer role only
/owner/*        → Admin role (car wash owners)
/admin/*        → Super admin (platform admin)
```

### Authentication Flow

1. **Registration**: User creates account with role selection
2. **Approval**: 
   - Customers & Owners → Auto-approved
   - Detailers → Require car wash owner approval
3. **Login**: JWT token issued on successful authentication
4. **Authorization**: Token validated on protected routes
5. **Session**: Token stored in localStorage, 7-day expiry

---

## 💳 M-Pesa Payment Flow

### STK Push Process

```
1. Customer initiates payment
   ↓
2. Backend calls M-Pesa API with:
   - Phone number
   - Amount
   - Booking ID
   ↓
3. M-Pesa sends STK Push to customer's phone
   ↓
4. Customer enters M-Pesa PIN
   ↓
5. M-Pesa processes payment
   ↓
6. Callback sent to backend
   ↓
7. Payment record updated in database
   ↓
8. Customer receives confirmation
```

### Payment Records

All payments stored with:
- Transaction ID
- M-Pesa receipt number
- Customer details
- Amount paid
- Booking reference
- Timestamp
- Status (success/pending/failed)

---

## 📊 Database Schema

### Core Tables

- **users** - All platform users (customers, detailers, owners, admin)
- **bookings** - Car wash service bookings
- **services** - Available car wash services
- **vehicles** - Customer vehicles
- **payments** - M-Pesa transactions
- **kyc_profiles** - User verification data
- **loyalty_accounts** - Customer loyalty points
- **notifications** - System and email notifications

### Key Relationships

```
users (1) ←→ (N) vehicles
users (1) ←→ (N) bookings (as customer)
users (1) ←→ (N) bookings (as detailer)
bookings (N) ←→ (1) services
bookings (1) ←→ (1) payments
users (1) ←→ (1) kyc_profiles
users (1) ←→ (1) loyalty_accounts
```

---

## 🎨 UI/UX Features

### Design System
- **Dark Mode First** - Modern dark theme optimized for readability
- **Responsive Design** - Mobile, tablet, and desktop support
- **Glassmorphism** - Frosted glass effects on cards
- **Smooth Animations** - Slide-up and fade-in transitions
- **Custom Gradients** - Brand-consistent color schemes

### Key UI Components
- **Dashboard Cards** - Stats overview with live data
- **Data Tables** - Sortable, searchable tables
- **Modals & Dialogs** - Confirm actions and forms
- **Toast Notifications** - Success/error feedback
- **Loading States** - Skeleton loaders and spinners
- **Empty States** - Helpful messages when no data

---

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Default Admin Login
```
Email: admin@autoflow.com
Password: admin123
```

## Project Structure

```
autoflow-pro/
├── server/              # Express.js API
│   ├── config/         # Database, uploads, notifications
│   ├── middleware/     # Auth middleware
│   └── routes/         # API endpoints
├── database/           # SQL schema
├── uploads/            # User-uploaded files
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── lib/           # API client, utilities
│   └── context/       # Auth context
└── .env               # Environment variables
```

## API Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive API documentation.

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

**Services**
- `GET /api/services` - List services
- `POST /api/services` - Create (admin)
- `DELETE /api/services/:id` - Delete (admin)

**Bookings**
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update status

**File Uploads**
- `POST /api/uploads/profile` - Upload profile picture
- `POST /api/uploads/vehicle/:id` - Upload vehicle photo

**Notifications**
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## Development

### Commands

```bash
# Frontend only
npm run dev

# Backend only
npm run dev:server

# Both (recommended)
npm run dev:all

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

Build test:
```bash
npm run build
```

API health check:
```bash
curl http://localhost:3001/api/health
```

## Email Setup

For email notifications, create a Gmail app password:

1. Go to https://myaccount.google.com/apppasswords
2. Create app password for "Mail"
3. Add to `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

## Deployment

### Frontend (Vercel/Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables

### Backend (Railway/Render)
1. Root directory: `/`
2. Build command: `npm install`
3. Start command: `node server/index.js`
4. Set environment variables

### Database
Already hosted on Neon PostgreSQL ✅

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For detailed setup instructions, see:
- [GETTING_STARTED.md](./GETTING_STARTED.md)
- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)

## Roadmap

- [ ] Payment integration (M-Pesa, Stripe)
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] SMS notifications
- [ ] Multi-language support

---

Built with ❤️ by Talent Index

3.1 High-Level Architecture

Frontend (Web / Mobile)
        ↓
Backend API (Node / Nest / Supabase)
        ↓
Database (Postgres)
        ↓
Payment Rails
   ├─ M-Pesa Paybill
   └─ Crypto → Fiat Provider

3.2 Key External Integrations
	•	Safaricom — M-Pesa Paybill
	•	WalletConnect — Wallet connections
	•	Transak / Yellow Card — Crypto → Fiat

⸻

4. AUTHENTICATION & USER MANAGEMENT

4.1 Auth Flow
	•	Email + Password
	•	Role assigned on signup
	•	Session persisted (JWT)

4.2 Signup Flow (Owner Example)
	1.	Email + Password
	2.	Role = OWNER
	3.	Owner submits:
	•	Name
	•	ID
	•	Phone
	•	Wallet address
	4.	Status = PENDING_APPROVAL
	5.	Admin approves

⸻

5. DATABASE SCHEMA (CORE)

5.1 Users

users (
  id UUID PK,
  email UNIQUE,
  phone,
  role,
  status,
  created_at
)

5.2 Car Washes

car_washes (
  id UUID PK,
  owner_id FK,
  name,
  wallet_id,
  approved
)

5.3 Transactions

transactions (
  id UUID PK,
  payer_id,
  receiver_id,
  amount,
  currency,
  method,
  status,
  reference
)


⸻

6. PAYMENT SYSTEM DESIGN

6.1 Fiat Payments (M-Pesa)

Flow
	1.	Customer enters phone + amount
	2.	STK Push triggered
	3.	User enters PIN
	4.	Callback received
	5.	Wallet credited

Backend Rule
	•	All M-Pesa logic server-side
	•	Callbacks are authoritative

⸻

6.2 Crypto Payments (WalletConnect)

Supported
	•	USDC / USDT
	•	Polygon / BSC

Flow
	1.	User connects wallet
	2.	Signs transaction
	3.	Tx hash verified
	4.	Conversion triggered

⸻

6.3 Stablecoin → Fiat (Tando-Like)

Flow

User Wallet → Stablecoin Transfer
           → Provider Conversion
           → M-Pesa Paybill
           → Car Wash Wallet

Why This Works
	•	User pays crypto
	•	Merchant receives KES
	•	Platform abstracts complexity

⸻

7. QR / SCAN-TO-PAY SYSTEM

QR Payload

{
  "type": "TRACKWASH_PAY",
  "merchantId": "xyz",
  "amount": 800,
  "currency": "KES"
}

UX
	•	Same QR
	•	Choose M-Pesa or Crypto
	•	One settlement endpoint

⸻

8. INTERNAL WALLETS & LEDGER

8.1 Internal Wallets

Not blockchain wallets.

wallet {
  balance_fiat
  balance_crypto
}

8.2 Ledger Rule
	•	Balance = sum(transactions)
	•	Never mutable manually

⸻

9. ADMIN & APPROVAL FLOWS

Admin Capabilities
	•	Approve onboarding
	•	View all transactions
	•	Freeze wallets
	•	Initiate payouts

⸻

10. SECURITY & COMPLIANCE
	•	Webhook signature verification
	•	Environment-based secrets
	•	Rate limiting
	•	Audit logs
	•	No private keys stored

⸻

11. DEPLOYMENT STRATEGY

Environments
	•	Dev
	•	Staging
	•	Production

Secrets
	•	.env
	•	Vaulted in CI/CD

⸻

12. TESTING STRATEGY

Type	Coverage
Unit	Payments
Integration	M-Pesa
E2E	Pay → Settle
Load	STK Push


⸻

13. MVP DELIVERY CHECKLIST

✅ No mock data
✅ Real payments
✅ WalletConnect live
✅ Admin approvals
✅ Ledger consistency

⸻

14. FUTURE ROADMAP
	•	NFC payments
	•	Recurring subscriptions
	•	Loyalty tokens
	•	Multi-country expansion

⸻

15. HANDOFF NOTES FOR DEVELOPERS
	•	Payments are event-driven
	•	Frontend never trusts itself
	•	Backend is source of truth
	•	Every transaction is immutable


👉 Tell me what you want next and I’ll deliver it immediately.
