// Real-time analytics collection for authentic user data
import { trackMetaPixelEvent } from './meta-pixel';

export interface RealTimeEvent {
  timestamp: number;
  userId?: string;
  sessionId: string;
  eventType: string;
  platform: string;
  data: Record<string, any>;
}

// Generate unique session ID for tracking continuity
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('launch_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('launch_session_id', sessionId);
  }
  return sessionId;
};

// Track real user behavior patterns
export const trackUserBehavior = (action: string, element: string, data: Record<string, any> = {}) => {
  const sessionId = getSessionId();
  const event: RealTimeEvent = {
    timestamp: Date.now(),
    sessionId,
    eventType: 'user_behavior',
    platform: 'website',
    data: {
      action,
      element,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...data
    }
  };

  // Send to Meta Pixel for advertising attribution
  trackMetaPixelEvent({
    eventName: 'ViewContent',
    parameters: {
      content_name: `User Behavior: ${action}`,
      content_category: 'Website Interaction',
      element_type: element,
      session_id: sessionId,
      ...data
    },
    value: 5,
    currency: 'USD'
  });

  // Log for debugging
  console.log('Real user behavior tracked:', event);
};

// Track scroll depth for engagement measurement
export const initScrollTracking = () => {
  let maxScrollDepth = 0;
  let scrollMilestones = [25, 50, 75, 90, 100];
  let trackedMilestones: number[] = [];

  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage;
    }

    scrollMilestones.forEach(milestone => {
      if (scrollPercentage >= milestone && !trackedMilestones.includes(milestone)) {
        trackedMilestones.push(milestone);
        trackUserBehavior('scroll_depth', 'page', {
          scroll_percentage: milestone,
          page_url: window.location.href
        });
      }
    });
  };

  window.addEventListener('scroll', trackScrollDepth, { passive: true });
};

// Track time spent on page
export const initTimeTracking = () => {
  const startTime = Date.now();
  let timeIntervals = [30, 60, 120, 300, 600]; // seconds
  let trackedIntervals: number[] = [];

  const trackTimeSpent = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    timeIntervals.forEach(interval => {
      if (timeSpent >= interval && !trackedIntervals.includes(interval)) {
        trackedIntervals.push(interval);
        trackUserBehavior('time_on_page', 'page', {
          time_spent_seconds: interval,
          page_url: window.location.href
        });
      }
    });
  };

  setInterval(trackTimeSpent, 10000); // Check every 10 seconds

  // Track when user leaves
  window.addEventListener('beforeunload', () => {
    const finalTimeSpent = Math.round((Date.now() - startTime) / 1000);
    trackUserBehavior('page_exit', 'page', {
      total_time_seconds: finalTimeSpent,
      page_url: window.location.href
    });
  });
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon', fieldData: Record<string, any> = {}) => {
  trackUserBehavior('form_interaction', 'form', {
    form_name: formName,
    form_action: action,
    ...fieldData
  });

  // Special tracking for completed forms
  if (action === 'complete') {
    trackMetaPixelEvent({
      eventName: 'Lead',
      parameters: {
        content_name: formName,
        content_category: 'Form Completion',
        form_type: formName
      },
      value: 25,
      currency: 'USD'
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, buttonType: string, context: Record<string, any> = {}) => {
  trackUserBehavior('button_click', 'button', {
    button_name: buttonName,
    button_type: buttonType,
    ...context
  });
};

// Track video interactions
export const trackVideoInteraction = (videoTitle: string, action: 'play' | 'pause' | 'complete' | 'skip', currentTime: number) => {
  trackUserBehavior('video_interaction', 'video', {
    video_title: videoTitle,
    video_action: action,
    current_time: currentTime
  });

  if (action === 'complete') {
    trackMetaPixelEvent({
      eventName: 'ViewContent',
      parameters: {
        content_name: videoTitle,
        content_category: 'Video Completion',
        video_duration: currentTime
      },
      value: 15,
      currency: 'USD'
    });
  }
};

// Track search interactions
export const trackSearchInteraction = (query: string, results: number, platform: string = 'website') => {
  trackUserBehavior('search', 'search_box', {
    search_query: query,
    results_count: results,
    search_platform: platform
  });
};

// Track device and browser information
export const trackDeviceInfo = () => {
  const deviceInfo = {
    screen_width: screen.width,
    screen_height: screen.height,
    browser_language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection_type: (navigator as any).connection?.effectiveType || 'unknown',
    is_mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    platform: navigator.platform
  };

  trackUserBehavior('device_info', 'browser', deviceInfo);
};

// Initialize all real-time tracking
export const initRealTimeAnalytics = () => {
  initScrollTracking();
  initTimeTracking();
  trackDeviceInfo();
  
  console.log('Real-time analytics initialized for Launch Lifestyle');
};

// Track external link clicks
export const trackExternalLinkClick = (url: string, linkText: string, context: string) => {
  trackUserBehavior('external_link_click', 'link', {
    destination_url: url,
    link_text: linkText,
    link_context: context
  });
};