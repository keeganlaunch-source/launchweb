import { Request, Response } from 'express';
import { storage } from './storage';
import { sendAdminNotification } from './email-notifications';
import { trackEvent } from './analytics-service';

interface AppStoreWebhookData {
  platform: 'ios' | 'android';
  eventType: 'download' | 'subscription' | 'trial_start' | 'purchase';
  userId?: string;
  transactionId: string;
  productId?: string;
  revenue?: number;
  currency?: string;
  timestamp: string;
  sourceAttribution?: {
    campaign?: string;
    source?: string;
    medium?: string;
    content?: string;
  };
}

interface FirebaseWebhookData {
  eventName: string;
  userId?: string;
  userProperties?: any;
  eventParameters?: any;
  timestamp: string;
  platform: 'ios' | 'android' | 'web';
}

interface BranchWebhookData {
  name: string;
  user_data?: any;
  event_data?: any;
  last_attributed_touch_data?: {
    campaign?: string;
    channel?: string;
    feature?: string;
  };
  timestamp: string;
}

// App Store Server Notifications Handler
export async function handleAppStoreWebhook(req: Request, res: Response) {
  try {
    const webhookData: AppStoreWebhookData = req.body;
    
    // Verify webhook signature (implement based on your needs)
    const isValidSignature = verifyAppStoreSignature(req);
    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Track the app store event
    await trackEvent(req, {
      sessionId: webhookData.userId || 'app-store-user',
      eventType: webhookData.eventType as any,
      eventData: {
        platform: webhookData.platform,
        transactionId: webhookData.transactionId,
        productId: webhookData.productId,
        revenue: webhookData.revenue,
        currency: webhookData.currency,
        sourceAttribution: webhookData.sourceAttribution
      }
    });

    // Send admin notification for important events
    if (webhookData.eventType === 'subscription' || webhookData.eventType === 'purchase') {
      await sendAdminNotification('app_store_conversion', {
        platform: webhookData.platform,
        eventType: webhookData.eventType,
        revenue: webhookData.revenue,
        source: webhookData.sourceAttribution?.source || 'Unknown'
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('App Store webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Firebase Analytics Webhook Handler
export async function handleFirebaseWebhook(req: Request, res: Response) {
  try {
    const webhookData: FirebaseWebhookData = req.body;

    // Track Firebase events
    await trackEvent(req, {
      sessionId: webhookData.userId || 'firebase-user',
      eventType: mapFirebaseEventType(webhookData.eventName),
      eventData: {
        platform: webhookData.platform,
        eventParameters: webhookData.eventParameters,
        userProperties: webhookData.userProperties
      }
    });

    // Handle conversion events
    if (isConversionEvent(webhookData.eventName)) {
      await sendAdminNotification('firebase_conversion', {
        eventName: webhookData.eventName,
        platform: webhookData.platform,
        userId: webhookData.userId
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Firebase webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Branch.io Webhook Handler
export async function handleBranchWebhook(req: Request, res: Response) {
  try {
    const webhookData: BranchWebhookData = req.body;

    // Track Branch events
    await trackEvent(req, {
      sessionId: webhookData.user_data?.developer_identity || 'branch-user',
      eventType: mapBranchEventType(webhookData.name),
      eventData: {
        eventName: webhookData.name,
        attributionData: webhookData.last_attributed_touch_data,
        eventData: webhookData.event_data
      }
    });

    // Handle attribution events
    if (isBranchConversionEvent(webhookData.name)) {
      await sendAdminNotification('branch_conversion', {
        eventName: webhookData.name,
        campaign: webhookData.last_attributed_touch_data?.campaign,
        channel: webhookData.last_attributed_touch_data?.channel
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Branch webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper functions
function verifyAppStoreSignature(req: Request): boolean {
  // Implement signature verification based on your app store setup
  // For iOS: Verify using Apple's provided certificates
  // For Android: Verify using Google Play's signing key
  return true; // Placeholder - implement actual verification
}

function mapFirebaseEventType(eventName: string): 'app_download' | 'conversion' | 'page_view' {
  const eventMap: Record<string, any> = {
    'app_install': 'app_download',
    'first_open': 'app_download',
    'purchase': 'conversion',
    'subscribe': 'conversion',
    'screen_view': 'page_view'
  };
  
  return eventMap[eventName] || 'conversion';
}

function mapBranchEventType(eventName: string): 'app_download' | 'conversion' | 'social_click' {
  const eventMap: Record<string, any> = {
    'install': 'app_download',
    'open': 'app_download',
    'purchase': 'conversion',
    'subscribe': 'conversion',
    'click': 'social_click'
  };
  
  return eventMap[eventName] || 'conversion';
}

function isConversionEvent(eventName: string): boolean {
  const conversionEvents = ['purchase', 'subscribe', 'trial_start', 'signup'];
  return conversionEvents.includes(eventName);
}

function isBranchConversionEvent(eventName: string): boolean {
  const conversionEvents = ['install', 'purchase', 'subscribe', 'signup'];
  return conversionEvents.includes(eventName);
}

// Get comprehensive analytics including webhook data
export async function getWebhookAnalytics() {
  try {
    // This would typically query your analytics database
    // For now, we'll return structure that matches expected data
    return {
      appStoreMetrics: {
        totalDownloads: 0,
        totalRevenue: 0,
        conversionsBySource: [],
        subscriptionMetrics: {
          trials: 0,
          conversions: 0,
          churn: 0
        }
      },
      attributionMetrics: {
        topSources: [],
        campaignPerformance: [],
        crossPlatformJourney: []
      }
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw error;
  }
}