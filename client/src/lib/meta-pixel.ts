// Meta Pixel integration for accurate advertising analytics
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export interface MetaPixelEvent {
  eventName: string;
  parameters?: Record<string, any>;
  value?: number;
  currency?: string;
}

export const initMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate initialization
  if (window.fbq) return;

  // Initialize Meta Pixel
  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize pixel with ID and enable advanced matching
  window.fbq('init', pixelId, {
    em: 'auto', // Enable automatic email matching
    ph: 'auto', // Enable automatic phone matching
    external_id: 'auto' // Enable external ID matching
  });
  
  // Track page view with enhanced parameters
  const eventID = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  window.fbq('track', 'PageView', {}, {
    eventID: eventID,
    source_url: window.location.href,
    referrer: document.referrer
  });

  console.log(`Meta Pixel initialized with ID: ${pixelId} - Advanced matching enabled`);
};

export const trackMetaPixelEvent = (event: MetaPixelEvent) => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Meta Pixel not initialized');
    return;
  }

  const { eventName, parameters, value, currency } = event;

  // Standard events with specific parameters
  const eventData: Record<string, any> = { ...parameters };
  
  if (value !== undefined) {
    eventData.value = value;
  }
  
  if (currency) {
    eventData.currency = currency;
  }

  window.fbq('track', eventName, eventData);
  console.log(`Meta Pixel event tracked: ${eventName}`, eventData);
};

// Predefined event tracking functions for common actions
export const trackPageView = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackLead = (value?: number) => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    value,
    currency: 'USD'
  });
};

export const trackCompleteRegistration = (value?: number) => {
  trackMetaPixelEvent({
    eventName: 'CompleteRegistration',
    value,
    currency: 'USD'
  });
};

export const trackViewContent = (contentName: string, contentCategory?: string, value?: number) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: contentName,
      content_category: contentCategory
    },
    value,
    currency: 'USD'
  });
};

export const trackAddToCart = (contentName: string, value: number, quantity: number = 1) => {
  trackMetaPixelEvent({
    eventName: 'AddToCart',
    parameters: {
      content_name: contentName,
      quantity
    },
    value,
    currency: 'USD'
  });
};

export const trackPurchase = (value: number, contentName?: string) => {
  trackMetaPixelEvent({
    eventName: 'Purchase',
    parameters: {
      content_name: contentName
    },
    value,
    currency: 'USD'
  });
};

export const trackContact = (method: string = 'form') => {
  trackMetaPixelEvent({
    eventName: 'Contact',
    parameters: {
      contact_method: method
    }
  });
};

export const trackSchedule = (eventName: string = 'consultation') => {
  trackMetaPixelEvent({
    eventName: 'Schedule',
    parameters: {
      event_name: eventName
    }
  });
};

// Custom events for fitness business
export const trackConsultationRequest = () => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: 'Consultation Request',
      content_category: 'Fitness Coaching'
    }
  });
};

export const trackNewsletterSignup = () => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: 'Newsletter Signup',
      content_category: 'Email Marketing'
    }
  });
};

export const trackAppDownload = () => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: 'App Download',
      content_category: 'Mobile App'
    }
  });
};

export const trackWhatsAppContact = () => {
  trackMetaPixelEvent({
    eventName: 'Contact',
    parameters: {
      contact_method: 'WhatsApp'
    }
  });
};

export const trackLaunchAIInteraction = (interactionType: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: 'Launch AI Interaction',
      content_category: 'AI Assistant',
      interaction_type: interactionType
    }
  });
};

export const trackProgramInterest = (programName: string) => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: programName,
      content_category: 'Fitness Program'
    }
  });
};

// Enhanced cross-platform tracking functions
export const generateEventID = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const trackExternalTrafficSource = (source: string, medium: string, campaign?: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: 'External Traffic',
      content_category: 'Cross Platform',
      traffic_source: source,
      traffic_medium: medium,
      campaign_name: campaign || 'organic'
    }
  });
};

export const trackVideoEngagement = (platform: string, videoTitle: string, engagement: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: videoTitle,
      content_category: 'Video Content',
      platform: platform,
      engagement_type: engagement
    }
  });
};

export const trackSocialMediaClick = (platform: string, contentType: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: `${platform} Traffic`,
      content_category: 'Social Media',
      platform: platform,
      content_type: contentType
    }
  });
};

export const trackInfluencerReferral = (influencerName: string, platform: string) => {
  trackMetaPixelEvent({
    eventName: 'Lead',
    parameters: {
      content_name: 'Influencer Referral',
      content_category: 'Influencer Marketing',
      influencer_name: influencerName,
      platform: platform
    }
  });
};

export const trackEmailCampaignClick = (campaignName: string, emailType: string) => {
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: 'Email Campaign Click',
      content_category: 'Email Marketing',
      campaign_name: campaignName,
      email_type: emailType
    }
  });
};