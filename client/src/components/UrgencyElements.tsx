import { useState, useEffect } from 'react';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function ScarcityIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Get current month name and next month
  const getCurrentMonth = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      .toLocaleString('default', { month: 'long' });
    return { currentMonth, nextMonth };
  };

  const { currentMonth, nextMonth } = getCurrentMonth();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm text-white py-3 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } border-b border-[#FFD600]/20`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-1.5 h-1.5 bg-[#FFD600] rounded-full animate-pulse"></div>
            <span className="font-bold text-[#FFD600] text-sm">ACCEPTING NEW CLIENTS</span>
            <span className="font-bold text-[#FFD600] text-sm">for {nextMonth}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => window.open('https://apps.apple.com/za/app/launch-lifestyle/id6743004197', '_blank')}
              className="bg-white text-black py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-1.5 w-32"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>App Store</span>
            </button>
            <button
              onClick={() => window.open('https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share', '_blank')}
              className="bg-white text-black py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-1.5 w-32"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <span>Google Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialProofIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentSignups] = useState([
    { name: "Emma from Ballito", time: "2 hours ago" },
    { name: "Sarah from Durban", time: "4 hours ago" },
    { name: "Mike from Cape Town", time: "6 hours ago" }
  ]);

  useEffect(() => {
    // Show notification after 5 seconds, then hide after 8 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 5000);
    const hideTimer = setTimeout(() => setIsVisible(false), 13000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-24 right-6 z-40 max-w-xs bg-white/95 backdrop-blur shadow-lg border border-gray-200 animate-slide-in">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-[#FFD600] flex items-center justify-center text-xs font-bold">
                E
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
                S
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold">2 people joined today</p>
              <p className="text-xs text-gray-500">Latest: Emma from Ballito</p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            ×
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse">
        Start Free Today →
      </button>
    </div>
  );
}