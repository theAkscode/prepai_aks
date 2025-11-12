@echo off
echo ========================================
echo Stripe Setup Helper
echo ========================================
echo.
echo You need to set up Stripe to enable payments.
echo This will take about 5 minutes.
echo.
echo Step 1: Get Your Stripe Test Keys
echo ----------------------------------
echo 1. Open this link in your browser:
echo    https://dashboard.stripe.com/test/apikeys
echo.
echo 2. If you don't have an account, create one (it's free)
echo.
echo 3. Copy your "Publishable key" (starts with pk_test_)
echo    and "Secret key" (starts with sk_test_)
echo.
pause
echo.
echo Step 2: Create Products
echo -----------------------
echo 1. Open this link:
echo    https://dashboard.stripe.com/test/products
echo.
echo 2. Click "Add product"
echo.
echo 3. Create "Pro Plan":
echo    - Name: Pro Plan
echo    - Price: $19.00
echo    - Recurring: Monthly
echo    - Save and copy the Price ID (starts with price_)
echo.
echo 4. Create "Enterprise Plan":
echo    - Name: Enterprise Plan
echo    - Price: $49.00
echo    - Recurring: Monthly
echo    - Save and copy the Price ID
echo.
pause
echo.
echo Step 3: Update .env.local
echo ------------------------
echo Now, open .env.local file and replace these values:
echo.
echo STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
echo STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
echo STRIPE_ENTERPRISE_PRICE_ID=price_YOUR_ENTERPRISE_PRICE_ID
echo.
echo Opening .env.local file for you...
notepad .env.local
echo.
echo Step 4: Restart Dev Server
echo --------------------------
echo After saving .env.local, restart your dev server:
echo 1. Stop the current server (Ctrl+C in the terminal)
echo 2. Run: npm run dev
echo.
echo Step 5: Test Payment
echo -------------------
echo Use this test card for testing:
echo Card: 4242 4242 4242 4242
echo Expiry: Any future date (e.g., 12/28)
echo CVC: Any 3 digits (e.g., 123)
echo ZIP: Any 5 digits (e.g., 12345)
echo.
echo ========================================
echo Setup Complete!
echo ========================================
pause
