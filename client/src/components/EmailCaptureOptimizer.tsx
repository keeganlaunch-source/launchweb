import { useState, useEffect } from 'react';
import { Mail, Gift, Clock, Users, Star, ArrowRight } from 'lucide-react';

interface EmailCaptureProps {
  variant: 'lead_magnet' | 'social_proof' | 'urgency' | 'value_stack';
}

export default function EmailCaptureOptimizer({ variant = 'lead_magnet' }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(1247);

  useEffect(() => {
    // Show email capture after 45 seconds of engagement
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('email-capture-dismissed');
      const lastSubmission = localStorage.getItem('email-last-submission');
      
      // Don't show if dismissed in last 24 hours or submitted in last 7 days
      const now = Date.now();
      if (dismissed && (now - parseInt(dismissed)) < 24 * 60 * 60 * 1000) return;
      if (lastSubmission && (now - parseInt(lastSubmission)) < 7 * 24 * 60 * 60 * 1000) return;
      
      setIsVisible(true);
    }, 45000);

    // Update subscriber count periodically
    const countTimer = setInterval(() => {
      setSubscriberCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(countTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Submit to backend
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: `email_capture_${variant}` })
      });

      if (response.ok) {
        setShowThankYou(true);
        localStorage.setItem('email-last-submission', Date.now().toString());
        
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
            event_category: 'email_signup',
            event_label: variant
          });
        }

        // Hide after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Email submission error:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('email-capture-dismissed', Date.now().toString());
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'lead_magnet':
        return {
          icon: <Gift className="w-6 h-6 text-yellow-400" />,
          headline: "Get Your FREE Consistency Hacks Guide",
          subtext: "5 evidence-based strategies that help you stay consistent with your fitness goals",
          cta: "Download Free Guide",
          bonus: "Plus: Weekly fitness insights delivered to your inbox"
        };
      
      case 'social_proof':
        return {
          icon: <Users className="w-6 h-6 text-green-400" />,
          headline: `Join ${subscriberCount.toLocaleString()} Success Stories`,
          subtext: "Get the daily motivation and tips that transformed thousands of lives",
          cta: "Join the Community",
          bonus: "New members get exclusive workout bonus"
        };
      
      case 'urgency':
        return {
          icon: <Clock className="w-6 h-6 text-red-400" />,
          headline: "⚡ Limited Time: Free Transformation Kit",
          subtext: "Only available for the next 48 hours - usually costs R199",
          cta: "Claim Your Kit Now",
          bonus: "Includes: Meal plans, workouts, and progress tracker"
        };
      
      case 'value_stack':
        return {
          icon: <Star className="w-6 h-6 text-purple-400" />,
          headline: "Get R599 Worth of Fitness Tools FREE",
          subtext: "Everything you need to start your transformation today",
          cta: "Get Instant Access",
          bonus: "✓ Meal Plans ✓ Workouts ✓ Progress Tracker ✓ Private Community"
        };
      
      default:
        return {
          icon: <Mail className="w-6 h-6" />,
          headline: "Stay Updated",
          subtext: "Get the latest fitness tips",
          cta: "Subscribe",
          bonus: ""
        };
    }
  };

  if (!isVisible) return null;

  const content = getVariantContent();

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Welcome to the Family!</h3>
          <p className="text-gray-600 mb-4">
            Check your email for your free transformation kit. It should arrive within 5 minutes.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-primary text-black font-bold py-2 px-6 rounded hover:bg-primary/90 transition-colors"
          >
            Let's Go!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {content.icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{content.headline}</h3>
          <p className="text-gray-600 text-sm">{content.subtext}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {content.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {content.bonus && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">{content.bonus}</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            No spam, unsubscribe anytime. By signing up, you agree to our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}