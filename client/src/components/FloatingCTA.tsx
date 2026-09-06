import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap, Smartphone } from 'lucide-react';
import { SiAppstore, SiGoogleplay } from "react-icons/si";
import { trackAppDownload } from "../lib/firebase";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);

  useEffect(() => {
    // Simple approach: Show when user scrolls past hero section
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignUp = () => {
    setShowAppDownloadModal(true);
  };

  const handleAppDownload = (platform: 'apple' | 'android') => {
    const links = {
      apple: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
      android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
    };
    
    trackAppDownload(platform === 'apple' ? 'ios' : 'android');
    window.open(links[platform], '_blank');
    setShowAppDownloadModal(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Simple, clean bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-yellow-400 p-4 shadow-2xl z-[100] border-t-2 border-black">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-bold text-lg">Ready to Transform Your Life?</div>
            <div className="text-sm opacity-90">Join 1000+ success stories today</div>
          </div>
          
          <Button 
            onClick={handleSignUp}
            className="bg-black hover:bg-black/90 text-white font-bold px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 text-lg"
          >
            SIGN UP NOW
          </Button>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] px-4">
          <div className="bg-black border-2 border-yellow-400 p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-grunge text-2xl uppercase mb-2 text-white">Download Launch App</h3>
              <p className="text-gray-300">Choose your platform to start your free trial</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleAppDownload('apple')}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                Download for iOS
              </button>
              
              <button 
                onClick={() => handleAppDownload('android')}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                Download for Android
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}