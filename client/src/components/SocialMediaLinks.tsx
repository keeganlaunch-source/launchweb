import { Button } from '@/components/ui/button';
import { 
  trackInstagramEngagement, 
  trackFacebookEngagement, 
  trackTikTokEngagement, 
  trackXEngagement, 
  trackThreadsEngagement, 
  trackYouTubeEngagement,
  trackAppStoreActivity 
} from '../lib/multi-platform-tracking';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  platform: string;
}

export function SocialMediaLinks() {
  const handleSocialClick = (platform: string, url: string) => {
    // Track real user clicks with authentic data
    switch (platform) {
      case 'instagram':
        trackInstagramEngagement('profile', 'click');
        break;
      case 'facebook':
        trackFacebookEngagement('page', 'click');
        break;
      case 'tiktok':
        trackTikTokEngagement('Launch Lifestyle Profile', 'profile_visit');
        break;
      case 'x':
        trackXEngagement('Launch Lifestyle Profile', 'view');
        break;
      case 'threads':
        trackThreadsEngagement('Launch Lifestyle Profile', 'view');
        break;
      case 'youtube':
        trackYouTubeEngagement('Launch Lifestyle Channel', 'view');
        break;
      case 'app_store':
        trackAppStoreActivity('app_store', 'view');
        break;
      case 'play_store':
        trackAppStoreActivity('play_store', 'view');
        break;
    }
    
    window.open(url, '_blank');
  };

  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/launchlifestyle',
      icon: <span className="text-xl">📷</span>,
      platform: 'instagram'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/launchlifestyle',
      icon: <span className="text-xl">📘</span>,
      platform: 'facebook'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@launchlifestyle',
      icon: <span className="text-xl">🎵</span>,
      platform: 'tiktok'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/launchlifestyle',
      icon: <span className="text-xl">❌</span>,
      platform: 'x'
    },
    {
      name: 'Threads',
      url: 'https://threads.net/@launchlifestyle',
      icon: <span className="text-xl">🧵</span>,
      platform: 'threads'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@launchlifestyle',
      icon: <span className="text-xl">📺</span>,
      platform: 'youtube'
    }
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {socialLinks.map((link) => (
        <Button
          key={link.platform}
          variant="outline"
          size="sm"
          onClick={() => handleSocialClick(link.platform, link.url)}
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {link.icon}
          {link.name}
        </Button>
      ))}
    </div>
  );
}