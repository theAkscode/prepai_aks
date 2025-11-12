# Quick Stripe Setup Guide

## The error you're seeing means Stripe is not configured yet. Follow these steps:

### Step 1: Get Stripe Test Keys (2 minutes)

1. Go to https://dashboard.stripe.com/register (create account if needed)
2. After login, go to: https://dashboard.stripe.com/test/apikeys
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (click "Reveal test key" - starts with `sk_test_`)

### Step 2: Create Test Products (3 minutes)

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Create **Pro Plan**:
   - Name: Pro Plan
   - Price: $19.00
   - Billing period: Monthly
   - Click "Save product"
   - Copy the **Price ID** (starts with `price_`)
4. Create **Enterprise Plan**:
   - Name: Enterprise Plan  
   - Price: $49.00
   - Billing period: Monthly
   - Click "Save product"
   - Copy the **Price ID**

### Step 3: Update .env.local

Open your `.env.local` file and replace the placeholder values:

```env
# Replace these with your actual Stripe test keys
STRIPE_SECRET_KEY=sk_test_PASTE_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE

# Replace these with your actual Price IDs from Step 2
STRIPE_PRO_PRICE_ID=price_PASTE_PRO_PRICE_ID_HERE
STRIPE_ENTERPRISE_PRICE_ID=price_PASTE_ENTERPRISE_PRICE_ID_HERE

# Keep this as is for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the Payment

1. Go to http://localhost:3000/dashboard/upgrade
2. Click "Upgrade to Pro"
3. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
4. Complete the checkout
5. You'll be redirected back to dashboard with success message

## That's it! 🎉

The entire setup should take about 5 minutes. You're using Stripe's test mode, so no real money is involved.

## Need Help?

- Stripe Test Cards: https://stripe.com/docs/testing#cards
- Stripe Dashboard: https://dashboard.stripe.com/test
- If you see errors, check the browser console for details
