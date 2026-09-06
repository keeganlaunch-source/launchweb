import * as admin from 'firebase-admin';

export class FirebaseAdminAPI {
  private app: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
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

      this.app = admin.initializeApp({
        credential: admin.credential.cert(credentials),
        projectId: 'launch-f6c4d'
      });
    } else {
      this.app = admin.apps[0] as admin.app.App;
    }
  }

  async getRetentionData() {
    try {
      // Get user retention data from Firebase Analytics
      const retentionQuery = {
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'cohortActiveUsers' },
          { name: 'cohortTotalUsers' }
        ],
        dimensions: [
          { name: 'cohort' },
          { name: 'cohortNthWeek' }
        ]
      };

      // Since Firebase Admin SDK doesn't directly expose Analytics reporting,
      // we'll need to use the Google Analytics Data API through the same auth
      return this.calculateRetentionFromUserActivity();
    } catch (error) {
      console.error('Firebase retention error:', error);
      throw error;
    }
  }

  async getUserEngagementMetrics() {
    try {
      // Get user engagement data from Firestore if available
      const db = admin.firestore();
      
      // Query user sessions and engagement events
      const engagementRef = db.collection('user_engagement');
      const snapshot = await engagementRef
        .where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .get();

      const metrics = {
        weeklyActiveUsers: new Set(),
        dailyActiveUsers: new Set(),
        sessionDurations: [] as number[],
        eventCounts: {} as Record<string, number>
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        const userId = data.userId;
        const timestamp = data.timestamp.toDate();
        const today = new Date();
        
        // Weekly active users
        metrics.weeklyActiveUsers.add(userId);
        
        // Daily active users (last 24 hours)
        if (timestamp > new Date(today.getTime() - 24 * 60 * 60 * 1000)) {
          metrics.dailyActiveUsers.add(userId);
        }
        
        // Session duration
        if (data.sessionDuration) {
          metrics.sessionDurations.push(data.sessionDuration);
        }
        
        // Event counts
        if (data.eventName) {
          metrics.eventCounts[data.eventName] = (metrics.eventCounts[data.eventName] || 0) + 1;
        }
      });

      return {
        weeklyActiveUsers: metrics.weeklyActiveUsers.size,
        dailyActiveUsers: metrics.dailyActiveUsers.size,
        averageSessionDuration: metrics.sessionDurations.length > 0 
          ? metrics.sessionDurations.reduce((a, b) => a + b, 0) / metrics.sessionDurations.length 
          : 0,
        eventCounts: metrics.eventCounts
      };
    } catch (error) {
      console.error('Firebase engagement error:', error);
      throw error;
    }
  }

  async getConversionFunnelData() {
    try {
      const db = admin.firestore();
      
      // Query conversion events from Firestore
      const conversionRef = db.collection('conversion_events');
      const snapshot = await conversionRef
        .where('timestamp', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .get();

      const funnelStages = {
        landing_page_visit: 0,
        signup_intent: 0,
        newsletter_signup: 0,
        app_store_click: 0,
        subscription: 0
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        const eventName = data.eventName;
        
        if (funnelStages.hasOwnProperty(eventName)) {
          funnelStages[eventName as keyof typeof funnelStages]++;
        }
      });

      return funnelStages;
    } catch (error) {
      console.error('Firebase conversion funnel error:', error);
      throw error;
    }
  }

  private async calculateRetentionFromUserActivity() {
    try {
      const db = admin.firestore();
      
      // Get user first visit dates and subsequent activity
      const usersRef = db.collection('users');
      const snapshot = await usersRef.get();

      const cohorts = new Map<string, { total: number; retained: Map<number, number> }>();

      snapshot.forEach(doc => {
        const userData = doc.data();
        const firstVisit = userData.firstVisit?.toDate();
        const lastActive = userData.lastActive?.toDate();
        
        if (!firstVisit) return;

        // Group users by week cohort
        const cohortWeek = this.getWeekStart(firstVisit);
        const cohortKey = cohortWeek.toISOString().split('T')[0];
        
        if (!cohorts.has(cohortKey)) {
          cohorts.set(cohortKey, { total: 0, retained: new Map() });
        }
        
        const cohort = cohorts.get(cohortKey)!;
        cohort.total++;
        
        // Calculate retention for each week
        if (lastActive) {
          const weeksFromStart = Math.floor((lastActive.getTime() - firstVisit.getTime()) / (7 * 24 * 60 * 60 * 1000));
          for (let week = 0; week <= weeksFromStart; week++) {
            cohort.retained.set(week, (cohort.retained.get(week) || 0) + 1);
          }
        }
      });

      // Convert to retention percentages
      const retentionData = Array.from(cohorts.entries()).map(([date, cohort]) => {
        const retentionRates = Array.from(cohort.retained.entries()).map(([week, retained]) => ({
          week,
          users: retained,
          retentionRate: (retained / cohort.total) * 100
        }));
        
        return {
          cohortDate: date,
          totalUsers: cohort.total,
          retention: retentionRates
        };
      });

      return retentionData;
    } catch (error) {
      console.error('Retention calculation error:', error);
      throw error;
    }
  }

  private getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}