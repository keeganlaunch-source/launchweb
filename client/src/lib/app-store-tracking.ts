// App Store Click Tracking for Complete Funnel Analysis

interface AppStoreTrackingParams {
  platform: 'ios' | 'android';
  source?: string;
  campaign?: string;
  medium?: string;
}

// Enhanced app download handler with comprehensive tracking
export const handleTrackedAppDownload = async (params: AppStoreTrackingParams) => {
  const { platform, source = 'website', campaign = 'organic', medium = 'referral' } = params;
  
  // Define store URLs
  const storeUrls = {
    ios: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
    android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
  };

  // 1. Track Google Analytics 4 Event
  if (typeof window !== 'undefined' && window.gtag) {
    const eventName = platform === 'ios' ? 'app_store_click' : 'play_store_click';
    window.gtag('event', eventName, {
      method: platform,
      source: source,
      campaign: campaign,
      medium: medium
    });
  }

  // 2. Track Meta Pixel Event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: `App Download - ${platform.toUpperCase()}`,
      content_category: 'App Store Click',
      source: source,
      value: 0,
      currency: 'USD'
    });
  }

  // 3. Track internal analytics
  try {
    await fetch('/api/analytics/track-app-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        source,
        campaign,
        medium,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    });
  } catch (error) {
    console.error('Failed to track app download:', error);
  }

  // 4. Open store with tracking parameters
  const url = new URL(storeUrls[platform]);
  
  // Add UTM parameters for attribution
  if (platform === 'ios') {
    url.searchParams.set('pt', source);
    url.searchParams.set('ct', campaign);
    url.searchParams.set('mt', '8'); // App Store tracking
  } else {
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', campaign);
  }

  // Open in new tab
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
};

// Track CTA clicks for funnel analysis
export const trackCTAClick = async (ctaType: string, location: string) => {
  // GA4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_type: ctaType,
      location: location,
      page: window.location.pathname
    });
  }

  // Meta Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: `CTA Click - ${ctaType}`,
      content_category: 'User Engagement',
      source: location
    });
  }

  // Internal tracking
  try {
    await fetch('/api/analytics/track-cta-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ctaType,
        location,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to track CTA click:', error);
  }
};

// Export for global access
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}