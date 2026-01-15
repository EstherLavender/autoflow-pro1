# 🚀 Quick Start - Deploy to Render

Follow these steps to deploy AutoFlow Pro to Render in under 10 minutes.

---

## Prerequisites

✅ GitHub repository with your code  
✅ Neon database URL ready  
✅ M-Pesa credentials (from provided credentials)  

---

## Step-by-Step Deployment

### 1. Push Code to GitHub (if not done)

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy Backend

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub and select `autoflow-pro` repository
4. Configure:
   - **Name**: `autoflow-backend`
   - **Root Directory**: (leave blank)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node index.js`
   - **Instance Type**: Free (or Starter $7/month for no cold starts)

5. Click **"Advanced"** and add these environment variables:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your-neon-database-url-here
JWT_SECRET=generate-random-64-char-string
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=9t9EdgWDctNpDwCAlWudZNG1GRtX5VVGu1S1EJ8cSiX9D9kU
MPESA_CONSUMER_SECRET=n8YrAg9UsNoUYXdxtJxWjWnmiHYK2aGJn12wfyqbgx3kzUstN4hAIS11K4KV49sw
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-production-passkey-from-safaricom
MPESA_CALLBACK_URL=https://autoflow-backend.onrender.com/api/payments/mpesa/callback
CORS_ORIGIN=http://localhost:5173
```

6. Click **"Create Web Service"**
7. Wait 2-5 minutes for deployment
8. Copy your backend URL (e.g., `https://autoflow-backend.onrender.com`)

### 3. Deploy Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select same `autoflow-pro` repository
3. Configure:
   - **Name**: `autoflow-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add environment variable:
   ```env
   VITE_API_URL=https://autoflow-backend.onrender.com/api
   ```

5. Click **"Create Static Site"**
6. Wait 3-5 minutes for build
7. Copy your frontend URL (e.g., `https://autoflow-frontend.onrender.com`)

### 4. Update Backend CORS

1. Go back to backend service
2. Edit environment variables
3. Update `CORS_ORIGIN`:
   ```env
   CORS_ORIGIN=https://autoflow-frontend.onrender.com
   ```
4. Save (backend will automatically redeploy)

### 5. Test Your App! 🎉

Visit: `https://autoflow-frontend.onrender.com`

Login with super admin:
- Email: `admin@autoflow.com`
- Password: `admin123`

---

## Generate JWT Secret

Run this command locally:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`

---

## Your URLs

After deployment:

- **Frontend**: https://autoflow-frontend.onrender.com
- **Backend**: https://autoflow-backend.onrender.com
- **API**: https://autoflow-backend.onrender.com/api
- **Health Check**: https://autoflow-backend.onrender.com/health

---

## Important Notes

⚠️ **Free Tier**: Backend sleeps after 15 minutes of inactivity (30-60s cold start)  
💡 **Upgrade**: For production, use Starter plan ($7/month) to avoid cold starts  
🔒 **Security**: Never commit `.env` files to git  
📧 **M-Pesa**: Register your callback URL with Safaricom  

---

## Troubleshooting

**Backend won't start?**
- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Ensure all environment variables are set

**Frontend build fails?**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify VITE_API_URL is set

**Can't connect to backend?**
- Check CORS_ORIGIN matches frontend URL exactly
- Verify backend is running (visit /health endpoint)
- Check network tab in browser DevTools

---

## Next Steps

1. ✅ Test all features (login, booking, payments)
2. ✅ Register M-Pesa callback URL with Safaricom
3. ✅ Set up custom domain (optional)
4. ✅ Monitor logs for first 24 hours
5. ✅ Upgrade to paid plan for production

---

**Need help?** Check the full deployment guide: `RENDER_DEPLOYMENT.md`

**Your app is live! Share it with the world! 🚀**
