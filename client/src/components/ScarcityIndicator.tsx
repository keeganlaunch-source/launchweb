import { useState, useEffect } from 'react';
import { Users, Clock, Flame, X, TrendingUp } from 'lucide-react';

export default function ScarcityIndicator() {
  const [spotsLeft, setSpotsLeft] = useState(23);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 32 });
  const [isVisible, setIsVisible] = useState(true);
  const [recentSignups, setRecentSignups] = useState([
    "Sarah M. from Cape Town",
    "Michael K. from Johannesburg", 
    "Lisa T. from Durban"
  ]);

  useEffect(() => {
    // Optimal timing: Show after 8 seconds (not immediately - feels spammy)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);
    
    const dismissedTime = localStorage.getItem('scarcity-dismissed-time');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // Extended to 5 minutes

    if (dismissedTime && (now - parseInt(dismissedTime)) < fiveMinutes) {
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
        localStorage.removeItem('scarcity-dismissed-time');
      }, fiveMinutes - (now - parseInt(dismissedTime)));
    }

    return () => clearTimeout(initialTimer);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    // Simulate spot reduction
    const spotTimer = setInterval(() => {
      setSpotsLeft(prev => Math.max(15, prev - Math.floor(Math.random() * 2)));
    }, 30000);

    // Simulate new signups
    const signupTimer = setInterval(() => {
      const names = [
        "Emma R. from Port Elizabeth", "David L. from Pretoria",
        "Nicole S. from Bloemfontein", "James W. from East London",
        "Amy C. from Pietermaritzburg", "Ryan B. from Polokwane"
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      setRecentSignups(prev => [randomName, ...prev.slice(0, 2)]);
    }, 45000);

    return () => {
      clearInterval(timer);
      clearInterval(spotTimer);
      clearInterval(signupTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('scarcity-dismissed-time', Date.now().toString());
    
    // Reappear after 2 minutes
    setTimeout(() => {
      setIsVisible(true);
      localStorage.removeItem('scarcity-dismissed-time');
    }, 2 * 60 * 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 bg-black text-white p-3 rounded-lg shadow-xl z-[999] max-w-xs transform transition-all duration-300 hover:scale-105">
      {/* Close Button */}
      <button 
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full p-1 transition-colors"
        aria-label="Close for 2 minutes"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="space-y-2">
        {/* Compact Spots Left */}
        <div className="flex items-center gap-2 p-2 bg-red-600 rounded text-xs">
          <Users className="w-4 h-4" />
          <div>
            <div className="font-bold">Only {spotsLeft} spots left!</div>
          </div>
        </div>

        {/* Compact Countdown */}
        <div className="flex items-center gap-2 p-2 bg-orange-600 rounded text-xs">
          <Clock className="w-4 h-4" />
          <div>
            <div className="font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="opacity-90">Until price increases</div>
          </div>
        </div>

        {/* Compact Recent Activity - Show only count */}
        <div className="text-xs p-2 bg-green-600 rounded">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">3 joined recently</span>
          </div>
        </div>
      </div>
    </div>
  );
}