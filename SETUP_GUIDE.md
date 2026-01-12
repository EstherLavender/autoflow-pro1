# AutoFlow Pro - Complete Setup Guide

## 🚀 Quick Start

### 1. Database Setup (Neon PostgreSQL)

Run the schema in your Neon console:

```bash
# Connect to your Neon database
psql 'postgresql://neondb_owner:npg_e9B7EXpDRYQC@ep-curly-shadow-ahtx1fp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Then run the schema
\i database/schema.sql
```

Or copy the contents of `database/schema.sql` and run in Neon SQL Editor.

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_e9B7EXpDRYQC@ep-curly-shadow-ahtx1fp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create `.env` file in the src folder:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Run the Application

```bash
# Run both frontend and backend together
npm run dev:all

# Or run separately:
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:server
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

### 6. Default Login

```
Email: admin@autoflow.com
Password: admin123
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer", // or "detailer", "admin"
  "full_name": "John Doe",
  "phone": "+254712345678"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Services Endpoints

#### Get All Services
```http
GET /api/services
```

#### Create Service (Admin only)
```http
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Premium Wash",
  "description": "Full interior and exterior cleaning",
  "price": 800,
  "duration": 45,
  "category": "wash",
  "loyalty_points": 1
}
```

### Bookings Endpoints

#### Get All Bookings
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Create Booking (Customer only)
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_id": "uuid",
  "service_id": "uuid",
  "scheduled_at": "2026-01-15T10:00:00Z",
  "notes": "Please use premium wax"
}
```

#### Update Booking Status (Admin/Detailer)
```http
PATCH /api/bookings/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress" // or "completed", "cancelled"
}
```

#### Assign Detailer (Admin only)
```http
PATCH /api/bookings/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "detailer_id": "uuid"
}
```

### Vehicles Endpoints

#### Get Customer Vehicles
```http
GET /api/vehicles
Authorization: Bearer {token}
```

#### Add Vehicle (Customer only)
```http
POST /api/vehicles
Authorization: Bearer {token}
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "license_plate": "KDA 123A",
  "color": "Silver"
}
```

### User Management Endpoints (Admin only)

#### Get All Users
```http
GET /api/users?status=pending&role=detailer
Authorization: Bearer {token}
```

#### Get Pending Users
```http
GET /api/users/pending
Authorization: Bearer {token}
```

#### Approve User
```http
PATCH /api/users/{id}/approve
Authorization: Bearer {token}
```

#### Suspend User
```http
PATCH /api/users/{id}/suspend
Authorization: Bearer {token}
```

---

## 🎯 Features Implemented

### ✅ Core MVP Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin, Detailer, Customer)
   - User registration and login
   - Protected routes

2. **User Management (Admin)**
   - View all users
   - Approve/reject pending registrations
   - Suspend/activate users
   - User statistics

3. **Services Management (Admin)**
   - Create, read, update, delete services
   - Service categories and pricing
   - Loyalty points configuration

4. **Booking System**
   - Customers create bookings
   - Admin assigns bookings to detailers
   - Detailers accept and complete jobs
   - Real-time status tracking

5. **Vehicle Management (Customer)**
   - Add multiple vehicles
   - Edit vehicle details
   - Delete vehicles

6. **Dashboards**
   - **Admin Dashboard**: User approvals, booking overview, statistics
   - **Detailer Dashboard**: Assigned jobs, job queue, earnings
   - **Customer Dashboard**: Booking history, vehicles, loyalty status

### ❌ Features Removed

- AI Diagnostics (sound recording and analysis)
- Supabase dependencies
- Mock data

---

## 🔐 Role-Based Access

### Admin
- Full access to all features
- User management (approve, suspend, activate)
- Service management (CRUD)
- Booking assignment
- View all bookings and users
- System statistics

### Detailer
- View assigned bookings
- Update job status (in_progress, completed)
- View job history
- Earnings tracking
- Requires admin approval after registration

### Customer
- Create bookings
- Manage vehicles
- View booking history
- Cancel bookings
- Loyalty program access
- Direct activation (no approval needed)

---

## 📁 Project Structure

```
autoflow-pro/
├── server/                    # Backend API
│   ├── config/
│   │   └── database.js       # Neon DB connection
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── services.js      # Services endpoints
│   │   ├── bookings.js      # Bookings endpoints
│   │   ├── vehicles.js      # Vehicles endpoints
│   │   └── users.js         # User management
│   └── index.js             # Server entry point
├── src/                      # Frontend React app
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── customer/       # Customer pages
│   │   └── operator/       # Detailer pages
│   ├── context/
│   │   └── AuthContext.tsx # Auth state management
│   ├── lib/
│   │   └── api.ts          # API client
│   └── App.tsx             # App entry point
├── database/
│   └── schema.sql          # Database schema
└── package.json
```

---

## 🚧 TODO / Future Enhancements

### Phase 1 (Current MVP) ✅
- [x] Authentication with JWT
- [x] Role-based access control
- [x] User management
- [x] Service management
- [x] Booking system
- [x] Vehicle management
- [x] All three dashboards

### Phase 2 (Next Sprint)
- [ ] M-Pesa payment integration
- [ ] Transaction history
- [ ] Loyalty program automation
- [ ] SMS/Email notifications
- [ ] Inventory management
- [ ] Garage locations management

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Dispute resolution system
- [ ] Rating and review system

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Connection timeout
```
**Solution:** Check your Neon database URL in `.env` file. Ensure SSL mode is set correctly.

### Port Already in Use
```
Error: Port 3001 is already in use
```
**Solution:** Change PORT in `.env` or kill the process using port 3001:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure `CLIENT_URL` in server `.env` matches your frontend URL (default: http://localhost:5173)

### Token Expired
```
403 Forbidden: Invalid or expired token
```
**Solution:** Log out and log in again. Token expires after 7 days by default.

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review API documentation above
3. Check database schema in `database/schema.sql`
4. Verify environment variables in `.env`

---

**Last Updated:** January 12, 2026
**Version:** 1.0.0 (MVP)
**Database:** Neon PostgreSQL
**Stack:** React + TypeScript + Node.js + Express + PostgreSQL
