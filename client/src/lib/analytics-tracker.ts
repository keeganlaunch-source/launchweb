import { apiRequest } from "./queryClient";

// Generate a unique session ID for the user
const generateSessionId = (): string => {
  const stored = sessionStorage.getItem('launch-session-id');
  if (stored) return stored;
  
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('launch-session-id', sessionId);
  return sessionId;
};

// Get the session ID
export const getSessionId = (): string => generateSessionId();

// Detect social media platforms from referrer
const detectSocialPlatform = (referrer: string): string | null => {
  const url = referrer.toLowerCase();
  
  if (url.includes('facebook.com') || url.includes('fb.com') || url.includes('m.facebook.com')) {
    return 'facebook';
  }
  if (url.includes('instagram.com')) {
    return 'instagram';
  }
  if (url.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('whatsapp.com') || url.includes('wa.me')) {
    return 'whatsapp';
  }
  if (url.includes('twitter.com') || url.includes('t.co')) {
    return 'twitter';
  }
  if (url.includes('linkedin.com')) {
    return 'linkedin';
  }
  
  return null;
};

// Track analytics events
export const trackEvent = async (eventType: string, eventData?: any): Promise<void> => {
  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`/api/track/${eventType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        ...eventData,
        sessionId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track page views with automatic social media detection
export const trackPageView = async (page: string = window.location.pathname): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const referrer = document.referrer;
    const socialPlatform = referrer ? detectSocialPlatform(referrer) : null;
    
    // Track page view
    await fetch('/api/track/page-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        page,
        sessionId
      })
    });
    
    // Track social media click if coming from social platform
    if (socialPlatform) {
      await fetch('/api/track/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          platform: socialPlatform,
          sessionId
        })
      });
    }
  } catch (error) {
    console.warn('Page view tracking failed:', error);
  }
};

// Track app store clicks
export const trackAppStoreClick = async (platform: 'ios' | 'android'): Promise<void> => {
  const endpoint = platform === 'ios' ? 'app-store' : 'play-store';
  await trackEvent(endpoint, { platform });
};

// Track app downloads (call this when user confirms download)
export const trackAppDownload = async (platform: 'ios' | 'android'): Promise<void> => {
  await trackEvent('app-download', { platform });
};

// Track social media link clicks
export const trackSocialClick = async (platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'youtube'): Promise<void> => {
  await trackEvent('social', { platform });
};

// Auto-track page views on route changes
export const initializeAnalytics = (): void => {
  // Track initial page load
  trackPageView();
  
  // Track browser back/forward navigation
  window.addEventListener('popstate', () => {
    trackPageView();
  });
  
  // Track programmatic navigation (for SPA routing)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(() => trackPageView(), 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(() => trackPageView(), 0);
  };
};