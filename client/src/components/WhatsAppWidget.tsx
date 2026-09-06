import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackWhatsAppContact, trackContact } from '../lib/meta-pixel';
import { trackWhatsAppInteraction } from '../lib/multi-platform-tracking';

export function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappNumber = "+27694844629"; // Coach Keegs actual number

  useEffect(() => {
    // Smooth fade-in animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    // Track actual WhatsApp interaction with real user data
    trackWhatsAppContact();
    trackContact('WhatsApp');
    trackWhatsAppInteraction('click');
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Button
        onClick={openWhatsApp}
        className={`bg-brand-forest hover:opacity-90 text-brand-bone p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        size="lg"
        title="Chat with Coach Keegs on WhatsApp"
      >
        <SiWhatsapp className="w-6 h-6" />
      </Button>
    </div>
  );
}