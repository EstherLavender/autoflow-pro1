# 🚗 AutoFlow Pro

A modern car wash management platform built with React, TypeScript, Express.js, and PostgreSQL.

## Features

### For Customers
- 🚙 Book car wash services
- 📸 Manage vehicles with photos
- 🎯 Track bookings in real-time
- 🏆 Earn loyalty points and rewards
- 📧 Email and system notifications

### For Detailers
- 📋 View assigned jobs
- ✅ Update job status
- 💰 Track earnings and tips
- 📬 Receive job assignment notifications

### For Admins (Car Wash Owners)
- 👥 Approve/manage detailers
- 🛠 Create and manage services
- 📊 View all bookings and payments
- 📦 Manage inventory
- 💳 Track transactions

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router
- Axios
- Sonner (toast notifications)

**Backend:**
- Node.js + Express.js
- PostgreSQL (Neon)
- JWT Authentication
- Multer (file uploads)
- Nodemailer (email notifications)
- bcrypt (password hashing)

## Quick Start

### Prerequisites
- Node.js 18+
- Neon PostgreSQL account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Talent-Index/autoflow-pro.git
cd autoflow-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
DATABASE_URL=your-neon-postgresql-url
JWT_SECRET=your-secret-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. **Set up database**
- Go to [Neon Console](https://console.neon.tech)
- Run the SQL from `database/schema.sql`

5. **Start development servers**
```bash
npm run dev:all
```

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
