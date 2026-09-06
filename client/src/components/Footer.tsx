import { useState } from "react";
import { SiInstagram, SiFacebook, SiTiktok, SiYoutube, SiWhatsapp } from "react-icons/si";
import { Mail, MapPin } from "lucide-react";
import PolicyModal from "./PolicyModal";
import { PrivacyPolicyContent, TermsOfServiceContent, CookiePolicyContent, RefundPolicyContent } from "./PolicyContent";
import { trackSocialClick } from "../lib/firebase";
import { whatsappLink, CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const quickLinks = [
    { name: "Services", id: "services" },
    { name: "Coach", id: "coach" },
    { name: "Results", id: "testimonials" },
    { name: "The App", id: "app" }
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
      url: "https://www.instagram.com/launch_lifestyle?igsh=aGVheXd0MjB5dWYx"
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      url: "https://www.facebook.com/share/1BzegpPS9J/?mibextid=wwXIfr"
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      url: "https://www.tiktok.com/@launch_lifestyle?_t=ZM-8x3bsp1N7sG&_r=1"
    },
    {
      name: "YouTube",
      icon: SiYoutube,
      url: "https://youtube.com/@lifeofkeegs?si=h7xbLgK1lBoXPHjh"
    }
  ];

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform);
    window.open(url, '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  return (
    <footer id="contact" className="bg-card text-foreground border-t border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        {/* Contact block */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl lg:text-6xl uppercase tracking-tight mb-3">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Ballito, KZN, South Africa · Building Better Humans since 2017
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappLink("Hi Keegan! I'd like to find out more about Launch Lifestyle.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-4 font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp 069 484 4629
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="border border-border px-8 py-4 font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 hover:border-primary/50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <button
            onClick={() => handleSocialClick('instagram', INSTAGRAM_URL)}
            className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <SiInstagram className="w-4 h-4" />
            {INSTAGRAM_HANDLE}
          </button>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12 pt-12 border-t border-border">
          <div className="md:col-span-1">
            <span className="font-heading text-3xl uppercase tracking-wide">Launch</span>
            <p className="text-sm text-muted-foreground mt-3 mb-2">
              Building Better Humans.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              Ballito, KZN · Est. 2017
            </div>
          </div>

          <div>
            <h4 className="font-medium uppercase text-primary text-xs tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium uppercase text-primary text-xs tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
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

          <div>
            <h4 className="font-medium uppercase text-primary text-xs tracking-widest mb-4">Follow</h4>
            <div className="flex gap-5">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(social.name.toLowerCase(), social.url)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title={`Follow Launch Lifestyle on ${social.name}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Launch Lifestyle. All rights reserved.</p>
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
