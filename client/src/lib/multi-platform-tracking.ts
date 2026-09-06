// Multi-platform tracking for Launch Lifestyle fitness coaching
import { trackMetaPixelEvent } from './meta-pixel';

export interface PlatformTrackingEvent {
  platform: string;
  action: string;
  content?: string;
  value?: number;
  userId?: string;
}

// WhatsApp Business Integration
export const trackWhatsAppInteraction = (action: 'click' | 'message_sent' | 'business_profile_view') => {
  trackMetaPixelEvent({
    eventName: 'Contact',
    parameters: {
      contact_method: 'whatsapp',
      action_type: action,
      content_category: 'Direct Messaging'
    },
    value: 50,
    currency: 'USD'
  });
  
  console.log(`WhatsApp interaction tracked: ${action}`);
};

// Instagram Business Integration
export const trackInstagramEngagement = (contentType: 'story' | 'post' | 'reel' | 'profile', action: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: `Instagram ${contentType}`,
      content_category: 'Social Media',
      platform: 'instagram',
      engagement_type: action
    },
    value: 25,
    currency: 'USD'
  });
  
  console.log(`Instagram engagement tracked: ${contentType} - ${action}`);
};

// Facebook Business Integration
export const trackFacebookEngagement = (contentType: 'post' | 'page' | 'video' | 'story', action: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: `Facebook ${contentType}`,
      content_category: 'Social Media',
      platform: 'facebook',
      engagement_type: action
    },
    value: 30,
    currency: 'USD'
  });
  
  console.log(`Facebook engagement tracked: ${contentType} - ${action}`);
};

// TikTok Business Integration
export const trackTikTokEngagement = (videoTitle: string, action: 'view' | 'like' | 'share' | 'comment' | 'profile_visit') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: videoTitle,
      content_category: 'TikTok Video',
      platform: 'tiktok',
      engagement_type: action
    },
    value: 35,
    currency: 'USD'
  });
  
  console.log(`TikTok engagement tracked: ${videoTitle} - ${action}`);
};

// Threads Integration
export const trackThreadsEngagement = (postContent: string, action: 'view' | 'like' | 'repost' | 'reply' | 'follow') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: postContent,
      content_category: 'Threads Post',
      platform: 'threads',
      engagement_type: action
    },
    value: 28,
    currency: 'USD'
  });
  
  console.log(`Threads engagement tracked: ${postContent} - ${action}`);
};

// X (Twitter) Integration
export const trackXEngagement = (tweetContent: string, action: 'view' | 'like' | 'retweet' | 'reply' | 'follow') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: tweetContent,
      content_category: 'X Tweet',
      platform: 'x',
      engagement_type: action
    },
    value: 32,
    currency: 'USD'
  });
  
  console.log(`X engagement tracked: ${tweetContent} - ${action}`);
};

// Truth Social Integration
export const trackTruthSocialEngagement = (postContent: string, action: 'view' | 'like' | 'retruth' | 'reply' | 'follow') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: postContent,
      content_category: 'Truth Social Post',
      platform: 'truth_social',
      engagement_type: action
    },
    value: 30,
    currency: 'USD'
  });
  
  console.log(`Truth Social engagement tracked: ${postContent} - ${action}`);
};

// YouTube Channel Integration
export const trackYouTubeEngagement = (videoTitle: string, action: 'view' | 'like' | 'subscribe' | 'comment' | 'share') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: videoTitle,
      content_category: 'YouTube Video',
      platform: 'youtube',
      engagement_type: action
    },
    value: 40,
    currency: 'USD'
  });
  
  console.log(`YouTube engagement tracked: ${videoTitle} - ${action}`);
};

// Gmail Marketing Integration
export const trackEmailCampaign = (campaignName: string, action: 'open' | 'click' | 'reply' | 'forward') => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: campaignName,
      content_category: 'Email Marketing',
      platform: 'gmail',
      engagement_type: action
    },
    value: 20,
    currency: 'USD'
  });
  
  console.log(`Gmail campaign tracked: ${campaignName} - ${action}`);
};

