import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoachSection from "@/components/CoachSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import LaunchAI from "@/components/LaunchAI";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { LeadMagnets } from "@/components/LeadMagnets";
import { TrustSignals } from "@/components/TrustSignals";
import FreeTrialSection from "@/components/FreeTrialSection";
import DigitalProductsSection from "@/components/DigitalProductsSection";
import FloatingCTA from "@/components/FloatingCTA";
import SEOEnhancer from "@/components/SEOEnhancer";
import ExitIntentModal from "@/components/ExitIntentModal";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const { isVisible, scrollToTop } = useScrollToTop();

  const handleEmailCapture = async (email: string, magnetType: string) => {
    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          magnetType,
          source: 'launch_hub'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log(`Lead magnet ${magnetType} signup successful:`, result.message);
      
      // Show success message without alert popup to avoid interference
      const successMessage = magnetType === 'consultation-draw' 
        ? 'Successfully entered into consultation draw! Draw ends last day of the month.'
        : 'Your free resource has been sent to your email!';
      
      // Use a toast-style notification instead of alert
      console.log('SUCCESS:', successMessage);
      
    } catch (error) {
      console.error('Lead magnet signup error:', error);
      console.log('ERROR: Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* 1. Get fit hook line */}
      <HeroSection />
      
      {/* 2. 3 check boxes (trust signals) */}
      <TrustSignals />
      
      {/* 3. Meet coach */}
      <CoachSection />
      
      {/* 4. Testimonials */}
      <TestimonialsSection />
      
      {/* 7-Day Free Trial CTA */}
      <FreeTrialSection />
      
      {/* Key Features */}
      <FeaturesSection />
      
      {/* Digital Products - Cookbook and Lifestyle Blueprint */}
      <DigitalProductsSection />
      
      {/* Lead magnets lower down */}
      <LeadMagnets onEmailCapture={handleEmailCapture} />
      
      {/* Have Questions - moved lower as requested */}
      <LaunchAI />
      
      {/* Newsletter signup */}
      <NewsletterSection />
      
      <Footer />
      
      {/* Floating bottom CTA - Main Sign Up Now */}
      <FloatingCTA />
      
      {/* Essential background elements only */}
      <SEOEnhancer />
      <ExitIntentModal />
      
      {/* WhatsApp widget */}
      <WhatsAppWidget />
      
      {/* Scroll to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 left-6 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}