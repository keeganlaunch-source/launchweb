import keeganImage from "@assets/IMG_1148.jpeg";
import { Instagram, Facebook, Youtube, X } from "lucide-react";
import { useState } from "react";

export default function CoachSection() {
  const [showSocialModal, setShowSocialModal] = useState(false);
  const credentials = [
    "NASM Certified",
    "10+ Years", 
    "1000+ Clients"
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
    <section id="coach" className="bg-foreground text-background py-20 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-grunge text-4xl lg:text-6xl uppercase tracking-tight mb-4">
          Meet Your <span className="text-primary">Coach</span>
        </h2>
        
        {/* Coach Profile */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center mt-12">
          <div className="lg:col-span-2 flex justify-center">
            <div 
              className="w-64 h-64 bg-muted border-4 border-primary rounded-lg overflow-hidden relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <img 
                src={keeganImage} 
                alt="Keegan - Launch Lifestyle Founder & Head Coach" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold">
                  Click to view social media
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 text-left space-y-6">
            <h3 className="text-3xl text-primary font-bold">Keegan - Founder & Head Coach</h3>
            <p className="text-xl leading-relaxed italic text-primary border-l-4 border-primary pl-4">
              "I built Launch because I was tired of seeing people struggle with overcomplicated fitness apps and unrealistic diet plans. This isn't about perfection — it's about progress."
            </p>
            <p className="text-lg leading-relaxed">
              With 10+ years of coaching experience and a passion for making fitness accessible, Keegan leads every workout and personally designs each program to fit real life.
            </p>
            
            {/* Coach Credentials */}
            <div className="flex flex-wrap gap-4 pt-4">
              {credentials.map((credential, index) => (
                <span 
                  key={index}
                  className="bg-primary text-primary-foreground px-4 py-2 font-semibold uppercase text-sm border border-border"
                >
                  {credential}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Modal */}
        {showSocialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-background border-2 border-border p-8 max-w-md w-full relative">
              <button 
                onClick={() => setShowSocialModal(false)}
                className="absolute top-4 right-4 text-foreground hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="font-grunge text-2xl uppercase mb-2 text-foreground">Follow Keegan</h3>
                <p className="text-muted-foreground">Connect with me on social media</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  className="w-full bg-foreground text-background px-6 py-4 font-semibold border-2 border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-3"
                >
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                  View Facebook Profile
                </button>
                
                <button 
                  onClick={() => handleSocialClick('instagram')}
                  className="w-full bg-foreground text-background px-6 py-4 font-semibold border-2 border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-3"
                >
                  <Instagram className="w-6 h-6" style={{
                    background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }} />
                  View Instagram Profile
                </button>

                <button 
                  onClick={() => handleSocialClick('youtube')}
                  className="w-full bg-foreground text-background px-6 py-4 font-semibold border-2 border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-3"
                >
                  <Youtube className="w-6 h-6 text-[#FF0000]" />
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
