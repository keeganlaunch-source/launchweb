import { Check, Play, Smartphone, X } from "lucide-react";
import { SiAppstore, SiGoogleplay } from "react-icons/si";
import { useState } from "react";
import launchLogo from "@assets/Untitled design.png";
import { trackAppDownload, trackCustomEvent } from "../lib/firebase";
import { trackAppDownload as trackMetaAppDownload, trackViewContent } from "../lib/meta-pixel";

export default function HeroSection() {
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  
  const heroFeatures = [
    "No gym membership required",
    "Personalized workout plans", 
    "24/7 expert guidance"
  ];

  const handlePrimaryCTA = () => {
    trackCustomEvent('cta_click', {
      button_name: 'Start Your Journey',
      section: 'hero',
      event_category: 'engagement'
    });
    // Track Meta Pixel interaction
    trackViewContent('App Download Modal', 'Primary CTA');
    setShowAppDownloadModal(true);
  };

  const handleAppDownload = (platform: 'apple' | 'android') => {
    const links = {
      apple: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
      android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
    };
    
    // Track Firebase Analytics
    trackAppDownload(platform === 'apple' ? 'ios' : 'android');
    
    // Track Meta Pixel app download event
    trackMetaAppDownload();
    
    window.open(links[platform], '_blank');
    setShowAppDownloadModal(false);
  };



  return (
    <section id="hero" className="min-h-screen flex items-center px-4 lg:px-8 pt-24 pb-12 bg-background relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
        {/* Hero Content */}
        <div className="space-y-6 animate-slide-in">
          <div className="bg-black/90 text-white px-4 py-3 rounded-lg mb-4 border border-[#FFD600]/20">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-1.5 h-1.5 bg-[#FFD600] rounded-full animate-pulse"></div>
                <span className="font-bold text-[#FFD600] text-sm">ACCEPTING NEW CLIENTS</span>
                <span className="font-bold text-[#FFD600] text-sm">for {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' })}</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => window.open('https://apps.apple.com/za/app/launch-lifestyle/id6743004197', '_blank')}
                  className="bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 w-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </button>
                <button
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share', '_blank')}
                  className="bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 w-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </div>
          <h1 className="font-grunge text-5xl lg:text-7xl font-black leading-none uppercase tracking-tight">
            Get Fit At Home In{" "}
            <span className="bg-primary px-2 inline-block transform -rotate-2 mx-1 text-primary-foreground">
              30 Days
            </span>{" "}
            Or Your Money Back
          </h1>
          
          <p className="text-xl lg:text-2xl font-medium animate-slide-in-delay">
            Join 1,247 people who transformed their bodies this month. Zero gym required. Results guaranteed.
          </p>

          {/* Hero Feature List */}
          <div className="space-y-4 pt-4 animate-slide-in-delay-2">
            {heroFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 font-semibold">
                <div className="w-8 h-8 bg-foreground text-primary flex items-center justify-center font-black text-lg">
                  <Check className="w-5 h-5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Launch AI Quick Questions */}
          <div className="bg-black p-5 rounded-xl space-y-4 animate-slide-in-delay-2">
            <div className="flex items-center gap-2">
              <p className="font-grunge text-lg font-black uppercase text-white tracking-wide">Have Questions?</p>
            </div>
            <p className="text-primary text-sm font-medium">Get instant answers about fitness, nutrition, workouts, and health goals</p>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openLaunchAI', { 
                  detail: { question: "I have a fitness question" } 
                }));
              }}
              className="w-full p-4 bg-primary text-black hover:bg-primary/90 rounded-xl transition-all duration-200 hover:scale-105 text-lg font-bold"
            >
              Ask Launch AI
            </button>
          </div>

          {/* Hero CTA - Optimized for higher conversion */}
          <div className="space-y-4 pt-6 animate-slide-in-delay-3">
            {/* Primary CTA with urgency */}
            <button 
              onClick={handlePrimaryCTA}
              className="w-full bg-primary text-primary-foreground px-8 py-5 font-black uppercase tracking-wide border-2 border-border transition-all duration-300 hero-shadow text-xl hover:scale-105"
            >
              🚀 Start Free Trial - Join 1000+ Members
            </button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  const event = new CustomEvent('switchToChatView');
                  window.dispatchEvent(event);
                }}
                className="flex-1 bg-black px-6 py-3 font-bold uppercase tracking-wide border-2 border-primary transition-all duration-300 hover:bg-gray-900 text-base text-white"
              >
                <span className="text-white">Try Launch</span><span className="bg-primary text-black px-1 inline-block transform -rotate-2 ml-1">AI</span>
              </button>
              
              <button 
                onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 bg-white text-black px-6 py-3 font-bold uppercase tracking-wide border-2 border-border transition-all duration-300 hover:bg-gray-100 text-base"
              >
                <span className="text-black">Get Free Guide</span>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 pt-2">
              <span>✓ No Credit Card Required</span>
              <span>✓ Cancel Anytime</span>
              <span>✓ 30-Day Guarantee</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative animate-slide-in">
          <div className="w-full h-96 lg:h-[600px] bg-muted relative overflow-hidden border-2 border-border">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Person doing workout at home" 
              className="w-full h-full object-cover filter grayscale-[20%]"
            />
          </div>

          {/* Hero Stats Card */}
          <button 
            onClick={handlePrimaryCTA}
            className="absolute -bottom-8 left-4 lg:left-8 bg-primary border-2 border-border p-6 transform -rotate-3 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h3 className="text-2xl font-black mb-1 text-primary-foreground">JOIN OUR</h3>
            <p className="font-semibold uppercase text-sm text-primary-foreground">Active Members</p>
          </button>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-background border-2 border-border p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 text-foreground hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="font-grunge text-2xl uppercase mb-2">Download Launch App</h3>
              <p className="text-muted-foreground">Choose your platform to start your free trial</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  // GA4 tracking
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'app_store_click', {
                      method: 'iOS',
                      source: 'hero_section',
                      campaign: 'website_download'
                    });
                  }
                  // Meta Pixel tracking
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead', {
                      content_name: 'App Download - iOS',
                      content_category: 'App Store Click'
                    });
                  }
                  handleAppDownload('apple');
                }}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                Download for iPhone
              </button>
              
              <button 
                onClick={() => {
                  // GA4 tracking
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'app_store_click', {
                      method: 'Android',
                      source: 'hero_section',
                      campaign: 'website_download'
                    });
                  }
                  // Meta Pixel tracking
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead', {
                      content_name: 'App Download - Android',
                      content_category: 'App Store Click'
                    });
                  }
                  handleAppDownload('android');
                }}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                Download for Android
              </button>
            </div>
          </div>
        </div>
      )}




    </section>
  );
}
