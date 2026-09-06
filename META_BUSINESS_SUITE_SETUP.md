# Meta Business Suite Integration Setup
## Launch Lifestyle Fitness Coaching - Authentic Organic Analytics

### Step 1: Connect Instagram Business Account

1. **Go to Facebook Business Manager** (business.facebook.com)
2. **Business Settings > Accounts > Instagram Accounts**
3. **Add > Connect an Instagram account**
4. **Log in with your @launchlifestyle Instagram credentials**
5. **Convert to Business Account** (if not already)
6. **Copy your Instagram Business Account ID** from the URL or settings

### Step 2: Connect Facebook Page

1. **Business Settings > Accounts > Pages**
2. **Add > Add a Page**
3. **Connect your Launch Lifestyle Facebook page**
4. **Copy your Facebook Page ID** from About section

### Step 3: Generate Access Token

1. **Go to Facebook Developers** (developers.facebook.com)
2. **Create App > Business > Launch Lifestyle Analytics**
3. **Add Product > Facebook Login**
4. **App Settings > Basic > Copy App ID**
5. **Tools & Support > Graph API Explorer**
6. **Select your app > Generate User Access Token**
7. **Add permissions:**
   - `pages_read_engagement`
   - `pages_show_list`
   - `instagram_basic`
   - `instagram_manage_insights`
   - `read_insights`

### Step 4: Get Long-Lived Access Token

```bash
# Exchange for long-lived token (60 days)
curl -i -X GET "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

### Step 5: Find Your Account IDs

**Instagram Business Account ID:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={access-token}"
```

**Page ID:**
- Visible in your Facebook page URL: facebook.com/YourPageName
- Or from Business Manager > Pages section

### Step 6: Test API Access

**Test Instagram insights:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/{instagram-business-account-id}/insights?metric=impressions,reach&period=day&access_token={access-token}"
```

**Test Facebook page insights:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/{page-id}/insights?metric=page_impressions,page_reach&period=day&access_token={access-token}"
```

### Required Information for Setup:

1. **Instagram Business Account ID:** `_________________`
2. **Facebook Page ID:** `_________________`
3. **Long-Lived Access Token:** `_________________`
4. **App ID:** `_________________`

### Available Metrics

**Instagram Business:**
- Impressions, Reach, Profile views
- Website clicks, Email contacts
- Phone number clicks, Get directions clicks
- Story insights, Video views

**Facebook Page:**
- Page impressions, Page reach
- Page views, Page likes
- Post engagement, Video views
- Fan demographics, Page actions

### Data Collection Frequency

- **Real-time:** User interactions on your website
- **Daily:** Instagram/Facebook insights sync
- **Weekly:** Comprehensive analytics report
- **Monthly:** Growth and performance summary

### Privacy & Security

- Access tokens are stored securely
- Only business account data is accessed
- No personal user data collected
- Compliant with Meta Business policies

### Next Steps After Setup

1. Provide the required IDs and access token
2. I'll integrate authentic organic analytics
3. Create unified dashboard combining:
   - Meta Pixel conversion data
   - Instagram organic engagement
   - Facebook page performance
   - Cross-platform attribution

This gives you complete Launch Lifestyle social media analytics with 100% authentic data - no estimates or guessing.