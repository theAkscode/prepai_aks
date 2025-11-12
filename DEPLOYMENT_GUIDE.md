# Deploying to Vercel - Complete Guide

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- All your environment variables ready

## Step 1: Prepare Your Project

### 1.1 Create .vercelignore file (if needed)
Already created in your project root.

### 1.2 Verify package.json build script
Your build script should work with Vercel. Current script:
```json
"build": "next build --turbopack"
```

Note: Vercel might not support --turbopack flag. We'll update it.

### 1.3 Gather all environment variables
You'll need these from your `.env.local`:

**Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `DRIZZLE_DB_URL` (server-side, preferred)
- `NEXT_PUBLIC_DRIZZLE_DB_URL` (fallback)

**Optional (for Stripe):**
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_ENTERPRISE_PRICE_ID`
- `NEXT_PUBLIC_APP_URL` (will be your Vercel URL)

**Optional:**
- `NEXT_PUBLIC_INFORMATION`

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 2.2 Create GitHub repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "ai-mock-interview")
3. Don't initialize with README (you already have files)

### 2.3 Push your code
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Sign up/Login to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

### 3.2 Import your project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect it's a Next.js project

### 3.3 Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Build Command:** `npm run build` (Vercel will handle this)

**Output Directory:** `.next` (default, auto-detected)

**Install Command:** `npm install`

### 3.4 Add Environment Variables

Click "Environment Variables" and add ALL variables from your `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_GEMINI_API_KEY=AIza...
DRIZZLE_DB_URL=postgresql://...
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_INFORMATION=Your custom message
```

**Important:** 
- Don't add quotes around values
- Make sure there are no extra spaces
- `NEXT_PUBLIC_APP_URL` should be your Vercel domain (you'll update this after first deployment)

### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a live URL like: `https://your-app.vercel.app`

## Step 4: Post-Deployment Configuration

### 4.1 Update App URLs
1. Copy your Vercel deployment URL
2. Go back to Vercel project settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your actual URL
4. Redeploy (Vercel → Deployments → Three dots → Redeploy)

### 4.2 Update Clerk URLs
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Paths" or "Domains"
4. Add your Vercel URL as an authorized domain
5. Update redirect URLs to use your Vercel domain

### 4.3 Update Stripe URLs (if using Stripe)
1. Go to Stripe Dashboard
2. Update webhook URLs if you add webhooks later
3. Test checkout with your production URL

### 4.4 Update Neon Database (if needed)
1. Your database connection should work automatically
2. Make sure your Neon database allows connections from Vercel IPs
3. Run migrations if needed: `npm run db:push` (locally, it will push to your remote DB)

## Step 5: Test Your Deployment

### 5.1 Test core features
- [ ] Sign up/Login with Clerk
- [ ] Create a new mock interview
- [ ] View previous interviews
- [ ] Check FAQ page
- [ ] Test upgrade page
- [ ] Verify "How It Works" page

### 5.2 Check for errors
- Open browser DevTools Console
- Look for any errors
- Check Vercel logs: Vercel Dashboard → Your Project → Logs

## Troubleshooting Common Issues

### Issue 1: Build fails with Turbopack error
**Solution:** We've already fixed the build script. If it still fails, check Vercel build logs.

### Issue 2: Environment variables not loading
**Solution:** 
- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Issue 3: Database connection fails
**Solution:**
- Verify `DRIZZLE_DB_URL` is correct
- Check Neon dashboard for connection string
- Make sure database is active

### Issue 4: Clerk authentication not working
**Solution:**
- Add Vercel URL to Clerk authorized domains
- Update Clerk environment variables
- Check redirect URLs

### Issue 5: Stripe checkout fails
**Solution:**
- Update `NEXT_PUBLIC_APP_URL` in Vercel
- Use production Stripe keys for production (not test keys)
- Verify Price IDs are correct

## Continuous Deployment

Once set up, every push to your `main` branch will automatically deploy to Vercel!

```bash
# Make changes
git add .
git commit -m "Your changes"
git push
# Vercel automatically deploys!
```

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

## Monitoring

- **Vercel Analytics:** Enable in project settings for free
- **Error Tracking:** Check Vercel logs for runtime errors
- **Performance:** Vercel provides Web Vitals metrics

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Enable Vercel Analytics
4. ✅ Share your app URL!
5. ✅ Consider adding a webhook for Stripe subscriptions
6. ✅ Add error monitoring (Sentry, etc.)

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**Deployment Logs:** Vercel Dashboard → Your Project → Deployments
**Environment Variables:** Vercel Dashboard → Settings → Environment Variables
**Domains:** Vercel Dashboard → Settings → Domains

---

## Estimated Time
- First-time setup: 15-20 minutes
- Subsequent deployments: Automatic (2-3 minutes build time)

## Cost
- Vercel Free Tier: Perfect for personal projects
- Neon Free Tier: Sufficient for getting started
- Clerk Free Tier: Up to 5,000 monthly active users
- Stripe: No monthly fee, just transaction fees

You're ready to deploy! 🚀
