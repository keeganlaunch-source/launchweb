import { Clock, Users, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentUsers, setCurrentUsers] = useState(23);

  useEffect(() => {
    // Set countdown to end of current day
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    // Simulate live user count fluctuation
    const updateUserCount = () => {
      setCurrentUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(15, Math.min(35, newCount));
      });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    const userInterval = setInterval(updateUserCount, 8000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(userInterval);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between relative z-10">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="font-bold text-sm">FREE TRIAL ENDS TODAY</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              <span className="font-bold text-yellow-300">{currentUsers}</span> people viewing
            </span>
          </div>
          <button className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors">
            CLAIM NOW
          </button>
        </div>
      </div>
    </div>
  );
}