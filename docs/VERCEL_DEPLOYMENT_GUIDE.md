# Vercel Deployment Guide - AutoFlow Pro Monorepo

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Vercel Configuration](#vercel-configuration)
- [Environment Variables](#environment-variables)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

AutoFlow Pro is structured as a monorepo with:
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express
- **Database**: Neon PostgreSQL

This guide shows how to deploy both frontend and backend to Vercel.

---

## Prerequisites

### Required Accounts
- ✅ GitHub account (or GitLab/Bitbucket)
- ✅ Vercel account (free tier works)
- ✅ Neon database account

### Required Tools
- ✅ Git installed
- ✅ Node.js 18+ installed
- ✅ npm or yarn installed

---

## Project Structure

```
autoflow-pro/
├── client/               # Frontend (move from src/)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/               # Backend (API)
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── index.js
├── database/            # Database schemas
├── docs/                # Documentation
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json
└── .env.example         # Environment template
```

---

## Vercel Configuration

### 1. Root Configuration File

The `vercel.json` at the root configures the monorepo deployment:

```json
{
  "version": 2,
  "name": "autoflow-pro",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["server/**"]
      }
    },
    {
      "src": "vite.config.ts",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Build Settings

**Frontend (Vite)**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Backend (Node.js)**:
- Build Command: None (Node.js serverless)
- Output Directory: `server`
- Install Command: `npm install`

---

## Environment Variables

### Required Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Database
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

#### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_EXPIRES_IN=7d
```

#### Server Configuration
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-app.vercel.app
```

#### File Upload (Production)
```env
# AWS S3 (Recommended)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=autoflow-uploads

# Or Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

#### SMS Gateway (Production)
```env
# Africa's Talking
SMS_API_KEY=your-africas-talking-api-key
SMS_USERNAME=your-username

# Or Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Email Service (Production)
```env
# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Or AWS SES
AWS_SES_REGION=us-east-1
AWS_SES_FROM=noreply@yourdomain.com
```

#### KYC Configuration
```env
APP_URL=https://your-app.vercel.app
KYC_AUTO_VERIFICATION_ENABLED=true
KYC_DOCUMENT_MAX_SIZE=5242880
```

### Environment Variable Groups

**Development**:
- Set for `Development` environment in Vercel

**Preview**:
- Set for `Preview` environment (Git branches)

**Production**:
- Set for `Production` environment (main branch)

---

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AutoFlow Pro monorepo"
   ```

2. **Create GitHub Repository**:
   ```bash
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/autoflow-pro.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Repository**:
   - Connect your GitHub account
   - Select `autoflow-pro` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add all variables from the section above
   - Save and continue

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-5 minutes for deployment

### Step 3: Database Setup

1. **Apply Database Schema**:
   ```bash
   # Connect to your Neon database
   psql postgresql://your-neon-connection-string
   
   # Run migrations
   \i database/schema.sql
   \i database/kyc_schema.sql
   ```

2. **Verify Tables**:
   ```sql
   \dt
   ```

### Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**:
   - Update `CLIENT_URL` to your custom domain
   - Update `APP_URL` for KYC

### Step 5: Test Deployment

1. **Visit Your Site**:
   ```
   https://your-app.vercel.app
   ```

2. **Test Key Features**:
   - ✅ Homepage loads
   - ✅ Login/Register works
   - ✅ API endpoints respond
   - ✅ Database connections work
   - ✅ File uploads work (if configured)

---

## Vercel Deployment Workflow

### Automatic Deployments

**Production (main branch)**:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
→ Deploys to production automatically

**Preview (feature branches)**:
```bash
git checkout -b feature/new-feature
git add .
git commit -m "New feature"
git push origin feature/new-feature
```
→ Creates preview deployment with unique URL

### Manual Deployments

1. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Via Dashboard**:
   - Go to Deployments
   - Click "Redeploy"

---

## Project-Specific Configuration

### Frontend Configuration

Update `vite.config.ts` for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### Backend Configuration

Update `server/index.js` for Vercel:

```javascript
// Add at the top
const isProduction = process.env.NODE_ENV === 'production';

// Update CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// For Vercel serverless
if (isProduction) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

### Package.json Scripts

Update root `package.json`:

```json
{
  "name": "autoflow-pro",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "dev:server": "node server/index.js",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\"",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build",
    "start": "node server/index.js"
  },
  "dependencies": {
    // ... your dependencies
  }
}
```

---

## File Storage Configuration

### Option 1: Vercel Blob Storage (Recommended)

1. **Install Package**:
   ```bash
   npm install @vercel/blob
   ```

2. **Update Upload Config** (`server/config/upload.js`):
   ```javascript
   const { put } = require('@vercel/blob');
   
   async function uploadToBlob(file) {
     const blob = await put(file.originalname, file.buffer, {
       access: 'public',
       token: process.env.BLOB_READ_WRITE_TOKEN,
     });
     return blob.url;
   }
   ```

3. **Add Token**:
   - Vercel Dashboard → Storage → Blob
   - Create store
   - Copy token to environment variables

### Option 2: AWS S3

1. **Install AWS SDK**:
   ```bash
   npm install aws-sdk
   ```

2. **Configure S3** (`server/config/upload.js`):
   ```javascript
   const AWS = require('aws-sdk');
   
   const s3 = new AWS.S3({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: process.env.AWS_REGION
   });
   ```

---

## Monitoring & Logs

### View Logs

1. **Via Dashboard**:
   - Go to Deployments → Select deployment
   - Click "View Function Logs"

2. **Via CLI**:
   ```bash
   vercel logs
   vercel logs --follow  # Real-time
   ```

### Analytics

1. **Enable Vercel Analytics**:
   - Go to Analytics tab
   - Enable Web Analytics
   - Install package:
     ```bash
     npm install @vercel/analytics
     ```
   - Add to `main.tsx`:
     ```typescript
     import { Analytics } from '@vercel/analytics/react';
     
     <Analytics />
     ```

### Speed Insights

```bash
npm install @vercel/speed-insights
```

Add to `main.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

<SpeedInsights />
```

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different secrets for each environment
- ✅ Rotate secrets regularly

### 2. CORS Configuration
```javascript
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://your-custom-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### 4. Helmet for Security Headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails
**Error**: `Module not found`
```bash
# Solution: Check package.json dependencies
npm install
npm run build  # Test locally first
```

#### 2. API Routes Not Working
**Error**: 404 on `/api/*` endpoints
```bash
# Solution: Check vercel.json routes configuration
# Ensure server/index.js exports the app for serverless
```

#### 3. Database Connection Fails
**Error**: `Connection refused`
```bash
# Solution: Check DATABASE_URL
# Ensure Neon database allows connections
# Add ?sslmode=require to connection string
```

#### 4. File Upload Fails
**Error**: `ENOENT: no such file or directory`
```bash
# Solution: Use Vercel Blob or S3 instead of local filesystem
# Vercel serverless functions are read-only
```

#### 5. Environment Variables Not Loading
**Error**: `undefined` for process.env.*
```bash
# Solution:
# 1. Check variables are added in Vercel Dashboard
# 2. Redeploy after adding variables
# 3. Check variable names match exactly
```

### Debug Mode

Enable debug logs:
```javascript
// In server/index.js
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL exists:', !!process.env.DATABASE_URL);
console.log('Client URL:', process.env.CLIENT_URL);
```

---

## Performance Optimization

### 1. Image Optimization
```bash
npm install sharp
```

### 2. Caching
Add cache headers:
```javascript
app.use((req, res, next) => {
  if (req.url.startsWith('/static/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

### 3. Compression
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 4. Code Splitting
Vite does this automatically, but ensure dynamic imports:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

---

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Cost Estimation

### Vercel Hobby (Free)
- ✅ Unlimited projects
- ✅ 100 GB bandwidth
- ✅ Serverless function execution
- ✅ Automatic HTTPS
- ❌ No team features
- ❌ Limited analytics

### Vercel Pro ($20/month)
- ✅ Everything in Hobby
- ✅ Team collaboration
- ✅ Advanced analytics
- ✅ Password protection
- ✅ 1TB bandwidth

### Neon Database
- Free: 0.5 GB storage, 1 project
- Pro: $19/month, unlimited projects

---

## Post-Deployment Checklist

- [ ] Database schema applied
- [ ] All environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic)
- [ ] API endpoints tested
- [ ] File uploads working
- [ ] Email notifications working
- [ ] SMS notifications working
- [ ] Analytics enabled
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## Support & Updates

For issues or questions:
- Check Vercel status: [status.vercel.com](https://status.vercel.com)
- Vercel community: [vercel.com/community](https://vercel.com/community)
- GitHub Issues: Your repository issues page

---

**Last Updated**: January 12, 2026  
**Version**: 1.0.0  
**Deployment Platform**: Vercel  
**Database**: Neon PostgreSQL

---

**🚀 Ready to Deploy!**

Follow this guide step by step, and your AutoFlow Pro monorepo will be live on Vercel in minutes!
