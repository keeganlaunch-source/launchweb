# SendGrid Domain Authentication Setup

## Current Status
- Email delivery working with SendGrid production API key
- Emails going to spam due to missing domain authentication
- Sender changed from Gmail to `noreply@launchfit.app`

## Required DNS Records for launchfit.app

To authenticate your domain and prevent emails from going to spam, add these DNS records:

### Step 1: SendGrid Domain Authentication
1. Go to SendGrid Dashboard → Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Enter: `launchfit.app`
4. Choose DNS host (likely Cloudflare, GoDaddy, or your domain provider)
5. Copy the DNS records provided by SendGrid

### Step 2: Add DNS Records
SendGrid will provide records similar to these (exact values will be different):

**CNAME Records (for DKIM):**
```
s1._domainkey.launchfit.app → s1.domainkey.u12345.wl.sendgrid.net
s2._domainkey.launchfit.app → s2.domainkey.u12345.wl.sendgrid.net
```

**TXT Record (for SPF):**
```
launchfit.app → "v=spf1 include:sendgrid.net ~all"
```

**DMARC Record (recommended):**
```
_dmarc.launchfit.app → "v=DMARC1; p=quarantine; rua=mailto:keegan.launch@gmail.com"
```

### Step 3: Verification
- Wait 24-48 hours for DNS propagation
- Return to SendGrid and click "Verify" 
- Once verified, emails will have proper authentication

## Benefits After Setup
- Emails will land in inbox instead of spam
- Professional sender reputation
- Better email deliverability rates
- Proper email authentication headers

## Current Email Configuration
- From: Coach Keegs - LAUNCH <noreply@launchfit.app>
- Reply-To: keegan.launch@gmail.com
- Anti-spam headers configured
- App store buttons working correctly