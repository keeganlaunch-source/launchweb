import { Share2, Copy, Check } from "lucide-react";
import { SiInstagram, SiFacebook, SiTiktok, SiYoutube, SiWhatsapp, SiX, SiLinkedin } from "react-icons/si";
import { useState } from "react";
import { trackSocialClick, trackCustomEvent } from "../lib/firebase";

export default function SocialShareSection() {
  const [copied, setCopied] = useState(false);
  
  const shareMessage = "Transform your fitness journey with Launch Lifestyle - personalized workouts, expert guidance, and AI coaching! 💪";
  const shareUrl = "https://launchfit.app";
  
  const socialPlatforms = [
    {
      name: "Instagram",
      icon: SiInstagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      action: () => copyToClipboard(`${shareMessage} ${shareUrl} #LaunchLifestyle #Fitness #Transformation`)
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "bg-blue-600",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`
    },
    {
      name: "X (Twitter)",
      icon: SiX,
      color: "bg-black",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=LaunchLifestyle,Fitness,Transformation`
    },
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      color: "bg-green-500",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      color: "bg-blue-700",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Launch Lifestyle - Transform Your Fitness Journey')}&summary=${encodeURIComponent(shareMessage)}`
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      color: "bg-black",
      action: () => copyToClipboard(`${shareMessage} ${shareUrl} #LaunchLifestyle #FitnessTransformation #AICoach`)
    }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackCustomEvent('share_content_copied', { platform: 'clipboard' });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: any) => {
    trackSocialClick(platform.name.toLowerCase());
    
    if (platform.url) {
      window.open(platform.url, '_blank', 'width=600,height=400');
    } else if (platform.action) {
      platform.action();
    }
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Share2 className="w-8 h-8 text-primary" />
          <h2 className="font-grunge text-3xl lg:text-4xl uppercase tracking-tight">
            Share The <span className="text-primary">Transformation</span>
          </h2>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8">
          Help others discover their fitness potential. Share Launch Lifestyle with your network!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {socialPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <button
                key={index}
                onClick={() => handleSocialShare(platform)}
                className={`${platform.color} text-white p-4 rounded-lg hover:scale-105 transform transition-all duration-200 hover:shadow-lg flex flex-col items-center gap-2 group`}
              >
                <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">{platform.name}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-background p-6 rounded-lg border-2 border-border">
          <h3 className="font-bold text-lg mb-3">Quick Copy & Share</h3>
          <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
            <p className="text-sm flex-1 text-left">{shareMessage} {shareUrl}</p>
            <button
              onClick={() => copyToClipboard(`${shareMessage} ${shareUrl}`)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}