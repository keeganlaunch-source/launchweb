// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      send_page_view: false,
      custom_map: {
        'custom_parameter_1': 'fitness_action',
        'custom_parameter_2': 'coaching_type'
      }
    });
  `;
  document.head.appendChild(script2);
};

// Track page views with enhanced location data
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title || document.title,
  });

  // Enhanced page view with fitness-specific context
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    content_group1: 'fitness_coaching',
    content_group2: url.includes('launch-ai') ? 'ai_coaching' : 'marketing',
  });
};

// Track Launch AI interactions with location context
export const trackLaunchAIInteraction = (
  action: string,
  questionCategory?: string,
  userLocation?: { country?: string; city?: string }
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'launch_ai_interaction', {
    event_category: 'ai_coaching',
    event_label: questionCategory || 'general',
    fitness_action: action,
    coaching_type: 'conversational_ai',
    custom_parameter_1: action,
    custom_parameter_2: questionCategory || 'general',
    user_country: userLocation?.country,
    user_city: userLocation?.city,
  });
};

// Track fitness-specific events with geographic data
export const trackFitnessEvent = (
  action: string, 
  category: string = 'fitness',
  label?: string, 
  value?: number,
  location?: { country?: string; city?: string }
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    fitness_action: action,
    coaching_type: category,
    user_country: location?.country,
    user_city: location?.city,
  });
};

// Track conversions with location context
export const trackConversion = (
  conversionType: 'consultation_request' | 'newsletter_signup' | 'app_download',
  value: number,
  location?: { country?: string; city?: string }
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'conversion', {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: 'USD',
    conversion_type: conversionType,
    user_country: location?.country,
    user_city: location?.city,
  });

  // Send purchase event for revenue tracking
  window.gtag('event', 'purchase', {
    transaction_id: `${conversionType}_${Date.now()}`,
    value: value,
    currency: 'USD',
    items: [{
      item_id: conversionType,
      item_name: conversionType.replace('_', ' '),
      category: 'fitness_coaching',
      quantity: 1,
      price: value
    }]
  });
};

// Get user's geographic location
export const getUserLocation = async (): Promise<{ country?: string; city?: string; region?: string }> => {
  try {
    // Use IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      country: data.country_name,
      city: data.city,
      region: data.region
    };
  } catch (error) {
    console.warn('Could not get user location:', error);
    return {};
  }
};

// Enhanced event tracking with automatic location detection
export const trackEventWithLocation = async (
  action: string,
  category?: string,
  label?: string,
  value?: number
) => {
  const location = await getUserLocation();
  trackFitnessEvent(action, category, label, value, location);
};