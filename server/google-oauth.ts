import { google } from 'googleapis';
import type { Express, Request, Response } from 'express';

// OAuth 2.0 scopes for YouTube Analytics and Data API
const SCOPES = [
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const CLIENT_ID = '360750006597-ichlho3f3fqer5chqr7ici6p6vrtqbok.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Dynamic redirect URI based on environment
const getRedirectUri = (req: Request): string => {
  const isDev = process.env.NODE_ENV === 'development';
  const host = req.get('host');
  const protocol = req.protocol;
  
  if (isDev && host?.includes('localhost')) {
    return `${protocol}://${host}/api/oauth2callback`;
  }
  return 'https://launchfit.app/api/oauth2callback';
};

// Create OAuth2 client
const createOAuth2Client = (redirectUri: string) => {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
};

export function setupGoogleOAuth(app: Express) {
  // Initiate OAuth flow
  app.get('/api/auth/google', (req: Request, res: Response) => {
    const redirectUri = getRedirectUri(req);
    const oauth2Client = createOAuth2Client(redirectUri);
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent to get refresh token
    });
    
    res.redirect(authUrl);
  });

  // OAuth callback handler
  app.get('/api/oauth2callback', async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
      }

      const redirectUri = getRedirectUri(req);
      const oauth2Client = createOAuth2Client(redirectUri);
      
      const { tokens } = await oauth2Client.getToken(code as string);
      
      // Store tokens in session
      (req.session as any).googleTokens = tokens;
      
      // Get user info
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      
      // Store user info in session
      (req.session as any).googleUser = userInfo.data;
      
      // Redirect to dashboard or success page
      res.redirect('/?auth=success');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/?auth=error');
    }
  });

  // Get YouTube Analytics data
  app.get('/api/youtube/analytics', async (req: Request, res: Response) => {
    try {
      const tokens = (req.session as any).googleTokens;
      if (!tokens) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const redirectUri = getRedirectUri(req);
      const oauth2Client = createOAuth2Client(redirectUri);
      oauth2Client.setCredentials(tokens);

      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

      // Get channel info and videos
      const channelResponse = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true
      });

      const videosResponse = await youtube.videos.list({
        part: ['snippet', 'statistics'],
        mine: true,
        maxResults: 25
      });

      // Get analytics data
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const analyticsResponse = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views,impressions,averageViewDuration,estimatedMinutesWatched,averageViewPercentage,subscribersGained',
        dimensions: 'day',
        sort: 'day'
      });

      const videoAnalyticsResponse = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views,impressions,averageViewDuration,estimatedMinutesWatched',
        dimensions: 'video',
        sort: '-views',
        maxResults: 25
      });

      res.json({
        channel: channelResponse.data.items?.[0],
        videos: videosResponse.data.items,
        analytics: {
          daily: analyticsResponse.data.rows,
          videos: videoAnalyticsResponse.data.rows,
          headers: {
            daily: analyticsResponse.data.columnHeaders,
            videos: videoAnalyticsResponse.data.columnHeaders
          }
        }
      });
    } catch (error) {
      console.error('YouTube API error:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube data' });
    }
  });

  // Get current user info
  app.get('/api/auth/google/user', (req: Request, res: Response) => {
    const user = (req.session as any).googleUser;
    const tokens = (req.session as any).googleTokens;
    
    if (!user || !tokens) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    res.json({ user, authenticated: true });
  });

  // Sign out
  app.post('/api/auth/google/signout', (req: Request, res: Response) => {
    delete (req.session as any).googleTokens;
    delete (req.session as any).googleUser;
    res.json({ success: true });
  });
}