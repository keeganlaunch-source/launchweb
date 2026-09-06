import { useState, useEffect } from 'react';
import { Clock, Users, Zap, Star } from 'lucide-react';
import { trackCustomEvent } from '../lib/firebase';

export default function AdvancedCTAOptimizer() {
  const [currentVariant, setCurrentVariant] = useState('default');
  const [urgencyTimer, setUrgencyTimer] = useState(null);
  const [visitorCount, setVisitorCount] = useState(247);

  useEffect(() => {
    // A/B test CTA variants based on user behavior
    const variants = ['default', 'urgency', 'social_proof', 'benefit_focused'];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setCurrentVariant(randomVariant);
    
    trackCustomEvent('cta_variant_shown', { variant: randomVariant });

    // Simulate real-time visitor count
    const updateVisitorCount = () => {
      setVisitorCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(200, Math.min(300, prev + change));
      });
    };

    const interval = setInterval(updateVisitorCount, 8000);
    return () => clearInterval(interval);
  }, []);

  const ctaVariants = {
    default: {
      headline: "START FREE TRIAL",
      subtext: "Join 1000+ Members",
      icon: <Zap className="w-5 h-5" />,
      urgency: false
    },
    urgency: {
      headline: "CLAIM YOUR SPOT NOW",
      subtext: "Only 23 spots left today",
      icon: <Clock className="w-5 h-5" />,
      urgency: true
    },
    social_proof: {
      headline: "JOIN THE MOVEMENT",
      subtext: `${visitorCount} people viewing now`,
      icon: <Users className="w-5 h-5" />,
      urgency: false
    },
    benefit_focused: {
      headline: "TRANSFORM IN 30 DAYS",
      subtext: "Guaranteed results or refund",
      icon: <Star className="w-5 h-5" />,
      urgency: false
    }
  };

  const currentCTA = ctaVariants[currentVariant];

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40">
      <div className={`bg-gradient-to-r from-primary to-yellow-400 text-black p-4 rounded-lg shadow-xl transform transition-all duration-500 ${
        currentCTA.urgency ? 'animate-pulse' : ''
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {currentCTA.icon}
            <span className="font-bold text-sm">{currentCTA.headline}</span>
          </div>
          {currentCTA.urgency && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              LIMITED
            </div>
          )}
        </div>
        
        <p className="text-xs opacity-80 mb-3">{currentCTA.subtext}</p>
        
        <button 
          onClick={() => {
            trackCustomEvent('optimized_cta_click', { variant: currentVariant });
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 rounded-full transition-all duration-200 transform hover:scale-105"
        >
          START NOW
        </button>
        
        <div className="flex justify-center items-center gap-1 mt-2 text-xs opacity-70">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{visitorCount} active users</span>
        </div>
      </div>
    </div>
  );
}