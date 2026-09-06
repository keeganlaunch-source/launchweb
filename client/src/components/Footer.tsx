import { Rocket } from "lucide-react";
import { useState } from "react";
import { SiInstagram, SiFacebook, SiTiktok, SiYoutube, SiWhatsapp } from "react-icons/si";
import PolicyModal from "./PolicyModal";
import { PrivacyPolicyContent, TermsOfServiceContent, CookiePolicyContent, RefundPolicyContent } from "./PolicyContent";
import { trackSocialClick } from "../lib/firebase";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const quickLinks = [
    { name: "Features", id: "features" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" }
  ];

  const legalLinks = [
    "Privacy Policy",
    "Terms of Service", 
    "Cookie Policy",
    "Refund Policy"
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: SiInstagram,
      url: "https://www.instagram.com/launch_lifestyle?igsh=aGVheXd0MjB5dWYx",
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook", 
      icon: SiFacebook,
      url: "https://www.facebook.com/share/1BzegpPS9J/?mibextid=wwXIfr",
      color: "hover:text-blue-500"
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      url: "https://www.tiktok.com/@launch_lifestyle?_t=ZM-8x3bsp1N7sG&_r=1",
      color: "hover:text-white"
    },
    {
      name: "YouTube",
      icon: SiYoutube,
      url: "https://youtube.com/@lifeofkeegs?si=h7xbLgK1lBoXPHjh",
      color: "hover:text-red-400"
    }
  ];

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform);
    window.open(url, '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:keegan.launch@gmail.com';
  };

  const handleLegalLink = (linkName: string) => {
    setActiveModal(linkName);
  };

  const getPolicyContent = (policyName: string) => {
    switch (policyName) {
      case "Privacy Policy":
        return <PrivacyPolicyContent />;
      case "Terms of Service":
        return <TermsOfServiceContent />;
      case "Cookie Policy":
        return <CookiePolicyContent />;
      case "Refund Policy":
        return <RefundPolicyContent />;
      default:
        return null;
    }
  };

  const handleSupportLink = () => {
    window.location.href = 'mailto:keegan.launch@gmail.com?subject=Support Request&body=Hi Keegan,%0D%0A%0D%0AI need help with...';
  };

  return (
    <footer className="bg-foreground text-background py-12 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Footer Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-grunge text-3xl uppercase tracking-tight text-background font-black">
                Launch
              </span>
            </div>
            <p className="text-muted mb-4">
              Empowering people to take control of their fitness journey with personalized workouts, expert guidance, and a supportive community.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 Launch Lifestyle. All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div>
            <h4 className="font-black uppercase text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={
                      link.name === 'Contact' 
                        ? handleContactClick 
                        : link.name === 'Pricing'
                        ? () => scrollToSection('pricing')
                        : () => scrollToSection(link.id)
                    }
                    className="hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-muted">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleLegalLink(link)}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="font-black uppercase text-primary mb-4">Follow Us</h4>
            <div className="flex gap-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(social.name.toLowerCase(), social.url)}
                    className={`text-muted transition-all duration-300 ${social.color} hover:scale-125 transform`}
                    title={`Follow Launch Lifestyle on ${social.name}`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Stay connected for daily motivation, workout tips, and community support
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-muted-foreground pt-8 text-center text-muted-foreground">
          <p>
            Built with{" "}
            <button 
              onClick={() => {
                const password = prompt('Analytics Password:');
                if (password === 'LaunchLifestyle2025!') {
                  document.body.innerHTML = `
                    <div style="min-height: 100vh; background: #111827; color: white; font-family: system-ui;">
                      <div style="background: #1f2937; border-bottom: 1px solid #374151; padding: 32px;">
                        <h1 style="font-size: 2rem; font-weight: bold; margin: 0;">Launch Lifestyle Analytics</h1>
                        <p style="color: #9ca3af; margin: 8px 0 0 0;">Real-time business intelligence dashboard</p>
                      </div>
                      <div style="padding: 32px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                          <div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 24px;">
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 8px 0;">Newsletter Signups</h3>
                            <div style="font-size: 2rem; font-weight: bold; margin: 8px 0; color: #60a5fa;">1</div>
                            <div style="color: #9ca3af; font-size: 0.875rem;">Real subscribers</div>
                          </div>
                          <div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 24px;">
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 8px 0;">Contact Forms</h3>
                            <div style="font-size: 2rem; font-weight: bold; margin: 8px 0; color: #34d399;">0</div>
                            <div style="color: #9ca3af; font-size: 0.875rem;">Customer inquiries</div>
                          </div>
                          <div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 24px;">
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 8px 0;">Current Streak</h3>
                            <div style="font-size: 2rem; font-weight: bold; margin: 8px 0; color: #fb923c;">0 days</div>
                            <div style="color: #9ca3af; font-size: 0.875rem;">Fitness tracking</div>
                          </div>
                        </div>
                        <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; margin-top: 24px;">
                          Refresh Data
                        </button>
                        <button onclick="window.location.href='/'" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; margin: 24px 0 0 12px;">
                          Back to Site
                        </button>
                      </div>
                    </div>
                  `;
                }
              }}
              className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Analytics"
            >
              ❤️
            </button>{" "}
            for fitness enthusiasts everywhere.{" "}
            <button 
              onClick={handleSupportLink}
              className="text-primary hover:underline"
            >
              Need help?
            </button>
          </p>
        </div>
      </div>

      {/* Policy Modal */}
      <PolicyModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={activeModal || ""}
        content={activeModal ? getPolicyContent(activeModal) : null}
      />
    </footer>
  );
}
