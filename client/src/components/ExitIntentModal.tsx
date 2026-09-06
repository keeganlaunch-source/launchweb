import { useState, useEffect } from 'react';
import { X, Gift, Clock, Smartphone } from 'lucide-react';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { trackCustomEvent, trackAppDownload } from '../lib/firebase';

export default function ExitIntentModal() {
  const [showModal, setShowModal] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let scrollDepth = 0;
    let timeOnSite = 0;
    
    const startTime = Date.now();
    
    // Track user engagement
    const trackEngagement = () => {
      timeOnSite = Math.floor((Date.now() - startTime) / 1000);
      scrollDepth = Math.max(scrollDepth, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      trackEngagement();
      // Only trigger for engaged users (30+ seconds, 40%+ scroll)
      if (e.clientY <= 0 && !hasTriggered && timeOnSite >= 30 && scrollDepth >= 40) {
        setHasTriggered(true);
        setShowModal(true);
        trackCustomEvent('exit_intent_triggered', { 
          timeOnSite, 
          scrollDepth: Math.round(scrollDepth) 
        });
      }
    };

    // Trigger after 2 minutes for highly engaged users (60%+ scroll)
    const checkHighEngagement = () => {
      trackEngagement();
      if (!hasTriggered && scrollDepth >= 60 && timeOnSite >= 120) {
        setHasTriggered(true);
        setShowModal(true);
        trackCustomEvent('high_engagement_exit_intent', { 
          timeOnSite, 
          scrollDepth: Math.round(scrollDepth) 
        });
      }
    };

    // Reset inactivity timer
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(checkHighEngagement, 120000); // 2 minutes
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', trackEngagement);
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    
    resetInactivityTimer();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', trackEngagement);
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, [hasTriggered, showModal]);

  const handleAppDownload = (platform: 'apple' | 'android') => {
    trackAppDownload(platform === 'apple' ? 'ios' : 'android');
    trackCustomEvent('exit_intent_conversion', { action: 'app_download', platform });
    setShowModal(false);
    
    // Open respective app store
    if (platform === 'apple') {
      window.open('https://apps.apple.com/za/app/launch-lifestyle/id6743004197', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share', '_blank');
    }
  };

  const handleClaim = () => {
    trackCustomEvent('exit_intent_conversion', { action: 'claim_discount' });
    setShowModal(false);
    // Navigate to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: try to scroll to pricing via any pricing button
      const pricingButton = document.querySelector('[data-pricing-section]');
      if (pricingButton) {
        (pricingButton as HTMLElement).click();
      }
    }
  };

  const handleClose = () => {
    trackCustomEvent('exit_intent_dismissed', { action: 'close' });
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        className="bg-white max-w-lg mx-4 p-8 text-center relative transform animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-6xl mb-4">🎯</div>
        
        <h2 className="font-grunge text-3xl uppercase mb-4 text-black">
          WAIT! Don't Leave Empty-Handed
        </h2>
        
        <p className="text-lg mb-6 text-gray-700">
          Since you're clearly serious about your fitness transformation...
        </p>
        
        <div className="bg-gradient-to-r from-primary to-yellow-400 p-6 mb-6 transform -rotate-1 border-2 border-red-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-black" />
            <span className="font-bold text-2xl text-black">FREE TRIAL</span>
          </div>
          <p className="text-black font-bold text-xl mb-2">
            Start Your 7-Day Free Trial
          </p>
          <p className="text-black text-lg font-semibold">
            Full access to Launch Lifestyle - <span className="text-green-700 font-bold">No payment required</span>
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-6 text-red-600">
          <Clock className="w-5 h-5" />
          <span className="font-bold">This offer expires when you close this page</span>
        </div>
        
        <div className="space-y-3 mb-4">
          <button 
            onClick={() => handleAppDownload('apple')}
            className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="font-bold text-lg">App Store</div>
            </div>
          </button>
          
          <button 
            onClick={() => handleAppDownload('android')}
            className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs">GET IT ON</div>
              <div className="font-bold text-lg">Google Play</div>
            </div>
          </button>
        </div>

        <button 
          onClick={handleClaim}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 text-base mb-4 transform hover:scale-105 transition-all duration-200 rounded-lg"
        >
          OR CLAIM WEB DISCOUNT
        </button>
        
        <p className="text-sm text-gray-500">
          Join 1,247+ people who transformed their bodies this month
        </p>
      </div>
    </div>
  );
}