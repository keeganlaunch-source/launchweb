# Payment System Setup Guide

Your Launch Lifestyle app now supports dual payment systems:

## 🇿🇦 **Paystack** (for South African customers)
## 🌍 **Stripe** (for international customers)

---

## Paystack Setup (South Africa)

### Step 1: Create Paystack Account
1. Visit [https://paystack.com](https://paystack.com)
2. Click "Get Started" and create your account
3. Complete business verification (required for live payments)

### Step 2: Get API Keys
1. Go to Settings → API Keys
2. Copy your **Secret Key** (starts with `sk_`)
3. Copy your **Public Key** (starts with `pk_`)

### Step 3: Add Environment Variables
Add these to your Replit environment:
```
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

### Features Enabled:
- ✅ Local South African payment methods
- ✅ EFT (Electronic Funds Transfer)
- ✅ Credit/Debit cards
- ✅ Automatic USD to ZAR conversion
- ✅ Local banking integration
- ✅ Mobile money support

---

## Stripe Setup (International)

### Step 1: Create Stripe Account
1. Visit [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Create your account (available in 46+ countries)
3. Complete business verification

### Step 2: Get API Keys
1. Go to Developers → API Keys
2. Copy your **Secret Key** (starts with `sk_`)
3. Copy your **Publishable Key** (starts with `pk_`)

### Step 3: Add Environment Variables
Add these to your Replit environment:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
```

### Features Enabled:
- ✅ Global payment processing (150+ countries)
- ✅ Automatic currency conversion
- ✅ Credit/Debit cards worldwide
- ✅ Digital wallets (Apple Pay, Google Pay)
- ✅ Buy now, pay later options
- ✅ Fraud protection

---

## How It Works

### Customer Experience:
1. **Visit Products Page**: `/products`
2. **Choose Product**: Digital Launch Cookbook or Optimal Lifestyle Blueprint
3. **Location Detection**: System asks if customer is in South Africa
4. **Payment Routing**:
   - **South Africa** → Paystack (local payment methods)
   - **International** → Stripe (global payment processing)
5. **Secure Checkout**: Redirected to appropriate payment processor
6. **Instant Download**: Email with download link sent immediately

### Technical Flow:
```
Customer Location?
├── South Africa
│   ├── Paystack Payment (ZAR)
│   ├── Local Banking Options
│   └── EFT, Cards, Mobile Money
└── International
    ├── Stripe Payment (USD + Auto-convert)
    ├── Global Payment Methods
    └── Apple Pay, Google Pay, Cards
```

---

## Testing Your Setup

### Test Products Available:
- **Digital Launch Cookbook** - $10.00 USD / ~R185 ZAR
- **Optimal Lifestyle Blueprint** - $10.00 USD / ~R185 ZAR

### Test the Flow:
1. Go to `/products` on your app
2. Click "Purchase Now" on any product
3. Enter test email: `test@example.com`
4. Choose your location (South Africa or International)
5. You'll see the appropriate payment system demo

---

## Production Checklist

### Before Going Live:
- [ ] Switch to live API keys (remove `_test_` from keys)
- [ ] Upload actual PDF files to `/pdfs` directory
- [ ] Test with real payment amounts
- [ ] Verify email delivery works
- [ ] Check download links work properly
- [ ] Ensure webhook endpoints are accessible

### Security:
- ✅ All payments processed by certified providers
- ✅ No sensitive data stored on your server
- ✅ Secure download tokens (24-hour expiry)
- ✅ Email delivery confirmation
- ✅ Transaction logging for analytics

---

## Support Contacts

### Paystack Support:
- Email: support@paystack.com
- Docs: [https://paystack.com/docs](https://paystack.com/docs)
- Phone: +234 (0) 812 000 0000

### Stripe Support:
- Email: support@stripe.com
- Docs: [https://stripe.com/docs](https://stripe.com/docs)
- Chat: Available in dashboard

---

## Revenue Tracking

Both payment systems automatically:
- Record all transactions in your database
- Track customer locations and demographics
- Log download activity
- Generate analytics for business insights
- Support for multiple currencies
- Automatic tax handling (where applicable)

Your Launch Lifestyle app is now ready to accept payments from customers worldwide! 🚀