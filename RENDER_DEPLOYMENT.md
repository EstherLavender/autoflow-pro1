# 🚀 AutoFlow Pro - Render Deployment Guide

Complete guide to deploying AutoFlow Pro on Render.

---

## 📋 Prerequisites

Before you begin:
- ✅ GitHub account with your code pushed
- ✅ Render account (sign up at https://render.com)
- ✅ Neon PostgreSQL database URL
- ✅ M-Pesa production credentials
- ✅ Domain name (optional, Render provides free subdomain)

---

## 🗄️ Step 1: Database Setup (Neon)

Your database is already on Neon, so just ensure you have:

1. **Get Connection String**
   - Go to https://console.neon.tech
   - Select your project
   - Copy the connection string
   - Format: `postgresql://user:password@host/database?sslmode=require`

2. **Run Schema Files**
   ```sql
   -- Run these in Neon SQL Editor:
   -- 1. schema.sql
   -- 2. kyc_schema.sql
   -- 3. payments_schema.sql
   ```

---

## 🖥️ Step 2: Deploy Backend (Node.js API)

### 2.1 Prepare Backend for Deployment

1. **Create `render.yaml` in project root**
   ```yaml
   services:
     - type: web
       name: autoflow-backend
       env: node
       buildCommand: cd server && npm install
       startCommand: cd server && node index.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 3001
   ```

2. **Ensure `server/package.json` has engines**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### 2.2 Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your `autoflow-pro` repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: autoflow-backend
   Region: Oregon (US West) or Frankfurt (EU)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: cd server && npm install
   Start Command: cd server && node index.js
   Instance Type: Free (or Starter for production)
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"

   ```bash
   NODE_ENV=production
   PORT=3001
   
   # Database (from Neon)
   DATABASE_URL=postgresql://your-user:your-password@your-host.neon.tech/autoflow?sslmode=require
   DB_HOST=your-host.neon.tech
   DB_PORT=5432
   DB_NAME=autoflow
   DB_USER=your-user
   DB_PASSWORD=your-password
   
   # JWT (Generate new secret)
   JWT_SECRET=your-64-character-random-secret
   JWT_EXPIRES_IN=7d
   
   # M-Pesa Production
   MPESA_ENVIRONMENT=production
   MPESA_CONSUMER_KEY=9t9EdgWDctNpDwCAlWudZNG1GRtX5VVGu1S1EJ8cSiX9D9kU
   MPESA_CONSUMER_SECRET=n8YrAg9UsNoUYXdxtJxWjWnmiHYK2aGJn12wfyqbgx3kzUstN4hAIS11K4KV49sw
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your-production-passkey
   MPESA_CALLBACK_URL=https://autoflow-backend.onrender.com/api/payments/mpesa/callback
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=AutoFlow Pro <noreply@autoflowpro.co.ke>
   
   # CORS - Will add frontend URL after deploying
   CORS_ORIGIN=http://localhost:5173
   
   # Uploads
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (takes 2-5 minutes)
   - Note your backend URL: `https://autoflow-backend.onrender.com`

---

## 🌐 Step 3: Deploy Frontend (Static Site)

### 3.1 Prepare Frontend

1. **Update API URL in Frontend**
   
   Create `src/config.ts`:
   ```typescript
   export const API_URL = import.meta.env.VITE_API_URL || 'https://autoflow-backend.onrender.com/api';
   ```

   Update `src/lib/api.ts`:
   ```typescript
   import { API_URL } from '@/config';
   
   const api = axios.create({
     baseURL: API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

2. **Create Build Configuration**
   
   Ensure `vite.config.ts` has:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       sourcemap: false,
       minify: 'terser',
     },
   })
   ```

### 3.2 Deploy on Render

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect same repository
   - Click "Connect"

2. **Configure Static Site**
   ```
   Name: autoflow-frontend
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://autoflow-backend.onrender.com/api
   ```

4. **Auto-Deploy**
   - Enable "Auto-Deploy: Yes"

5. **Create Static Site**
   - Click "Create Static Site"
   - Wait for build (takes 3-5 minutes)
   - Note your frontend URL: `https://autoflow-frontend.onrender.com`

---

## 🔗 Step 4: Connect Frontend & Backend

### 4.1 Update Backend CORS

1. Go to backend service settings
2. Edit environment variables
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://autoflow-frontend.onrender.com
   ```
4. Save and redeploy

### 4.2 Update M-Pesa Callback URL

1. Update backend environment variable:
   ```
   MPESA_CALLBACK_URL=https://autoflow-backend.onrender.com/api/payments/mpesa/callback
   ```

2. **Register URL with Safaricom**
   - Go to https://developer.safaricom.co.ke
   - Update your app's callback URL
   - Submit for approval (if required)

---

## 🎨 Step 5: Custom Domain (Optional)

### 5.1 Frontend Custom Domain

1. **Add Domain in Render**
   - Go to frontend service
   - Click "Settings" → "Custom Domain"
   - Add: `autoflowpro.co.ke` and `www.autoflowpro.co.ke`

2. **Configure DNS**
   Add these records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: autoflow-frontend.onrender.com
   
   Type: A
   Name: @
   Value: 216.24.57.1 (Render's IP)
   ```

3. **SSL Certificate**
   - Render automatically provisions SSL
   - Wait 5-10 minutes for activation

### 5.2 Backend Custom Domain

1. **Add Subdomain**
   - Go to backend service
   - Add: `api.autoflowpro.co.ke`

2. **Configure DNS**
   ```
   Type: CNAME
   Name: api
   Value: autoflow-backend.onrender.com
   ```

3. **Update Environment Variables**
   - Frontend: `VITE_API_URL=https://api.autoflowpro.co.ke/api`
   - Backend: `CORS_ORIGIN=https://autoflowpro.co.ke,https://www.autoflowpro.co.ke`
   - Backend: `MPESA_CALLBACK_URL=https://api.autoflowpro.co.ke/api/payments/mpesa/callback`

---

## 🔒 Step 6: Security & Performance

### 6.1 Environment Security

1. **Generate Strong Secrets**
   ```bash
   # JWT Secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Never Commit Secrets**
   - Ensure `.env` is in `.gitignore`
   - Only set secrets in Render dashboard

### 6.2 Enable Health Checks

Add to `server/index.js`:
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

In Render:
- Go to backend settings
- Set Health Check Path: `/health`

### 6.3 Configure Scaling (Paid Plans)

For production with paid plan:
- Enable auto-scaling
- Set min instances: 1
- Set max instances: 3

---

## 📊 Step 7: Monitoring & Logs

### 7.1 View Logs

1. **Backend Logs**
   - Dashboard → Backend Service → Logs
   - Real-time streaming
   - Filter by severity

2. **Frontend Logs**
   - Dashboard → Frontend Service → Events
   - Build logs available

### 7.2 Set Up Alerts

1. Go to service settings
2. Enable email notifications for:
   - Deploy failures
   - Service crashes
   - Health check failures

---

## 🧪 Step 8: Testing Production

### 8.1 Test Checklist

```bash
# 1. Backend Health
curl https://autoflow-backend.onrender.com/health

# 2. API Endpoints
curl https://autoflow-backend.onrender.com/api/services

# 3. Frontend Loading
open https://autoflow-frontend.onrender.com

# 4. Login Flow
# Visit frontend and test login

# 5. M-Pesa Payment
# Create booking and test payment
```

### 8.2 Test Super Admin

```
URL: https://autoflow-frontend.onrender.com/login
Email: admin@autoflow.com
Password: admin123
```

---

## 🔄 Step 9: Continuous Deployment

### 9.1 Auto-Deploy Setup

Already configured! Every push to `main` branch triggers:
1. Render detects changes
2. Runs build commands
3. Deploys new version
4. Zero downtime deployment

### 9.2 Manual Deploy

If needed:
1. Go to service dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

---

## 🐛 Troubleshooting

### Backend Won't Start

1. **Check Logs**
   - View real-time logs in dashboard
   - Look for errors in startup

2. **Common Issues**
   ```bash
   # Database connection
   - Verify DATABASE_URL is correct
   - Check Neon database is running
   - Verify SSL mode is enabled
   
   # Port binding
   - Ensure using PORT from environment
   - Render assigns port automatically
   
   # Dependencies
   - Check package.json is complete
   - Verify Node version compatibility
   ```

### Frontend Build Fails

1. **Check Build Logs**
   - View Events tab
   - Look for npm install errors

2. **Common Issues**
   ```bash
   # TypeScript errors
   - Fix all type errors locally first
   - Run npm run build locally
   
   # Environment variables
   - Ensure VITE_API_URL is set
   - Check variable names (must start with VITE_)
   
   # Dependencies
   - Update package-lock.json
   - Clear cache: Settings → Build & Deploy → Clear Build Cache
   ```

### M-Pesa Not Working

1. **Verify Callback URL**
   - Must be HTTPS
   - Must be publicly accessible
   - Register with Safaricom

2. **Check Logs**
   - Look for callback requests
   - Verify request body format
   - Check for SSL errors

### CORS Errors

1. **Update Backend**
   ```javascript
   // server/index.js
   app.use(cors({
     origin: process.env.CORS_ORIGIN?.split(',') || '*',
     credentials: true
   }));
   ```

2. **Update Environment**
   - Set exact frontend URL
   - Include both www and non-www
   - No trailing slashes

---

## 💰 Render Pricing

### Free Tier
- ✅ Frontend: Free static hosting
- ✅ Backend: 750 hours/month free
- ⚠️ Backend sleeps after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

### Starter Plan ($7/month per service)
- ✅ No sleep/cold starts
- ✅ Always-on services
- ✅ Better performance
- ✅ More resources

### Production Recommendation
- Frontend: Free tier (always fast)
- Backend: Starter plan (avoid cold starts)
- Total: $7/month

---

## 📱 Post-Deployment

### 1. Update M-Pesa Portal
- Login to Daraja portal
- Update callback URLs
- Test payment flow

### 2. DNS Propagation
- Wait 24-48 hours for full DNS propagation
- Test from different networks
- Use https://dnschecker.org

### 3. SSL Verification
- Check certificate: `https://www.ssllabs.com/ssltest/`
- Ensure A+ rating

### 4. Performance Testing
- Test page load speed: `https://pagespeed.web.dev`
- Optimize if needed

### 5. Monitor First 24 Hours
- Watch error logs
- Monitor response times
- Check payment success rate

---

## 🎯 Production URLs

After deployment, you'll have:

```
Frontend: https://autoflow-frontend.onrender.com
Backend: https://autoflow-backend.onrender.com
Backend API: https://autoflow-backend.onrender.com/api

With Custom Domain:
Frontend: https://autoflowpro.co.ke
Backend: https://api.autoflowpro.co.ke
Backend API: https://api.autoflowpro.co.ke/api
```

---

## ✅ Deployment Checklist

- [ ] Database schemas deployed on Neon
- [ ] Backend deployed on Render
- [ ] Backend environment variables configured
- [ ] Backend health check working
- [ ] Frontend deployed on Render
- [ ] Frontend connecting to backend API
- [ ] CORS configured correctly
- [ ] M-Pesa callback URL registered
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active
- [ ] Super admin login working
- [ ] Test booking flow
- [ ] Test M-Pesa payment
- [ ] Monitor logs for errors
- [ ] Set up email notifications

---

## 🆘 Support

If you encounter issues:
1. Check Render community: https://community.render.com
2. View documentation: https://render.com/docs
3. Contact Render support (paid plans)

---

**Your AutoFlow Pro is now live! 🎉**

Share your app:
- Frontend: https://autoflow-frontend.onrender.com
- Tell your users to sign up
- Start accepting bookings
- Process M-Pesa payments

**Built with ❤️ in Nairobi, Kenya**
