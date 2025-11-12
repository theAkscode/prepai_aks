# Stripe Integration Setup

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs (Create in https://dashboard.stripe.com/products)
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Steps

1. **Create a Stripe Account**
   - Go to https://stripe.com and sign up
   - Activate your account

2. **Get API Keys**
   - Navigate to https://dashboard.stripe.com/apikeys
   - Copy your Secret key and Publishable key
   - Add them to `.env.local`

3. **Create Products and Prices**
   - Go to https://dashboard.stripe.com/products
   - Create two products:
     - **Pro Plan**: $19/month recurring
     - **Enterprise Plan**: $49/month recurring
   - Copy the Price IDs for each
   - Add them to `.env.local` as `STRIPE_PRO_PRICE_ID` and `STRIPE_ENTERPRISE_PRICE_ID`

4. **Test Mode**
   - Use test keys (starting with `sk_test_` and `pk_test_`) for development
   - Use test card: 4242 4242 4242 4242, any future expiry, any CVC

5. **Production Setup**
   - Switch to live keys when deploying to production
   - Set `NEXT_PUBLIC_APP_URL` to your production domain

## How It Works

1. User clicks "Upgrade to Pro" button
2. System creates a Stripe Checkout session via `/api/create-checkout-session`
3. User is redirected to Stripe's secure payment page
4. After successful payment:
   - User is redirected back to `/dashboard?session_id=xxx&plan=Pro`
   - Payment is verified via `/api/verify-session`
   - Subscription data is stored in localStorage
   - Success toast notification is shown

## Features Implemented

- ✅ Stripe Checkout integration
- ✅ Payment verification
- ✅ Subscription status in localStorage
- ✅ Success/error handling with toast notifications
- ✅ Loading states during checkout
- ✅ Redirect to dashboard after successful payment
- ✅ Cancel redirect back to upgrade page

## Next Steps (Optional)

- Add Stripe webhook to handle subscription events
- Store subscription in database instead of localStorage
- Add subscription management (cancel, update)
- Implement feature gating based on subscription tier
