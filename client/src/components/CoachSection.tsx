import keeganImage from "@assets/IMG_1148.jpeg";
import { Instagram, Facebook, Youtube, X } from "lucide-react";
import { useState } from "react";

export default function CoachSection() {
  const [showSocialModal, setShowSocialModal] = useState(false);
  const credentials = [
    "NASM Certified",
    "Est. Ballito 2017"
  ];

  const socialLinks = {
    facebook: 'https://www.facebook.com/share/1DbgdUujA9/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/life_of_keegan?igsh=dWV3YmdlN3ptODdn&utm_source=qr',
    youtube: 'https://youtube.com/@lifeofkeegs?si=A2iXi2ohmlcpdKs6'
  };

  const handleImageClick = () => {
    setShowSocialModal(true);
  };

  const handleSocialClick = (platform: string) => {
    window.open(socialLinks[platform as keyof typeof socialLinks], '_blank');
    setShowSocialModal(false);
  };

  return (
    <section id="coach" className="bg-card py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-5xl lg:text-7xl uppercase tracking-tight mb-16 text-center">
          Meet Your <span className="text-primary">Coach</span>
        </h2>

        {/* Coach Profile */}
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex justify-center">
            <div
              className="w-64 h-64 bg-muted border border-primary/40 overflow-hidden relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <img
                src={keeganImage}
                alt="Keegan - Launch Lifestyle Founder & Head Coach"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-brand-bone text-sm font-medium">
                  Click to view social media
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 text-left space-y-6">
            <h3 className="text-2xl font-semibold text-primary">Keegan — Founder &amp; Head Coach</h3>
            <p className="text-xl leading-relaxed italic text-foreground/90 border-l-2 border-primary pl-5">
              "I built Launch because I was tired of seeing people struggle with overcomplicated fitness apps and unrealistic diet plans. This isn't about perfection — it's about progress."
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Keegan leads every workout and personally designs each program to fit real life — no cookie-cutter plans.
            </p>

            {/* Coach Credentials */}
            <div className="flex flex-wrap gap-3 pt-2">
              {credentials.map((credential, index) => (
                <span
                  key={index}
                  className="border border-primary/40 text-primary px-4 py-2 font-medium uppercase text-xs tracking-widest"
                >
                  {credential}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Modal */}
        {showSocialModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-card border border-border p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowSocialModal(false)}
                className="absolute top-4 right-4 text-foreground/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl uppercase mb-2">Follow Keegan</h3>
                <p className="text-muted-foreground">Connect with me on social media</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleSocialClick('facebook')}
                  className="w-full bg-background text-foreground px-6 py-4 font-medium border border-border transition-colors hover:border-primary/50 flex items-center justify-center gap-3"
                >
                  <Facebook className="w-5 h-5" />
                  View Facebook Profile
                </button>

                <button
                  onClick={() => handleSocialClick('instagram')}
                  className="w-full bg-background text-foreground px-6 py-4 font-medium border border-border transition-colors hover:border-primary/50 flex items-center justify-center gap-3"
                >
                  <Instagram className="w-5 h-5" />
                  View Instagram Profile
                </button>

                <button
                  onClick={() => handleSocialClick('youtube')}
                  className="w-full bg-background text-foreground px-6 py-4 font-medium border border-border transition-colors hover:border-primary/50 flex items-center justify-center gap-3"
                >
                  <Youtube className="w-5 h-5" />
                  View YouTube Channel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
