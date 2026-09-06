import { Request } from 'express';
import { storage } from './storage';
import { sendAdminNotification } from './email-notifications';
import { trackEvent } from './analytics-service';
import { getLocationFromRequest, enrichLocationData } from './location-service';

interface SubscriberData {
  userId: string;
  email: string;
  subscriptionType: 'free' | 'premium' | 'pro';
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'trial';
  subscriptionStartDate: Date;
  subscriptionEndDate?: Date;
  platform: 'ios' | 'android' | 'web';
  sourceAttribution?: string;
  monthlyRevenue?: string;
  totalRevenue?: string;
}

interface ActivityData {
  subscriberId: number;
  activityType: 'login' | 'workout' | 'content_view' | 'feature_use';
  activityData?: any;
  platform: 'ios' | 'android' | 'web';
}

export async function createOrUpdateSubscriber(req: Request, subscriberData: SubscriberData) {
  try {
    // Get location data for attribution
    const locationData = await enrichLocationData(getLocationFromRequest(req));
    
    const existingSubscriber = await storage.getSubscriberByUserId(subscriberData.userId);
    
    if (existingSubscriber) {
      // Update existing subscriber
      const updatedSubscriber = await storage.updateSubscriber(subscriberData.userId, {
        ...subscriberData,
        lastActiveDate: new Date(),
        country: locationData.country || existingSubscriber.country,
        city: locationData.city || existingSubscriber.city,
        region: locationData.region || existingSubscriber.region,
      });
      
      // Send admin notification for status changes
      if (existingSubscriber.subscriptionStatus !== subscriberData.subscriptionStatus) {
        await sendAdminNotification('subscriber_status_change', {
          userId: subscriberData.userId,
          email: subscriberData.email,
          oldStatus: existingSubscriber.subscriptionStatus,
          newStatus: subscriberData.subscriptionStatus,
          revenue: subscriberData.monthlyRevenue
        });
      }
      
      return updatedSubscriber;
    } else {
      // Create new subscriber
      const newSubscriber = await storage.createSubscriber({
        ...subscriberData,
        lastActiveDate: new Date(),
        country: locationData.country || null,
        city: locationData.city || null,
        region: locationData.region || null,
      });
      
      // Track conversion event
      await trackEvent(req, {
        sessionId: subscriberData.userId,
        eventType: 'conversion',
        eventData: {
          subscriptionType: subscriberData.subscriptionType,
          platform: subscriberData.platform,
          revenue: subscriberData.monthlyRevenue
        }
      });
      
      // Send admin notification for new subscriber
      await sendAdminNotification('new_subscriber', {
        userId: subscriberData.userId,
        email: subscriberData.email,
        subscriptionType: subscriberData.subscriptionType,
        platform: subscriberData.platform,
        revenue: subscriberData.monthlyRevenue
      });
      
      return newSubscriber;
    }
  } catch (error) {
    console.error('Error creating/updating subscriber:', error);
    throw error;
  }
}

export async function recordSubscriberActivity(activityData: ActivityData) {
  try {
    const activity = await storage.createSubscriberActivity(activityData);
    
    // Update last active date
    await storage.updateSubscriberLastActive(activityData.subscriberId, new Date());
    
    return activity;
  } catch (error) {
    console.error('Error recording subscriber activity:', error);
    throw error;
  }
}

export async function getSubscriberMetrics() {
  try {
    const subscribers = await storage.getAllSubscribers();
    const activities = await storage.getRecentSubscriberActivities(30); // Last 30 days
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Active subscribers (active in last 30 days)
    const activeSubscribers = subscribers.filter(sub => 
      sub.subscriptionStatus === 'active' && 
      sub.lastActiveDate && 
      new Date(sub.lastActiveDate) > thirtyDaysAgo
    );
    
    // Subscription type breakdown
    const subscriptionBreakdown = subscribers.reduce((acc, sub) => {
      acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Platform breakdown
    const platformBreakdown = subscribers.reduce((acc, sub) => {
      if (sub.platform) {
        acc[sub.platform] = (acc[sub.platform] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Revenue calculations
    const totalMonthlyRevenue = subscribers
      .filter(sub => sub.subscriptionStatus === 'active' && sub.monthlyRevenue)
      .reduce((sum, sub) => sum + parseFloat(sub.monthlyRevenue || '0'), 0);
    
    const totalLifetimeRevenue = subscribers
      .filter(sub => sub.totalRevenue)
      .reduce((sum, sub) => sum + parseFloat(sub.totalRevenue || '0'), 0);
    
    // Churn analysis
    const churnedThisMonth = subscribers.filter(sub => 
      sub.churnDate && 
      new Date(sub.churnDate) > thirtyDaysAgo
    ).length;
    
    const churnRate = subscribers.length > 0 ? (churnedThisMonth / subscribers.length) * 100 : 0;
    
    // Activity metrics
    const weeklyActiveUsers = activities.filter(activity => 
      new Date(activity.createdAt) > sevenDaysAgo
    ).length;
    
    const monthlyActiveUsers = activities.filter(activity => 
      new Date(activity.createdAt) > thirtyDaysAgo
    ).length;
    
    // Source attribution analysis
    const sourceBreakdown = subscribers.reduce((acc, sub) => {
      const source = sub.sourceAttribution || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      overview: {
        totalSubscribers: subscribers.length,
        activeSubscribers: activeSubscribers.length,
        totalMonthlyRevenue: totalMonthlyRevenue.toFixed(2),
        totalLifetimeRevenue: totalLifetimeRevenue.toFixed(2),
        churnRate: churnRate.toFixed(2),
        weeklyActiveUsers,
        monthlyActiveUsers
      },
      breakdown: {
        subscriptionTypes: subscriptionBreakdown,
        platforms: platformBreakdown,
        sources: sourceBreakdown
      },
      trends: {
        newSubscribersThisWeek: subscribers.filter(sub => 
          new Date(sub.createdAt) > sevenDaysAgo
        ).length,
        newSubscribersThisMonth: subscribers.filter(sub => 
          new Date(sub.createdAt) > thirtyDaysAgo
        ).length,
        churnedThisMonth
      }
    };
  } catch (error) {
    console.error('Error getting subscriber metrics:', error);
    throw error;
  }
}

export async function processSubscriptionWebhook(webhookData: any) {
  try {
    // Handle different webhook types from app stores
    const { eventType, subscriberData, platform } = webhookData;
    
    switch (eventType) {
      case 'subscription_started':
        await createOrUpdateSubscriber({} as Request, {
          userId: subscriberData.userId,
          email: subscriberData.email,
          subscriptionType: subscriberData.subscriptionType,
          subscriptionStatus: 'active',
          subscriptionStartDate: new Date(subscriberData.startDate),
          platform: platform,
          monthlyRevenue: subscriberData.price,
          sourceAttribution: subscriberData.source
        });
        break;
        
      case 'subscription_canceled':
        const subscriber = await storage.getSubscriberByUserId(subscriberData.userId);
        if (subscriber) {
          await storage.updateSubscriber(subscriberData.userId, {
            subscriptionStatus: 'canceled',
            churnDate: new Date()
          });
        }
        break;
        
      case 'subscription_renewed':
        await storage.updateSubscriber(subscriberData.userId, {
          subscriptionStatus: 'active',
          subscriptionEndDate: new Date(subscriberData.nextBillingDate),
          totalRevenue: subscriberData.totalSpent
        });
        break;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing subscription webhook:', error);
    throw error;
  }
}