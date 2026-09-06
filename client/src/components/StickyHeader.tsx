import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function StickyHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-primary/20 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold text-lg">LAUNCH</div>
          <div className="bg-primary text-black px-2 py-1 rounded text-sm font-bold">LIFESTYLE</div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm hidden md:block">Join 1000+ Transforming Lives</span>
          <Button 
            onClick={scrollToPricing}
            className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            START FREE TRIAL
          </Button>
        </div>
      </div>
    </div>
  );
}