import { google } from 'googleapis';

export class GoogleAnalyticsAPI {
  private analytics: any;
  private propertyId = '492500447';

  constructor() {
    // Parse credentials from environment variable
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}');
    } catch {
      // Fallback: a service-account-key.json placed in the project root (kept out of git)
        const fs = require('fs');
        const keyPath = require('path').join(process.cwd(), 'service-account-key.json');
        credentials = fs.existsSync(keyPath) ? JSON.parse(fs.readFileSync(keyPath, 'utf8')) : {};
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    this.analytics = google.analyticsdata({
      version: 'v1beta',
      auth
    });
  }

  async getRealTimeData() {
    try {
      const response = await this.analytics.properties.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          metrics: [
            { name: 'activeUsers' },
            { name: 'active1DayUsers' },
            { name: 'active7DayUsers' },
            { name: 'active28DayUsers' }
          ],
          dimensions: [
            { name: 'unifiedScreenName' },
            { name: 'firstUserSource' }
          ]
        }
      });

      return this.parseRealTimeResponse(response.data);
    } catch (error) {
      console.error('GA4 Real-time API error:', error);
      throw error;
    }
  }

  async getEventData() {
    try {
      const response = await this.analytics.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          metrics: [
            { name: 'eventCount' }
          ],
          dimensions: [
            { name: 'eventName' }
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: [
                  'subscribe_intent',
                  'app_store_click',
                  'newsletter_signup',
                  'whatsapp_contact',
                  'cta_click',
                  'recipe_view',
                  'workout_session',
                  'community_post',
                  'plan_selected',
                  'launch_ai_interaction'
                ]
              }
            }
          }
        }
      });

      return this.parseEventResponse(response.data);
    } catch (error) {
      console.error('GA4 Events API error:', error);
      throw error;
    }
  }

  async getTrafficSources() {
    try {
      const response = await this.analytics.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' }
          ],
          dimensions: [
            { name: 'firstUserSource' },
            { name: 'firstUserMedium' },
            { name: 'firstUserCampaignName' }
          ]
        }
      });

      return this.parseTrafficSourcesResponse(response.data);
    } catch (error) {
      console.error('GA4 Traffic Sources API error:', error);
      throw error;
    }
  }

  async getSessionData() {
    try {
      const response = await this.analytics.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' }
          ]
        }
      });

      return this.parseSessionResponse(response.data);
    } catch (error) {
      console.error('GA4 Session API error:', error);
      throw error;
    }
  }

  private parseRealTimeResponse(data: any) {
    if (!data.rows || data.rows.length === 0) {
      return {
        activeUsers: 0,
        activeUsers5min: 0,
        activeUsers30min: 0,
        pageViewsLastHour: 0,
        topEvents: [],
        liveTrafficSources: []
      };
    }

    // Extract active users from first row
    const activeUsers = parseInt(data.rows[0]?.metricValues?.[0]?.value || '0');
    
    // Parse traffic sources
    const sources = data.rows.map((row: any) => ({
      source: row.dimensionValues[1]?.value || 'direct',
      users: parseInt(row.metricValues[0]?.value || '0')
    }));

    const totalUsers = sources.reduce((sum, s) => sum + s.users, 0);
    const liveTrafficSources = sources.map(s => ({
      ...s,
      percentage: totalUsers > 0 ? (s.users / totalUsers) * 100 : 0
    }));

    return {
      activeUsers,
      activeUsers5min: Math.floor(activeUsers * 4), // Estimate 5min users
      activeUsers30min: Math.floor(activeUsers * 7.5), // Estimate 30min users
      pageViewsLastHour: Math.floor(activeUsers * 23.5), // Estimate page views
      topEvents: [], // Will be populated by getEventData
      liveTrafficSources
    };
  }

  private parseEventResponse(data: any) {
    const events: Record<string, number> = {
      subscribe_intent: 0,
      app_store_click: 0,
      newsletter_signup: 0,
      whatsapp_contact: 0,
      cta_click: 0,
      recipe_view: 0,
      workout_session: 0,
      community_post: 0,
      plan_selected: 0,
      launch_ai_interaction: 0
    };

    if (data.rows) {
      data.rows.forEach((row: any) => {
        const eventName = row.dimensionValues[0]?.value;
        const eventCount = parseInt(row.metricValues[0]?.value || '0');
        if (events.hasOwnProperty(eventName)) {
          events[eventName] = eventCount;
        }
      });
    }

    return events;
  }

  private parseTrafficSourcesResponse(data: any) {
    const utmSources: Record<string, any> = {};

    if (data.rows) {
      data.rows.forEach((row: any) => {
        const source = row.dimensionValues[0]?.value?.toLowerCase();
        const medium = row.dimensionValues[1]?.value?.toLowerCase();
        const campaign = row.dimensionValues[2]?.value?.toLowerCase();
        const sessions = parseInt(row.metricValues[0]?.value || '0');
        const users = parseInt(row.metricValues[1]?.value || '0');
        const pageViews = parseInt(row.metricValues[2]?.value || '0');

        // Map sources to UTM format
        const utmKey = this.mapSourceToUTM(source, medium);
        if (utmKey && campaign === 'launch') {
          if (!utmSources[utmKey]) {
            utmSources[utmKey] = {
              utm: this.generateUTMString(utmKey, medium),
              users: 0,
              sessions: 0,
              clicks: 0,
              conversions: 0
            };
          }
          utmSources[utmKey].users += users;
          utmSources[utmKey].sessions += sessions;
          utmSources[utmKey].clicks += users; // Approximate clicks as users
          // Conversions calculated separately
        }
      });
    }

    return utmSources;
  }

  private parseSessionResponse(data: any) {
    if (!data.rows || data.rows.length === 0) {
      return {
        totalSessions: 0,
        totalPageViews: 0,
        totalUsers: 0,
        averageSessionDuration: 0,
        bounceRate: 0
      };
    }

    const row = data.rows[0];
    return {
      totalSessions: parseInt(row.metricValues[0]?.value || '0'),
      totalUsers: parseInt(row.metricValues[1]?.value || '0'),
      totalPageViews: parseInt(row.metricValues[2]?.value || '0'),
      averageSessionDuration: parseInt(row.metricValues[3]?.value || '0'),
      bounceRate: parseFloat(row.metricValues[4]?.value || '0')
    };
  }

  private mapSourceToUTM(source: string, medium: string): string | null {
    const sourceMap: Record<string, string> = {
      'instagram': 'instagram',
      'facebook': 'facebook',
      'tiktok': 'tiktok',
      'youtube': 'youtube',
      'whatsapp': 'whatsapp',
      'threads': 'threads',
      'twitter': 'twitter',
      'x.com': 'twitter'
    };

    return sourceMap[source] || null;
  }

  private generateUTMString(source: string, medium: string): string {
    const mediumMap: Record<string, string> = {
      'instagram': 'social',
      'facebook': 'social',
      'tiktok': 'social',
      'youtube': 'video',
      'whatsapp': 'direct',
      'threads': 'social',
      'twitter': 'social'
    };

    const utmMedium = mediumMap[source] || 'social';
    return `?utm_source=${source}&utm_medium=${utmMedium}&utm_campaign=launch`;
  }
}