# 🚗 AutoFlow Pro

**AutoFlow Pro** is a comprehensive car wash management platform for Nairobi, Kenya. It connects car owners with car wash service providers, enabling seamless booking, payment processing via M-Pesa, real-time tracking, and loyalty rewards.

## 🎯 Project Purpose

AutoFlow Pro revolutionizes the car wash industry by providing:
- **For Customers**: Easy booking, mobile payments, service tracking, and loyalty rewards
- **For Car Wash Owners**: Business management tools, user approval system, payment tracking, and analytics
- **For Detailers**: Job management, earnings tracking, and performance metrics
- **For Platform Admins**: User management, payment oversight, and dispute resolution

---

## ✨ Key Features

### 🏠 Customer Features
- **Quick Booking**: Book car wash services in 2 taps
- **Mobile or Location-Based**: Choose nearby car washes or request mobile service
- **M-Pesa Integration**: Secure payment processing via M-Pesa STK Push
- **Vehicle Management**: Save and manage multiple vehicles
- **Loyalty Program**: Earn free washes (10th wash free)
- **Real-Time Tracking**: Track service progress and detailer location
- **Service History**: View past bookings and receipts
- **Ratings & Reviews**: Rate services and detailers

### 💼 Car Wash Owner Features
- **Business Dashboard**: Comprehensive overview of business metrics
- **Service Management**: Create, edit, and manage service offerings
- **User Management**: View and manage customers and detailers
- **Payment Tracking**: Monitor all transactions and revenue
- **Inventory Management**: Track supplies and stock levels (coming soon)
- **Loyalty Configuration**: Customize rewards programs
- **Dispute Resolution**: Handle customer complaints
- **Analytics**: Business insights and performance metrics

### 🔧 Detailer Features
- **Job Dashboard**: View assigned jobs and upcoming bookings
- **Earnings Tracking**: Monitor daily, weekly, and monthly earnings
- **Job Management**: Accept/complete jobs and update status
- **Profile Management**: Manage skills, ratings, and availability
- **Tip Collection**: Receive and track customer tips
- **Performance Metrics**: Track completion rate and customer ratings

### 👑 Super Admin Features
- **Platform Oversight**: Manage all users across the platform
- **User Approvals**: Approve detailer registrations
- **Payment Monitoring**: Oversee all M-Pesa transactions
- **Dispute Management**: Resolve conflicts between parties
- **System Analytics**: Platform-wide statistics and insights

---

## 🔄 User Workflow

### Customer Journey
1. **Sign Up** → Account active immediately
2. **Add Vehicles** → Register car details
3. **Browse Services** → View available car wash services
4. **Book Service** → Select service, vehicle, and time
5. **Pay with M-Pesa** → Receive STK Push prompt on phone
6. **Track Service** → Monitor detailer arrival and progress
7. **Rate & Review** → Provide feedback
8. **Earn Rewards** → Get 10th wash free

### Car Wash Owner Journey
1. **Sign Up** → Account active immediately, redirect to owner dashboard
2. **Setup Business** → Add business details and services
3. **Manage Services** → Create service packages with pricing
4. **Monitor Operations** → Track bookings and revenue
5. **Manage Team** → Approve/manage detailers
6. **Handle Payments** → View M-Pesa transactions
7. **Resolve Issues** → Address customer disputes

### Detailer Journey
1. **Sign Up** → Account pending approval
2. **Await Approval** → Car wash owner reviews application
3. **Get Approved** → Access detailer dashboard
4. **Receive Jobs** → Get assigned to bookings
5. **Complete Services** → Update job status
6. **Earn Money** → Track earnings and tips
7. **Build Reputation** → Improve ratings and reviews

---

## 🔌 Integrations

### M-Pesa Daraja API
- **STK Push**: Initiate customer payments
- **Callback Handling**: Process payment confirmations
- **Transaction Verification**: Check payment status
- **Receipt Generation**: Automatic M-Pesa receipt codes
- **Sandbox Mode**: Development environment support
- **Production Ready**: Live credentials support

### PostgreSQL (Neon Cloud)
- **Cloud Hosting**: Scalable PostgreSQL database
- **Connection Pooling**: Optimized performance
- **SSL Security**: Encrypted connections
- **Automatic Backups**: Data safety
- **Real-time Queries**: Fast data retrieval

### Other Integrations
- **JWT Authentication**: Secure token-based auth
- **Multer**: File upload handling
- **Nodemailer**: Email notifications (configured)
- **Express**: RESTful API framework

---

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Beautiful component library
- **Axios**: HTTP client with interceptors
- **Sonner**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **dotenv**: Environment management
- **Multer**: File uploads

### DevOps
- **Vercel**: Frontend hosting (ready)
- **Neon**: Database hosting
- **Git**: Version control

---

## 📊 Database Schema

### Core Tables
- **users**: All user accounts (customers, detailers, admins, owners)
- **vehicles**: Customer vehicle information
- **services**: Car wash service offerings
- **bookings**: Service bookings and assignments
- **payments**: M-Pesa transaction records
- **notifications**: In-app notification system
- **kyc**: KYC verification documents

### Key Relationships
- Users → Bookings (customer_id, assigned_detailer_id)
- Vehicles → Bookings (vehicle_id)
- Services → Bookings (service_id)
- Bookings → Payments (booking_id)

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
PostgreSQL 14+
M-Pesa Daraja API credentials (Sandbox or Production)
```

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd autoflow-pro
```

2. **Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

