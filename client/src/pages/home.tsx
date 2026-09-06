import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoachSection from "@/components/CoachSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { LeadMagnets } from "@/components/LeadMagnets";
import { TrustSignals } from "@/components/TrustSignals";
import ServicesOverview from "@/components/ServicesOverview";
import ServiceSections from "@/components/ServiceSections";
import AppSection from "@/components/AppSection";
import FloatingCTA from "@/components/FloatingCTA";
import SEOEnhancer from "@/components/SEOEnhancer";
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

      const successMessage = magnetType === 'consultation-draw'
        ? 'Successfully entered into consultation draw! Draw ends last day of the month.'
        : 'Your free resource has been sent to your email!';

      console.log('SUCCESS:', successMessage);

    } catch (error) {
      console.error('Lead magnet signup error:', error);
      console.log('ERROR: Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Trust signals */}
      <TrustSignals />

      {/* Services overview - jump-off point to every service */}
      <ServicesOverview />

      {/* Individual in-person service sections */}
      <ServiceSections />

      {/* What the app includes */}
      <FeaturesSection />

      {/* The app - kept prominent per the existing signup/download flow */}
      <AppSection />

      {/* Meet the coach */}
      <CoachSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Free resources */}
      <LeadMagnets onEmailCapture={handleEmailCapture} />

      {/* Newsletter signup */}
      <NewsletterSection />

      {/* Contact + footer */}
      <Footer />

      {/* Floating bottom CTA */}
      <FloatingCTA />

      {/* SEO */}
      <SEOEnhancer />

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
