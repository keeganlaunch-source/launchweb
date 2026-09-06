import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { trackContact, trackLead } from "../lib/meta-pixel";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Track contact form submission for advertising attribution
      trackContact('form');
      trackLead();
      
      toast({
        title: "Message Sent!",
        description: data.message,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLink = (platform: string) => {
    const socialLinks: {[key: string]: string} = {
      instagram: 'https://www.instagram.com/launch_lifestyle?igsh=aGVheXd0MjB5dWYx',
      facebook: 'https://www.facebook.com/share/16J7thazZm/?mibextid=wwXIfr',
      youtube: 'https://youtube.com/@lifeofkeegs?si=DVijQ3fbJ7075cAA',
      tiktok: 'https://www.tiktok.com/@launch_lifestyle?_t=ZM-8wcc1vD44Cz&_r=1'
    };
    
    window.open(socialLinks[platform], '_blank');
  };

  const handlePhoneClick = () => {
    setShowPhoneOptions(true);
  };

  const handleCall = () => {
    window.location.href = 'tel:+27694844629';
    setShowPhoneOptions(false);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/27694844629', '_blank');
    setShowPhoneOptions(false);
  };

  return (
    <section id="contact" className="py-20 px-4 lg:px-8 bg-muted">
      <div className="max-w-6xl mx-auto">
        {/* Contact Header */}
        <div className="text-center mb-16">
          <h2 className="font-grunge text-4xl lg:text-6xl uppercase tracking-tight mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions? We're here to help you start your fitness journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-background border-2 border-border p-8">
            <h3 className="font-black text-2xl uppercase mb-6">Send us a message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2" htmlFor="name">Full Name</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border focus:border-primary focus:outline-none bg-background text-foreground"
                  required
                  disabled={contactMutation.isPending}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="email">Email Address</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border focus:border-primary focus:outline-none bg-background text-foreground"
                  required
                  disabled={contactMutation.isPending}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="subject">Subject</label>
                <select 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border focus:border-primary focus:outline-none bg-background text-foreground"
                  required
                  disabled={contactMutation.isPending}
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border focus:border-primary focus:outline-none resize-vertical bg-background text-foreground"
                  required
                  disabled={contactMutation.isPending}
                />
              </div>
              <button 
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-primary text-primary-foreground px-8 py-4 font-black uppercase tracking-wide border-2 border-border transition-all duration-300 hero-shadow disabled:opacity-50"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-background border-2 border-border p-8">
              <h3 className="font-black text-2xl uppercase mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="text-primary text-xl w-6" />
                  <a href="mailto:keegan.launch@gmail.com" className="font-semibold hover:text-primary transition-colors">keegan.launch@gmail.com</a>
                </div>
                <div className="flex items-center gap-4 relative">
                  <Phone className="text-primary text-xl w-6" />
                  <button 
                    onClick={handlePhoneClick}
                    className="font-semibold hover:text-primary transition-colors text-left"
                  >
                    (069)484-4629
                  </button>
                  
                  {showPhoneOptions && (
                    <div className="absolute left-0 top-full mt-2 bg-background border-2 border-border p-4 shadow-lg z-10 min-w-[200px]">
                      <div className="space-y-2">
                        <button
                          onClick={handleCall}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="font-semibold">Call</span>
                        </button>
                        <button
                          onClick={handleWhatsApp}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                        >
                          <MessageCircle className="w-4 h-4 text-primary" />
                          <span className="font-semibold">WhatsApp</span>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowPhoneOptions(false)}
                        className="absolute top-1 right-1 text-muted-foreground hover:text-foreground text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="text-primary text-xl w-6" />
                  <span className="font-semibold">Mon-Fri: 6AM - 10PM SAST</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-background border-2 border-border p-8">
              <h3 className="font-black text-2xl uppercase mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleSocialLink('instagram')}
                  className="w-12 h-12 bg-foreground text-primary flex items-center justify-center text-xl transition-all duration-300 hover:bg-primary hover:text-foreground"
                >
                  <Instagram className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleSocialLink('facebook')}
                  className="w-12 h-12 bg-foreground text-primary flex items-center justify-center text-xl transition-all duration-300 hover:bg-primary hover:text-foreground"
                >
                  <Facebook className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleSocialLink('youtube')}
                  className="w-12 h-12 bg-foreground text-primary flex items-center justify-center text-xl transition-all duration-300 hover:bg-primary hover:text-foreground"
                >
                  <Youtube className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleSocialLink('tiktok')}
                  className="w-12 h-12 bg-foreground text-primary flex items-center justify-center text-xl transition-all duration-300 hover:bg-primary hover:text-foreground"
                >
                  <SiTiktok className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
