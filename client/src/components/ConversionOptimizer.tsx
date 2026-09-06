import { useEffect, useState } from 'react';
import { trackCustomEvent } from '../lib/firebase';

export default function ConversionOptimizer() {
  const [hasScrolledToFeatures, setHasScrolledToFeatures] = useState(false);
  const [hasScrolledToPricing, setHasScrolledToPricing] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [sessionData, setSessionData] = useState({
    pageViews: 0,
    buttonClicks: 0,
    scrollDepth: 0,
    engagementScore: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    
    // Track time on site
    const timeInterval = setInterval(() => {
      setTimeOnSite(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Enhanced scroll tracking for micro-conversions
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      setSessionData(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercentage)
      }));

      // Track key section views
      const featuresSection = document.getElementById('features');
      const pricingSection = document.getElementById('pricing');
      
      if (featuresSection && !hasScrolledToFeatures) {
        const rect = featuresSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setHasScrolledToFeatures(true);
          trackCustomEvent('section_viewed', { section: 'features', time_to_view: timeOnSite });
        }
      }
      
      if (pricingSection && !hasScrolledToPricing) {
        const rect = pricingSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setHasScrolledToPricing(true);
          trackCustomEvent('section_viewed', { section: 'pricing', time_to_view: timeOnSite });
          
          // Show urgency if user reaches pricing but hasn't converted
          setTimeout(() => {
            showUrgencyOffer();
          }, 15000); // Show after 15 seconds on pricing
        }
      }
    };

    // Track button interactions
    const trackButtonClicks = () => {
      setSessionData(prev => ({
        ...prev,
        buttonClicks: prev.buttonClicks + 1
      }));
    };

    // Add click listeners to all CTA buttons
    const ctaButtons = document.querySelectorAll('button[class*="bg-primary"], button[class*="START"], .cta-button');
    ctaButtons.forEach(button => {
      button.addEventListener('click', trackButtonClicks);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
      ctaButtons.forEach(button => {
        button.removeEventListener('click', trackButtonClicks);
      });
    };
  }, [hasScrolledToFeatures, hasScrolledToPricing, timeOnSite]);

  // Advanced urgency offer for high-intent users
  const showUrgencyOffer = () => {
    if (sessionData.scrollDepth > 80 && timeOnSite > 60) {
      const urgencyModal = document.createElement('div');
      urgencyModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in duration-300';
      urgencyModal.innerHTML = `
        <div class="bg-white border-4 border-primary p-8 max-w-md mx-4 text-center transform animate-in zoom-in duration-300">
          <div class="text-4xl mb-4">⏰</div>
          <h3 class="font-grunge text-2xl uppercase mb-4 text-black">LIMITED TIME OFFER</h3>
          <p class="text-lg mb-4 text-black">You've shown serious interest in transforming your fitness!</p>
          <p class="text-primary font-bold text-xl mb-6">Get 50% OFF your first month - Valid for next 10 minutes only!</p>
          <button onclick="this.parentElement.parentElement.remove(); window.location.href='#pricing'" class="w-full bg-primary text-black font-bold py-3 px-6 text-lg mb-4 hover:bg-yellow-400">
            CLAIM 50% DISCOUNT NOW
          </button>
          <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 text-sm">
            Maybe later
          </button>
        </div>
      `;
      document.body.appendChild(urgencyModal);
      
      trackCustomEvent('urgency_offer_shown', {
        time_on_site: timeOnSite,
        scroll_depth: sessionData.scrollDepth,
        button_clicks: sessionData.buttonClicks
      });
    }
  };

  // Session recording for optimization insights
  useEffect(() => {
    if (timeOnSite > 0 && timeOnSite % 30 === 0) { // Every 30 seconds
      const engagementScore = (sessionData.scrollDepth * 0.4) + (sessionData.buttonClicks * 20) + (timeOnSite * 0.1);
      
      trackCustomEvent('engagement_checkpoint', {
        time_on_site: timeOnSite,
        scroll_depth: sessionData.scrollDepth,
        button_clicks: sessionData.buttonClicks,
        engagement_score: Math.round(engagementScore),
        has_viewed_features: hasScrolledToFeatures,
        has_viewed_pricing: hasScrolledToPricing
      });
    }
  }, [timeOnSite, sessionData, hasScrolledToFeatures, hasScrolledToPricing]);

  return null;
}