// Meta Business Suite integration for authentic organic social data
import { trackMetaPixelEvent } from './meta-pixel';

export interface MetaBusinessConfig {
  pageId?: string;
  instagramBusinessAccountId?: string;
  accessToken?: string;
}

export interface InstagramInsight {
  metric: string;
  value: number;
  period: string;
  timestamp: string;
}

export interface FacebookPageInsight {
  metric: string;
  value: number;
  period: string;
  timestamp: string;
}

// Initialize Meta Business Suite connection
export const initMetaBusinessIntegration = async (config: MetaBusinessConfig) => {
  if (!config.accessToken) {
    console.warn('Meta Business access token required for organic analytics');
    return;
  }

  console.log('Meta Business Suite integration initialized for Launch Lifestyle');
  return true;
};

// Fetch Instagram Business account insights
export const fetchInstagramInsights = async (
  instagramBusinessAccountId: string,
  accessToken: string,
  metrics: string[] = ['impressions', 'reach', 'profile_views', 'website_clicks']
): Promise<InstagramInsight[]> => {
  try {
    const metricsParam = metrics.join(',');
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/insights?metric=${metricsParam}&period=day&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Track successful data retrieval
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: 'Instagram Analytics Sync',
        content_category: 'Organic Social Data',
        data_source: 'instagram_business_api'
      },
      value: 10,
      currency: 'USD'
    });

    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Instagram insights:', error);
    return [];
  }
};

// Fetch Facebook Page insights
export const fetchFacebookPageInsights = async (
  pageId: string,
  accessToken: string,
  metrics: string[] = ['page_impressions', 'page_reach', 'page_views_total', 'page_actions_post_reactions_total']
): Promise<FacebookPageInsight[]> => {
  try {
    const metricsParam = metrics.join(',');
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/insights?metric=${metricsParam}&period=day&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Track successful data retrieval
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: 'Facebook Analytics Sync',
        content_category: 'Organic Social Data',
        data_source: 'facebook_page_api'
      },
      value: 10,
      currency: 'USD'
    });

    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Facebook insights:', error);
    return [];
  }
};

// Fetch Instagram media (posts) with engagement data
export const fetchInstagramMedia = async (
  instagramBusinessAccountId: string,
  accessToken: string,
  limit: number = 25
) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=${limit}&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram Media API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Instagram media:', error);
    return [];
  }
};

// Fetch Facebook Page posts with engagement data
export const fetchFacebookPosts = async (
  pageId: string,
  accessToken: string,
  limit: number = 25
) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true),shares&limit=${limit}&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Facebook Posts API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Facebook posts:', error);
    return [];
  }
};

// Get Facebook Page basic info
export const fetchPageInfo = async (pageId: string, accessToken: string) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=id,name,username,followers_count,fan_count,website,about&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Facebook Page API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch page info:', error);
    return null;
  }
};

// Get Instagram Business account info
export const fetchInstagramAccountInfo = async (
  instagramBusinessAccountId: string,
  accessToken: string
) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}?fields=id,username,name,followers_count,follows_count,media_count,profile_picture_url,website,biography&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram Account API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Instagram account info:', error);
    return null;
  }
};

// Comprehensive analytics dashboard data
export const fetchCompleteMetaAnalytics = async (config: MetaBusinessConfig) => {
  if (!config.accessToken) {
    throw new Error('Access token required for Meta Business analytics');
  }

  const results = {
    instagram: {
      account: null as any,
      insights: [] as InstagramInsight[],
      media: [] as any[]
    },
    facebook: {
      page: null as any,
      insights: [] as FacebookPageInsight[],
      posts: [] as any[]
    }
  };

  try {
    // Fetch Instagram data if account ID provided
    if (config.instagramBusinessAccountId) {
      const [instagramAccount, instagramInsights, instagramMedia] = await Promise.all([
        fetchInstagramAccountInfo(config.instagramBusinessAccountId, config.accessToken),
        fetchInstagramInsights(config.instagramBusinessAccountId, config.accessToken),
        fetchInstagramMedia(config.instagramBusinessAccountId, config.accessToken)
      ]);

      results.instagram = {
        account: instagramAccount,
        insights: instagramInsights,
        media: instagramMedia
      };
    }

    // Fetch Facebook data if page ID provided
    if (config.pageId) {
      const [facebookPage, facebookInsights, facebookPosts] = await Promise.all([
        fetchPageInfo(config.pageId, config.accessToken),
        fetchFacebookPageInsights(config.pageId, config.accessToken),
        fetchFacebookPosts(config.pageId, config.accessToken)
      ]);

      results.facebook = {
        page: facebookPage,
        insights: facebookInsights,
        posts: facebookPosts
      };
    }

    // Track successful complete analytics fetch
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: 'Complete Meta Analytics Sync',
        content_category: 'Comprehensive Social Data',
        instagram_enabled: !!config.instagramBusinessAccountId,
        facebook_enabled: !!config.pageId
      },
      value: 25,
      currency: 'USD'
    });

    return results;
  } catch (error) {
    console.error('Failed to fetch complete Meta analytics:', error);
    throw error;
  }
};

// Export analytics data for external use
export const exportMetaAnalytics = async (config: MetaBusinessConfig, format: 'json' | 'csv' = 'json') => {
  const analytics = await fetchCompleteMetaAnalytics(config);
  
  if (format === 'json') {
    return JSON.stringify(analytics, null, 2);
  }
  
  // CSV export logic would go here
  return analytics;
};