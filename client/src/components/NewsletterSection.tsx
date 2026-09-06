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
      trackNewsletterSignup('newsletter_section');
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
    <section id="newsletter" className="py-24 px-6 lg:px-12 bg-card">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-10">
          <h2 className="font-heading text-4xl lg:text-6xl uppercase tracking-tight mb-4">
            Get Your <span className="text-primary">Free</span> Top 5 Consistency Hacks
          </h2>
          <p className="text-lg text-muted-foreground">
            The exact blueprint Coach Keegs uses to keep clients consistent every day.
          </p>
        </div>

        <form onSubmit={handleNewsletterSignup} className="max-w-lg mx-auto">
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email for instant access..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
              required
              disabled={newsletterMutation.isPending}
            />
            <button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="w-full bg-primary text-primary-foreground px-8 py-4 font-heading text-xl uppercase tracking-wide transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {newsletterMutation.isPending ? "Sending..." : "Get Free Guide Now"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            No spam. Unsubscribe anytime. Your email is safe with us.
          </p>
        </form>

        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