3. **Environment Setup**
```bash
# Copy environment files
cp server/.env.example server/.env

# Update with your credentials
```

4. **Database Setup**
```bash
# Run schema files in Neon console or local PostgreSQL
psql -U postgres -d autoflow -f database/schema.sql
psql -U postgres -d autoflow -f database/kyc_schema.sql
psql -U postgres -d autoflow -f database/payments_schema.sql
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

---

## 🔐 Authentication & Roles

### User Roles
1. **customer**: Regular car owners
2. **admin**: Car wash business owners
3. **detailer**: Service providers
4. **super_admin**: Platform administrators (admin@autoflow.com)

### Approval Flow
- ✅ **Customers**: Active immediately
- ✅ **Car Wash Owners**: Active immediately
- ⏳ **Detailers**: Require car wash owner approval
- ✅ **Super Admin**: Pre-configured in database

### Access Control
- Role-based route protection
- JWT token verification
- Status verification (active/pending/suspended)

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - User registration
POST   /api/auth/login          - User login
GET    /api/auth/me             - Get current user
POST   /api/auth/logout         - User logout
```

### Users (Admin Only)
```
GET    /api/users               - Get all users
GET    /api/users/pending       - Get pending approvals
GET    /api/users/stats         - Get user statistics
PATCH  /api/users/:id/approve   - Approve user
DELETE /api/users/:id/reject    - Reject user
PATCH  /api/users/:id/suspend   - Suspend user
PATCH  /api/users/:id/activate  - Activate user
```

### Services
```
GET    /api/services            - Get all services
GET    /api/services/:id        - Get service by ID
POST   /api/services            - Create service (Admin)
PUT    /api/services/:id        - Update service (Admin)
DELETE /api/services/:id        - Delete service (Admin)
```

### Bookings
```
GET    /api/bookings            - Get bookings (role-filtered)
GET    /api/bookings/:id        - Get booking by ID
POST   /api/bookings            - Create booking (Customer)
PATCH  /api/bookings/:id/status - Update booking status
PATCH  /api/bookings/:id/assign - Assign detailer (Admin)
DELETE /api/bookings/:id        - Cancel booking
```

### Payments (M-Pesa)
```
GET    /api/payments            - Get all payments
GET    /api/payments/:id        - Get payment by ID
POST   /api/payments/mpesa/stkpush    - Initiate M-Pesa payment
POST   /api/payments/mpesa/callback   - M-Pesa callback handler
GET    /api/payments/status/:id       - Check payment status
```

### Vehicles (Customer)
```
GET    /api/vehicles            - Get user vehicles
POST   /api/vehicles            - Add vehicle
PUT    /api/vehicles/:id        - Update vehicle
DELETE /api/vehicles/:id        - Delete vehicle
```

### Notifications
```
GET    /api/notifications       - Get user notifications
PATCH  /api/notifications/:id/read - Mark as read
```

---

## 💳 M-Pesa Payment Flow

### 1. Customer Initiates Payment
```javascript
POST /api/payments/mpesa/stkpush
{
  "phone": "254712345678",
  "amount": 500,
  "booking_id": "123"
}
```

### 2. M-Pesa STK Push Sent
- Customer receives payment prompt on phone
- Enters M-Pesa PIN to confirm

### 3. Payment Callback
- M-Pesa sends result to `/api/payments/mpesa/callback`
- Payment record updated in database
- Booking status updated
- Customer notified

### 4. Payment Verification
```javascript
GET /api/payments/status/:checkoutRequestId
```

---

## 🎨 Design System

### Color Palette
- **Primary**: #FF6A2B (Orange) - Brand accent
- **Background**: #0B0D10 (Dark) - Main background
- **Card**: #1A1D23 (Dark Gray) - Card surfaces
- **Success**: Green variants
- **Warning**: Amber variants
- **Destructive**: Red variants

### Typography
- **Font**: DM Sans
- **Weights**: 400, 500, 600, 700

### Components
- Built with Shadcn/ui
- Fully accessible (ARIA compliant)
- Dark-mode optimized
- Mobile-responsive

---

## 🧪 Testing

### Demo Accounts
```
Super Admin:
Email: admin@autoflow.com
Password: admin123

Test M-Pesa (Sandbox):
Phone: 254708374149
```

---

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Any Node.js Host)
```bash
cd server
node index.js
```

### Environment Variables
- Set all `.env` variables in hosting platform
- Use production M-Pesa credentials
- Update CORS origins
- Set secure JWT secret

---

## 🔒 Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT token authentication
- HTTP-only cookies (optional)
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Rate limiting (recommended for production)
- File upload validation
- Role-based access control

---

## 📈 Future Enhancements

- [ ] Real-time location tracking (Google Maps)
- [ ] Push notifications (FCM)
- [ ] SMS notifications (Africa's Talking)
- [ ] Advanced analytics dashboard
- [ ] Mobile apps (React Native)
- [ ] Multi-language support (Swahili/English)
- [ ] Subscription plans for owners
- [ ] Invoice generation
- [ ] Automated marketing campaigns
- [ ] Referral system

---

## 🤝 Contributing

This is a production project. For contributions:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

For support and inquiries:
- Email: support@autoflowpro.co.ke
- Phone: +254 XXX XXX XXX

---

## 🙏 Acknowledgments

- Safaricom Daraja API for M-Pesa integration
- Neon for PostgreSQL hosting
- Shadcn for UI components
- React and Node.js communities

---

**Built with ❤️ in Nairobi, Kenya**
