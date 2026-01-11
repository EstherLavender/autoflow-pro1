
TRACKWASH — SYSTEM DESIGN & IMPLEMENTATION DOCUMENTATION

Version: 1.0
Status: MVP → Production
Audience: Engineers, Product, Payments, Ops
Last Updated: Jan 2026

⸻

1. PRODUCT OVERVIEW

1.1 What is TrackWash?

TrackWash is a multi-role car wash management and payment platform enabling:
	•	Car wash owners to manage branches, staff, revenue
	•	Detailers to receive jobs & payouts
	•	Customers to pay via M-Pesa or Crypto (Stablecoins)
	•	Admins to approve, monitor, and settle payments

1.2 Core Value Proposition
	•	Unified fiat + crypto payments
	•	Instant settlement to M-Pesa Paybill
	•	Transparent, auditable transactions
	•	Mobile-first, QR-based payments (Tando-like UX)

⸻

2. USER ROLES & PERMISSIONS

2.1 Roles

Role	Description
Super Admin	Platform owner
Car Wash Owner	Business admin
Detailer	Service provider
Customer	End user

2.2 Permission Matrix

Feature	Admin	Owner	Detailer	Customer
View dashboard	✅	✅	✅	✅
Receive payments	❌	✅	✅	❌
Make payments	❌	❌	❌	✅
Approvals	✅	❌	❌	❌


⸻

3. SYSTEM ARCHITECTURE

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
