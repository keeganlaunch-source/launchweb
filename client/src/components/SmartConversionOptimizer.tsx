import { useState, useEffect } from 'react';
import { Zap, Target, TrendingUp, Clock, Users } from 'lucide-react';

interface UserBehavior {
  timeOnSite: number;
  scrollDepth: number;
  pageViews: number;
  clickEvents: number;
  engagementScore: number;
}

interface ConversionVariant {
  id: string;
  name: string;
  ctaText: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  socialProof: boolean;
  discountOffer: number;
  weight: number;
}

const CONVERSION_VARIANTS: ConversionVariant[] = [
  {
    id: 'control',
    name: 'Control',
    ctaText: 'Start Your Transformation',
    urgencyLevel: 'low',
    socialProof: true,
    discountOffer: 0,
    weight: 25
  },
  {
    id: 'urgency',
    name: 'High Urgency',
    ctaText: 'Claim Your Spot NOW',
    urgencyLevel: 'high',
    socialProof: true,
    discountOffer: 25,
    weight: 25
  },
  {
    id: 'social_proof',
    name: 'Social Proof Focus',
    ctaText: 'Join 1,247 Success Stories',
    urgencyLevel: 'medium',
    socialProof: true,
    discountOffer: 15,
    weight: 25
  },
  {
    id: 'value_focused',
    name: 'Value Proposition',
    ctaText: 'Get Results in 30 Days',
    urgencyLevel: 'medium',
    socialProof: false,
    discountOffer: 20,
    weight: 25
  }
];

export default function SmartConversionOptimizer() {
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    timeOnSite: 0,
    scrollDepth: 0,
    pageViews: 1,
    clickEvents: 0,
    engagementScore: 0
  });
  
  const [selectedVariant, setSelectedVariant] = useState<ConversionVariant | null>(null);
  const [showOptimizedCTA, setShowOptimizedCTA] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let clickCount = 0;
    
    // Select variant based on weighted distribution
    const selectVariant = () => {
      const random = Math.random() * 100;
      let cumulativeWeight = 0;
      
      for (const variant of CONVERSION_VARIANTS) {
        cumulativeWeight += variant.weight;
        if (random <= cumulativeWeight) {
          return variant;
        }
      }
      return CONVERSION_VARIANTS[0];
    };

    // Initialize variant
    const variant = selectVariant();
    setSelectedVariant(variant);
    
    // Track user behavior
    const updateBehavior = () => {
      const timeOnSite = Math.floor((Date.now() - startTime) / 1000);
      const scrollDepth = Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      
      const engagementScore = calculateEngagementScore(timeOnSite, scrollDepth, clickCount);
      
      setUserBehavior({
        timeOnSite,
        scrollDepth,
        pageViews: 1,
        clickEvents: clickCount,
        engagementScore
      });
    };

    const handleClick = () => {
      clickCount++;
      updateBehavior();
    };

    const handleScroll = () => updateBehavior();

    // Show optimized CTA based on engagement
    const checkShowCTA = () => {
      if (userBehavior.engagementScore >= 40 && !showOptimizedCTA) {
        setShowOptimizedCTA(true);
      }
    };

    const behaviorTimer = setInterval(() => {
      updateBehavior();
      checkShowCTA();
    }, 5000);

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(behaviorTimer);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [userBehavior.engagementScore, showOptimizedCTA]);

  const calculateEngagementScore = (time: number, scroll: number, clicks: number): number => {
    const timeScore = Math.min(30, time * 0.5); // Max 30 points for time
    const scrollScore = Math.min(40, scroll * 0.4); // Max 40 points for scroll
    const clickScore = Math.min(30, clicks * 5); // Max 30 points for clicks
    
    return Math.round(timeScore + scrollScore + clickScore);
  };

  const getOptimizedMessage = (): string => {
    if (!selectedVariant) return '';
    
    const { engagementScore } = userBehavior;
    
    if (engagementScore >= 70) {
      return `🔥 You're highly engaged! ${selectedVariant.discountOffer > 0 ? `Get ${selectedVariant.discountOffer}% off` : 'Special offer for you'}`;
    } else if (engagementScore >= 40) {
      return `⚡ Ready to start? ${selectedVariant.socialProof ? 'Join thousands of success stories' : 'Transform your fitness today'}`;
    } else {
      return '👋 Still exploring? Let us help you get started';
    }
  };

  if (!selectedVariant || !showOptimizedCTA) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-2xl z-50 max-w-sm transform transition-all duration-500 hover:scale-105">
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Target className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-medium mb-1">
            {getOptimizedMessage()}
          </div>
          
          <button 
            onClick={() => {
              const pricing = document.getElementById('pricing');
              pricing?.scrollIntoView({ behavior: 'smooth' });
              setShowOptimizedCTA(false);
            }}
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300 transition-colors text-sm"
          >
            {selectedVariant.ctaText}
          </button>
          
          {selectedVariant.discountOffer > 0 && (
            <div className="text-xs mt-1 opacity-90">
              Limited time: {selectedVariant.discountOffer}% off
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setShowOptimizedCTA(false)}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
      
      {/* Engagement indicators */}
      <div className="mt-3 flex gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{Math.floor(userBehavior.timeOnSite / 60)}m{userBehavior.timeOnSite % 60}s</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>{Math.round(userBehavior.scrollDepth)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>{userBehavior.engagementScore}/100</span>
        </div>
      </div>
    </div>
  );
}