# Environment Variables Checklist for Vercel

Copy all these variables from your `.env.local` to Vercel's Environment Variables section.

## Required Variables

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Database (Neon)
```
DRIZZLE_DB_URL=postgresql://...
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://...
```
Note: Use the same value for both, but DRIZZLE_DB_URL is preferred for server-side

### AI (Google Gemini)
```
NEXT_PUBLIC_GEMINI_API_KEY=AIza...
```

## Optional Variables

### Stripe Payment (if you set it up)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_INFORMATION=For the best experience, keep camera and microphone enabled...
```

## Important Notes

1. **NEXT_PUBLIC_APP_URL**: Update this AFTER your first deployment with your actual Vercel URL
2. **Production Keys**: For production, replace test keys with live keys from:
   - Clerk: Use production instance keys
   - Stripe: Use live keys (sk_live_..., pk_live_...)
   - Keep Gemini API key the same
3. **No Quotes**: Don't wrap values in quotes in Vercel dashboard
4. **Redeploy**: After adding/changing variables, trigger a redeploy

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Click Settings → Environment Variables
3. Add each variable:
   - Name: Variable name (e.g., CLERK_SECRET_KEY)
   - Value: Your actual value
   - Environment: Select "Production", "Preview", and "Development" (or just Production for now)
4. Click "Save"
5. Redeploy your project
