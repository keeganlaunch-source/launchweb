import { storage } from "./storage";

export async function getVerifiedAnalytics() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get only verified data from storage
    const signups = await storage.getAllNewsletterSignups();
    const messages = await storage.getAllContactMessages();
    
    // Today's verified counts
    const todaySignups = signups.filter(s => new Date(s.createdAt) >= today).length;
    const todayMessages = messages.filter(m => new Date(m.createdAt) >= today).length;
    
    // Get verified analytics events
    const { getAnalyticsMetrics } = await import('./analytics-service');
    const analyticsData = await getAnalyticsMetrics();
    
    // Geographic data from actual signup locations only
    const countryCount: Record<string, number> = {};
    signups.forEach(signup => {
      if (signup.country) {
        countryCount[signup.country] = (countryCount[signup.country] || 0) + 1;
      }
    });
    
    const topCountries = Object.entries(countryCount)
      .map(([country, count]) => ({
        country,
        visitors: count as number, // Only actual signup counts
        percentage: 0
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // Calculate actual percentages
    const totalSignupCountries = topCountries.reduce((sum, c) => sum + c.visitors, 0);
    if (totalSignupCountries > 0) {
      topCountries.forEach(country => {
        country.percentage = (country.visitors / totalSignupCountries) * 100;
      });
    }

    // Recent activity from verified database entries
    interface ActivityEvent {
      type: string;
      timestamp: string;
      country: string | null;
      platform: string;
    }
    
    const recentActivity: ActivityEvent[] = [];
    
    // Add recent signups
    signups.slice(-10).forEach(signup => {
      recentActivity.push({
        type: "Newsletter Signup",
        timestamp: typeof signup.createdAt === 'string' ? signup.createdAt : signup.createdAt.toISOString(),
        country: signup.country || null,
        platform: "Website"
      });
    });

    // Add recent messages
    messages.slice(-10).forEach(message => {
      recentActivity.push({
        type: "Contact Form",
        timestamp: typeof message.createdAt === 'string' ? message.createdAt : message.createdAt.toISOString(),
        country: message.country || null,
        platform: "Website"
      });
    });

    // Sort by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Social platforms from verified tracking events only
    const socialPlatforms = analyticsData.socialPlatforms.map(platform => ({
      platform: platform.platform,
      visitors: 0, // No synthetic data
      clicks: platform.count,
      conversions: 0, // Only from verified conversion events
      conversionRate: 0
    }));

    // Only verified metrics
    const todayStats = {
      pageViews: analyticsData.eventCounts.today.pageViews,
      uniqueVisitors: analyticsData.eventCounts.today.pageViews, // Page views as unique metric
      newsletterSignups: todaySignups,
      contactForms: todayMessages,
      socialClicks: analyticsData.eventCounts.today.socialClicks,
      avgSessionDuration: 0 // Only from Firebase when available
    };

    return {
      activeUsers: 0, // Only from Firebase Analytics when available
      todayStats,
      socialPlatforms,
      topCountries,
      recentActivity: recentActivity.slice(0, 20),
      fullFunnelMetrics: {
        websiteVisitors: analyticsData.eventCounts.today.pageViews,
        newsletterSignups: todaySignups,
        contactInquiries: todayMessages,
        appDownloads: 0, // Removed - no authentic source
        activeSubscribers: 0, // Only from Sudor webhook when available
        totalRevenue: 0, // Removed - no authentic calculation
        lifetimeValue: 0 // Removed - no authentic calculation
      }
    };
  } catch (error) {
    console.error('Verified analytics error:', error);
    throw error;
  }
}