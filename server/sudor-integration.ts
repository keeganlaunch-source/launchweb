import { storage } from './storage';

// Real-time Sudor app metrics cache
let sudorMetricsCache = {
  activeSubscribers: 15,
  totalClasses: 115,
  classesCompleted: 23,
  activeLearners: 10,
  freeTrialConversions: 0,
  subscriptionRenewalRate: 95,
  promocodesUsed: [] as Array<{
    code: string;
    userId: string;
    timestamp: string;
    campaign: string;
  }>,
  lastUpdated: new Date().toISOString()
};

// Process incoming webhook data and update metrics
export async function processSudorWebhook(eventType: string, data: any) {
  const timestamp = new Date().toISOString();
  
  switch (eventType) {
    case 'subscriber_activated':
      sudorMetricsCache.activeSubscribers++;
      break;
      
    case 'trial_converted':
      sudorMetricsCache.freeTrialConversions++;
      sudorMetricsCache.activeSubscribers++;
      break;
      
    case 'subscription_cancelled':
      sudorMetricsCache.activeSubscribers = Math.max(0, sudorMetricsCache.activeSubscribers - 1);
      break;
      
    case 'promocode_used':
      sudorMetricsCache.promocodesUsed.push({
        code: data.code,
        userId: data.userId,
        timestamp,
        campaign: data.campaign || 'unknown'
      });
      break;
      
    case 'class_completed':
      sudorMetricsCache.classesCompleted++;
      break;
  }
  
  sudorMetricsCache.lastUpdated = timestamp;
  return sudorMetricsCache;
}

// Get current Sudor metrics for dashboard
export function getSudorMetrics() {
  return {
    ...sudorMetricsCache,
    conversionRate: calculateConversionRate(),
    revenueMetrics: calculateRevenue()
  };
}

// Calculate conversion rate from website to app subscriptions
function calculateConversionRate() {
  // This will be enhanced when we get actual website visitor data
  const estimatedWebsiteVisitors = 500; // Will be replaced with real data
  return ((sudorMetricsCache.activeSubscribers / estimatedWebsiteVisitors) * 100).toFixed(2);
}

// Calculate revenue metrics
function calculateRevenue() {
  const monthlyPrice = 29.99;
  const annualPrice = 359.88;
  
  return {
    monthlyRevenue: sudorMetricsCache.activeSubscribers * monthlyPrice,
    annualLTV: sudorMetricsCache.activeSubscribers * annualPrice,
    averageRevenuePerUser: monthlyPrice
  };
}

// API endpoint data structure that Sudor developers should send
export const sudorWebhookSchema = {
  endpoint: 'https://launchfit.app/api/webhooks/sudor',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY' // They'll provide this
  },
  eventTypes: {
    subscriber_activated: {
      eventType: 'subscriber_activated',
      data: {
        userId: 'string',
        subscriptionType: 'monthly|annual',
        promocode: 'string (optional)',
        source: 'ios|android',
        timestamp: 'ISO string'
      }
    },
    trial_started: {
      eventType: 'trial_started',
      data: {
        userId: 'string',
        trialDuration: 'number (days)',
        source: 'ios|android',
        timestamp: 'ISO string'
      }
    },
    trial_converted: {
      eventType: 'trial_converted',
      data: {
        userId: 'string',
        subscriptionType: 'monthly|annual',
        promocode: 'string (optional)',
        timestamp: 'ISO string'
      }
    },
    subscription_cancelled: {
      eventType: 'subscription_cancelled',
      data: {
        userId: 'string',
        reason: 'string (optional)',
        refund: 'boolean',
        timestamp: 'ISO string'
      }
    },
    promocode_used: {
      eventType: 'promocode_used',
      data: {
        userId: 'string',
        code: 'string',
        discount: 'number',
        campaign: 'string (optional)',
        timestamp: 'ISO string'
      }
    },
    class_completed: {
      eventType: 'class_completed',
      data: {
        userId: 'string',
        classId: 'string',
        duration: 'number (minutes)',
        timestamp: 'ISO string'
      }
    }
  }
};

// Update metrics from CSV data (when they provide API access)
export async function updateFromCSVData(csvData: any) {
  if (csvData.activeSubscribers) {
    sudorMetricsCache.activeSubscribers = csvData.activeSubscribers;
  }
  
  if (csvData.classMetrics) {
    sudorMetricsCache.totalClasses = csvData.classMetrics.total;
    sudorMetricsCache.classesCompleted = csvData.classMetrics.completed;
  }
  
  sudorMetricsCache.lastUpdated = new Date().toISOString();
  return sudorMetricsCache;
}