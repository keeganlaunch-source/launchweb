# YouTube Analytics Setup Guide

## Step 1: Enable APIs in Google Cloud Console

From your current Google Cloud Console screen:

1. **Click the hamburger menu (☰)** in the top left
2. **Navigate to "APIs & Services" > "Library"**
3. **Search for and enable these APIs:**
   - YouTube Data API v3
   - YouTube Analytics API

## Step 2: Create OAuth 2.0 Credentials

1. **Go to "APIs & Services" > "Credentials"**
2. **Click "+ CREATE CREDENTIALS"**
3. **Select "OAuth client ID"**
4. **Choose "Web application"**
5. **Add these Authorized redirect URIs:**
   ```
   https://launchfit.app/api/oauth2callback
   http://localhost:5000/api/oauth2callback
   ```

## Step 3: Get Your Client Secret

After creating the OAuth client:
1. **Click on your newly created OAuth client**
2. **Copy the "Client Secret"** (not the Client ID - we already have that)
3. **Provide it as the GOOGLE_CLIENT_SECRET environment variable**

## Step 4: Test the Integration

Once the Client Secret is set:
1. Visit: `https://launchfit.app/api/auth/google`
2. Sign in with your YouTube channel's Google account
3. Grant permissions for YouTube Analytics access
4. You'll be redirected back to your dashboard

## YouTube Channel Requirements

Your YouTube channel needs:
- Analytics access (available to all channels)
- Some video content to analyze
- You must be the channel owner or have analytics permissions

## URLs to Access

**Development:**
- Auth: `http://localhost:5000/api/auth/google`
- Analytics: `http://localhost:5000/api/youtube/analytics`

**Production:**
- Auth: `https://launchfit.app/api/auth/google`
- Analytics: `https://launchfit.app/api/youtube/analytics`