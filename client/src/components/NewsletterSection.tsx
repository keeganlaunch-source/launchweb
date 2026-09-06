import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { trackNewsletterSignup } from "../lib/firebase";
import { trackNewsletterSignup as trackMetaNewsletterSignup, trackLead } from "../lib/meta-pixel";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiRequest("POST", "/api/newsletter", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Track in Firebase Analytics
      trackNewsletterSignup('newsletter_section');
      // Track in Meta Pixel for advertising attribution
      trackMetaNewsletterSignup();
      trackLead();
      
      toast({
        title: "Success!",
        description: data.message,
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe to newsletter",
        variant: "destructive",
      });
    }
  });

  const benefits = [
    "Weekly workout tips",
    "Nutrition advice", 
    "Exclusive discounts",
    "No spam, ever"
  ];

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    newsletterMutation.mutate({ email });
  };

  return (
    <section id="newsletter" className="py-20 px-4 lg:px-8 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Newsletter Header - Optimized with urgency and value */}
        <div className="mb-12">
          <h2 className="font-grunge text-4xl lg:text-5xl uppercase tracking-tight mb-4">
            Get Your <span className="text-primary">FREE</span> Top 5 Consistency Hacks
          </h2>
          <p className="text-xl mb-4">
            The exact blueprint that keeps 1000+ Launch members consistent every day
          </p>
          <div className="inline-block bg-primary text-black px-4 py-2 font-bold uppercase text-sm">
            🔥 Limited Time: Instant Download
          </div>
        </div>

        {/* Newsletter Form - Single field, larger, more compelling */}
        <form onSubmit={handleNewsletterSignup} className="max-w-lg mx-auto">
          <div className="flex flex-col gap-3">
            <input 
              type="email"
              placeholder="Your email for instant access..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 border-2 border-primary bg-background text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-lg text-center"
              required
              disabled={newsletterMutation.isPending}
            />
            <button 
              type="submit"
              disabled={newsletterMutation.isPending}
              className="w-full bg-primary text-primary-foreground px-8 py-5 font-black uppercase tracking-wide border-2 border-border transition-all duration-300 hero-shadow text-xl hover:scale-105 disabled:opacity-50"
            >
              {newsletterMutation.isPending ? "Sending..." : "Get FREE Guide Now →"}
            </button>
          </div>
          
          {/* Social proof and trust */}
          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-gray-300">✓ 1000+ members already downloaded</p>
            <p className="text-xs text-gray-400">No spam. Unsubscribe anytime. Your email is safe with us.</p>
          </div>
        </form>

        {/* Newsletter Benefits */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
