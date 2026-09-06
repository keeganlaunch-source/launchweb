import { Check, Smartphone, X } from "lucide-react";
import { useState } from "react";
import coachHeroImage from "@assets/coach-hero.jpg";
import { trackAppDownload, trackCustomEvent } from "../lib/firebase";
import { trackAppDownload as trackMetaAppDownload, trackViewContent } from "../lib/meta-pixel";

export default function HeroSection() {
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);

  const heroFeatures = [
    "No gym membership required",
    "Personalized workout plans",
    "Direct access to your coach"
  ];

  const handlePrimaryCTA = () => {
    trackCustomEvent('cta_click', {
      button_name: 'Start Your Journey',
      section: 'hero',
      event_category: 'engagement'
    });
    trackViewContent('App Download Modal', 'Primary CTA');
    setShowAppDownloadModal(true);
  };

  const handleAppDownload = (platform: 'apple' | 'android') => {
    const links = {
      apple: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
      android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
    };

    trackAppDownload(platform === 'apple' ? 'ios' : 'android');
    trackMetaAppDownload();

    window.open(links[platform], '_blank');
    setShowAppDownloadModal(false);
  };

  return (
    <section id="hero" className="min-h-screen flex items-center px-6 lg:px-12 pt-32 pb-20 bg-background relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Hero Content */}
        <div className="space-y-8 animate-slide-in">
          <div className="inline-flex items-center gap-2 border border-primary/30 px-4 py-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-primary font-medium">
              Accepting new clients for {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' })}
            </span>
          </div>

          <h1 className="font-heading text-6xl lg:text-8xl leading-[0.95] uppercase">
            Get Fit At Home In{" "}
            <span className="text-primary">30 Days</span>{" "}
            Or Your Money Back
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-md animate-slide-in-delay">
            Zero gym required. Personalized coaching, built around your life.
          </p>

          {/* Hero Feature List */}
          <div className="space-y-3 pt-2 animate-slide-in-delay-2">
            {heroFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Hero CTA */}
          <div className="space-y-3 pt-4 animate-slide-in-delay-3 max-w-md">
            <button
              onClick={handlePrimaryCTA}
              className="w-full bg-primary text-primary-foreground px-8 py-5 font-heading text-2xl uppercase tracking-wide transition-transform hover:scale-[1.02]"
            >
              Start Free Trial
            </button>

            <button
              onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full border border-border px-6 py-3 font-medium uppercase tracking-wide text-sm text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors"
            >
              Get Free Guide
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
            <span>No credit card required</span>
            <span>Cancel anytime</span>
            <span>30-day guarantee</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative animate-slide-in">
          <div className="w-full h-96 lg:h-[600px] bg-muted relative overflow-hidden border border-border">
            <img
              src={coachHeroImage}
              alt="Coach Keegan, founder of Launch Lifestyle"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          <button
            onClick={handlePrimaryCTA}
            className="absolute -bottom-6 left-6 lg:left-10 bg-primary px-6 py-4 transition-transform hover:scale-105"
          >
            <span className="font-heading text-xl text-primary-foreground tracking-wide">Start Today</span>
          </button>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-heading text-2xl uppercase mb-2">Get The App</h3>
              <p className="text-muted-foreground">Choose your platform to start your free trial</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'app_store_click', {
                      method: 'iOS',
                      source: 'hero_section',
                      campaign: 'website_download'
                    });
                  }
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead', {
                      content_name: 'App Download - iOS',
                      content_category: 'App Store Click'
                    });
                  }
                  handleAppDownload('apple');
                }}
                className="w-full bg-brand-bone text-brand-black px-6 py-4 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iPhone
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'app_store_click', {
                      method: 'Android',
                      source: 'hero_section',
                      campaign: 'website_download'
                    });
                  }
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead', {
                      content_name: 'App Download - Android',
                      content_category: 'App Store Click'
                    });
                  }
                  handleAppDownload('android');
                }}
                className="w-full bg-brand-bone text-brand-black px-6 py-4 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Download for Android
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