// App Store & Play Store Integration
export const trackAppStoreActivity = (store: 'app_store' | 'play_store', action: 'view' | 'download' | 'review' | 'rating') => {
  trackMetaPixelEvent({
    eventName: action === 'download' ? 'CompleteRegistration' : 'ViewContent',
    parameters: {
      content_name: 'Launch Lifestyle App',
      content_category: 'Mobile App',
      platform: store,
      action_type: action
    },
    value: action === 'download' ? 75 : 15,
    currency: 'USD'
  });
  
  console.log(`${store} activity tracked: ${action}`);
};

// Cross-platform funnel tracking
export const trackCrossPlatformJourney = (sourcePlatform: string, destinationPlatform: string, contentType: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: 'Cross-platform Journey',
      content_category: 'Multi-platform Funnel',
      source_platform: sourcePlatform,
      destination_platform: destinationPlatform,
      content_type: contentType
    },
    value: 45,
    currency: 'USD'
  });
  
  console.log(`Cross-platform journey tracked: ${sourcePlatform} → ${destinationPlatform}`);
};

// Influencer collaboration tracking
export const trackInfluencerCollaboration = (influencerName: string, platform: string, contentType: string, action: string) => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: 'Influencer Collaboration',
      content_category: 'Influencer Marketing',
      influencer_name: influencerName,
      platform: platform,
      content_type: contentType,
      action_type: action
    },
    value: 60,
    currency: 'USD'
  });
  
  console.log(`Influencer collaboration tracked: ${influencerName} on ${platform}`);
};

// Business directory listings
export const trackBusinessDirectoryClick = (directory: string, action: 'view' | 'contact' | 'directions' | 'website_click') => {
  trackMetaPixelEvent({
    eventName: 'Contact',
    parameters: {
      content_name: 'Business Directory',
      content_category: 'Local Business',
      directory_name: directory,
      action_type: action
    },
    value: 25,
    currency: 'USD'
  });
  
  console.log(`Business directory tracked: ${directory} - ${action}`);
};

// UTM parameter tracking for all platforms
export const extractUTMParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content')
  };
};

// Auto-track traffic source on page load
export const trackTrafficSource = () => {
  const utmParams = extractUTMParameters();
  const referrer = document.referrer;
  
  if (utmParams.utm_source) {
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: 'UTM Campaign Traffic',
        content_category: 'Campaign Attribution',
        ...utmParams
      },
      value: 30,
      currency: 'USD'
    });
  } else if (referrer) {
    const referrerDomain = new URL(referrer).hostname;
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: 'Organic Referral Traffic',
        content_category: 'Organic Traffic',
        referrer_domain: referrerDomain
      },
      value: 20,
      currency: 'USD'
    });
  }
};

// Initialize multi-platform tracking
export const initMultiPlatformTracking = () => {
  // Track initial traffic source
  trackTrafficSource();
  
  // Track outbound links to social platforms
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href) {
      const url = new URL(target.href);
      const hostname = url.hostname.toLowerCase();
      
      if (hostname.includes('whatsapp') || hostname.includes('wa.me')) {
        trackWhatsAppInteraction('click');
      } else if (hostname.includes('instagram')) {
        trackInstagramEngagement('profile', 'click');
      } else if (hostname.includes('facebook')) {
        trackFacebookEngagement('page', 'click');
      } else if (hostname.includes('tiktok')) {
        trackTikTokEngagement('Profile Visit', 'profile_visit');
      } else if (hostname.includes('youtube')) {
        trackYouTubeEngagement('Channel Visit', 'subscribe');
      } else if (hostname.includes('threads.net')) {
        trackThreadsEngagement('Profile Visit', 'view');
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        trackXEngagement('Profile Visit', 'view');
      } else if (hostname.includes('truthsocial.com')) {
        trackTruthSocialEngagement('Profile Visit', 'view');
      } else if (hostname.includes('apps.apple.com')) {
        trackAppStoreActivity('app_store', 'view');
      } else if (hostname.includes('play.google.com')) {
        trackAppStoreActivity('play_store', 'view');
      }
    }
  });
  
  console.log('Multi-platform tracking initialized for Launch Lifestyle');
};