import { useState, useEffect } from 'react';
import { Bell, X, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RetentionNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'welcome',
      title: 'Welcome to Launch Lifestyle!',
      message: 'Complete your profile to get personalized workouts',
      icon: Gift,
      action: 'Complete Profile',
      delay: 5000,
      priority: 'high'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Your fitness journey awaits',
      message: 'Start your first workout today and see results in 7 days',
      icon: Clock,
      action: 'Start Workout',
      delay: 15000,
      priority: 'medium'
    }
  ]);

  const [activeNotification, setActiveNotification] = useState<any>(null);

  useEffect(() => {
    if (notifications.length > 0 && !activeNotification) {
      const timer = setTimeout(() => {
        setActiveNotification(notifications[0]);
      }, notifications[0].delay);

      return () => clearTimeout(timer);
    }
  }, [notifications, activeNotification]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveNotification(null);
  };

  const handleAction = () => {
    const pricingSection = document.getElementById('pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
    setActiveNotification(null);
  };

  if (!activeNotification) return null;

  const IconComponent = activeNotification.icon;

  return (
    <div className="fixed top-20 right-4 w-80 bg-white text-black p-4 rounded-lg shadow-xl border-l-4 border-primary z-50 animate-in slide-in-from-right-2">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-sm text-gray-900">{activeNotification.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{activeNotification.message}</p>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleAction}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-black font-medium px-3 py-1 text-xs"
            >
              {activeNotification.action}
            </Button>
            <Button
              onClick={() => dismissNotification(activeNotification.id)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 px-2 py-1 text-xs"
            >
              Later
            </Button>
          </div>
        </div>
        
        <button
          onClick={() => dismissNotification(activeNotification.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}