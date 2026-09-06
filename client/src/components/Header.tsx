import { useState } from "react";
import { Menu, X, Smartphone, ChevronDown } from "lucide-react";
import launchLogo from "@assets/Untitled design.png";
import { services, appService } from "@/data/services";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);

  const allServices = [...services, appService];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  };

  const handleStartTrial = () => {
    setShowAppDownloadModal(true);
  };

  const handleAppDownload = (platform: 'apple' | 'android') => {
    const links = {
      apple: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
      android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
    };
    window.open(links[platform], '_blank');
    setShowAppDownloadModal(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="flex justify-between items-center px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={launchLogo}
            alt="Launch Lifestyle"
            className="w-10 h-10 object-contain"
          />
          <span className="font-heading text-3xl uppercase tracking-wide text-foreground">
            Launch
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              onClick={() => setIsServicesOpen((v) => !v)}
              className="nav-link text-foreground/80 hover:text-foreground font-medium uppercase text-xs tracking-widest transition-colors px-4 flex items-center gap-1"
            >
              Services <ChevronDown className="w-3 h-3" />
            </button>

            {isServicesOpen && (
              <div className="absolute left-0 top-full pt-2 w-72">
                <div className="bg-card border border-border p-2 grid grid-cols-1 gap-0.5 shadow-xl">
                  {allServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection(service.id)}
                      className="text-left text-sm text-foreground/80 hover:text-primary hover:bg-background px-3 py-2 transition-colors"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => scrollToSection('coach')}
            className="nav-link text-foreground/80 hover:text-foreground font-medium uppercase text-xs tracking-widest transition-colors px-4"
          >
            Coach
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="nav-link text-foreground/80 hover:text-foreground font-medium uppercase text-xs tracking-widest transition-colors px-4"
          >
            Results
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="nav-link text-foreground/80 hover:text-foreground font-medium uppercase text-xs tracking-widest transition-colors px-4"
          >
            Contact
          </button>
          <button
            onClick={handleStartTrial}
            className="ml-4 bg-primary text-primary-foreground px-7 py-3 font-heading text-lg uppercase tracking-wide transition-transform hover:scale-105"
          >
            Start Free Trial
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-background border-t border-border max-h-[80vh] overflow-y-auto ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-6 py-6 space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground pt-2 pb-1">Services</p>
          {allServices.map((service) => (
            <button
              key={service.id}
              onClick={() => scrollToSection(service.id)}
              className="block text-foreground/80 text-sm py-2 w-full text-left"
            >
              {service.title}
            </button>
          ))}

          <div className="border-t border-border my-3" />

          <button
            onClick={() => scrollToSection('coach')}
            className="block text-foreground/80 font-medium uppercase text-sm tracking-widest py-3 w-full text-left"
          >
            Coach
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="block text-foreground/80 font-medium uppercase text-sm tracking-widest py-3 w-full text-left"
          >
            Results
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block text-foreground/80 font-medium uppercase text-sm tracking-widest py-3 w-full text-left"
          >
            Contact
          </button>
          <button
            onClick={() => {
              setShowAppDownloadModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="block bg-primary text-primary-foreground px-6 py-3 font-heading text-lg uppercase tracking-wide text-center mt-4 w-full"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-heading text-2xl uppercase mb-2">Get The App</h3>
              <p className="text-muted-foreground">Choose your platform to start your free trial</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAppDownload('apple')}
                className="w-full bg-brand-bone text-brand-black px-6 py-4 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iPhone
              </button>

              <button
                onClick={() => handleAppDownload('android')}
                className="w-full bg-brand-bone text-brand-black px-6 py-4 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Download for Android
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
