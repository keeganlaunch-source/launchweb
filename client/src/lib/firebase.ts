import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';

// Firebase configuration - using the consolidated FIREBASE secret
const firebaseConfig = {
  apiKey: "AIzaSyA3mB6pgLhHgZOCEIDtgB_ViItlWoZSGE0",
  authDomain: "launch-f6c4d.firebaseapp.com",
  projectId: "launch-f6c4d",
  storageBucket: "launch-f6c4d.firebasestorage.app",
  messagingSenderId: "234040597257",
  appId: "1:234040597257:web:44c7b67defe90b477d11d8",
  measurementId: "G-08HCZR6RCF"
};

let app: any = null;
let analytics: any = null;

// Initialize Firebase
export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return false;
  }
};

// Track page views
export const trackPageView = (page_title: string, page_location: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'page_view', {
    page_title,
    page_location
  });
};

// Track app downloads
export const trackAppDownload = (platform: 'ios' | 'android') => {
  if (!analytics) return;
  
  logEvent(analytics, 'app_download', {
    platform,
    source: 'landing_page'
  });
};

// Track newsletter signups
export const trackNewsletterSignup = (method: string = 'landing_page') => {
  if (!analytics) return;
  
  logEvent(analytics, 'sign_up', {
    method
  });
};

// Track contact form submissions
export const trackContactForm = () => {
  if (!analytics) return;
  
  logEvent(analytics, 'generate_lead', {
    currency: 'USD',
    value: 0
  });
};

// Track Launch AI interactions
export const trackLaunchAIInteraction = (interaction_type: string, message_count?: number) => {
  if (!analytics) return;
  
  logEvent(analytics, 'engagement', {
    engagement_time_msec: 1000,
    interaction_type,
    message_count
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'select_content', {
    content_type: 'social_link',
    item_id: platform
  });
};

// Track feature interactions
export const trackFeatureClick = (feature_name: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'select_item', {
    item_list_id: 'features',
    item_list_name: 'Features Section',
    items: [{
      item_id: feature_name.toLowerCase().replace(/\s+/g, '_'),
      item_name: feature_name,
      item_category: 'feature'
    }]
  });
};

// Track workout streak milestones
export const trackStreakMilestone = (streak_count: number) => {
  if (!analytics) return;
  
  logEvent(analytics, 'level_up', {
    level: streak_count,
    character: 'fitness_enthusiast'
  });
};

// Track email guide requests
export const trackEmailGuideRequest = (guide_type: string) => {
  if (!analytics) return;
  
  logEvent(analytics, 'generate_lead', {
    currency: 'USD',
    value: 5,
    lead_type: guide_type
  });
};

// Set user properties
export const setUserProperty = (property_name: string, property_value: string) => {
  if (!analytics) return;
  
  setUserProperties(analytics, {
    [property_name]: property_value
  });
};

// Set user ID for cross-session tracking
export const setAnalyticsUserId = (userId: string) => {
  if (!analytics) return;
  
  setUserId(analytics, userId);
};

// Track conversion events (app installs from landing)
export const trackConversion = (conversion_type: string, value?: number) => {
  if (!analytics) return;
  
  logEvent(analytics, 'conversion', {
    currency: 'USD',
    value: value || 0,
    conversion_type
  });
};

// Custom event tracking
export const trackCustomEvent = (event_name: string, parameters: Record<string, any> = {}) => {
  if (!analytics) return;
  
  logEvent(analytics, event_name, parameters);
};