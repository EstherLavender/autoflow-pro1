# 🚀 Getting Started with AutoFlow Pro

## Prerequisites
- Node.js (v18 or higher)
- Neon PostgreSQL account (you already have the database URL)
- Bun or npm installed

## 📝 Step-by-Step Setup

### 1. Create Environment File
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_e9B7EXpDRYQC@ep-curly-shadow-a83hx1fp3-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Important:** Change the `JWT_SECRET` to a random string for security.

### 2. Install Dependencies
```bash
npm install
```

This will install all frontend and backend dependencies.

### 3. Set Up Database Schema
1. Go to your Neon Console: https://console.neon.tech
2. Select your database `neondb`
3. Click on "SQL Editor"
4. Copy the entire contents of `database/schema.sql`
5. Paste and execute it

This will create all tables and insert the admin user.

### 4. Start the Development Servers
```bash
npm run dev:all
```

This command starts both:
- **Frontend** on http://localhost:5173
- **Backend API** on http://localhost:3001

## 🔑 Default Admin Login
After database setup, use these credentials:
- **Email:** admin@autoflow.com
- **Password:** admin123

## 📂 Project Structure
```
autoflow-pro/
├── server/              # Backend API (Express.js)
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth & authorization
│   └── routes/         # API endpoints
├── database/           # SQL schema
├── src/                # Frontend (React + TypeScript)
│   ├── components/    # UI components
│   ├── context/       # Auth context
│   ├── lib/           # API client & utilities
│   ├── pages/         # Application pages
│   └── Services/      # Service layer
└── .env               # Environment variables (create this)
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Sign out

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Bookings
- `GET /api/bookings` - List bookings (filtered by role)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/assign` - Assign detailer (admin only)

### Vehicles
- `GET /api/vehicles` - List user's vehicles
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Users (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/pending` - List pending approvals
- `PATCH /api/users/:id/approve` - Approve user
- `PATCH /api/users/:id/reject` - Reject user
- `PATCH /api/users/:id/suspend` - Suspend user

## 👥 User Roles

### Customer
- Book car wash services
- Manage their vehicles
- Track booking history
- View rewards and loyalty points

### Detailer
- View assigned jobs
- Update job status
- Receive customer tips
- Track earnings

### Admin (Car Wash Owner)
- Manage all services
- Approve/reject detailers
- Assign jobs to detailers
- View all bookings and payments
- Manage inventory and pricing

## 🛠 Development Commands

```bash
# Run frontend only
npm run dev

# Run backend only
npm run dev:server

# Run both (recommended)
npm run dev:all

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing the Setup

1. Start the servers: `npm run dev:all`
2. Open http://localhost:5173
3. Click "Sign in" or navigate to `/login`
4. Use admin credentials to login
5. You should be redirected to `/admin` dashboard

## 🔄 User Approval Flow

1. **Customer Registration:** Auto-approved, instant access
2. **Detailer Registration:** Requires admin approval
3. **Admin Registration:** Requires super admin approval (24-48 hours)

## 🐛 Troubleshooting

### Database Connection Error
- Check your `DATABASE_URL` in `.env`
- Ensure your Neon database is active
- Verify SSL mode is set to `require`

### Authentication Not Working
- Clear localStorage in browser (DevTools → Application → Local Storage)
- Check if backend is running on port 3001
- Verify JWT_SECRET is set in `.env`

### Port Already in Use
If port 3001 or 5173 is busy:
```bash
# Change PORT in .env for backend
PORT=3002

# For frontend, update vite.config.ts
server: { port: 5174 }
```

## 📚 Next Steps

1. **Customize Services:** Update services in admin dashboard
2. **Add Detailers:** Register detailer accounts and approve them
3. **Configure Pricing:** Set service prices and packages
4. **Test Booking Flow:** Create a test customer and book a service
5. **Set Up Payments:** Integrate payment gateway (M-Pesa, Stripe, etc.)

## 🤝 Support

For issues or questions:
- Check the `SETUP_GUIDE.md` for detailed API documentation
- Review `DATABASE_SCHEMA.md` for database structure
- See `MISSING_INTEGRATIONS.md` for pending features

---

**Remember:** This is an MVP. Payment integrations, real-time notifications, and advanced features need to be implemented based on your requirements.
