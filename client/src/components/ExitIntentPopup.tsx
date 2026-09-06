import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [hasTriggered, setHasTriggered] = useState(false);
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiRequest("POST", "/api/newsletter", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your free guide is on the way! Check your email.",
      });
      setIsVisible(false);
      localStorage.setItem('exit-popup-converted', 'true');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    // Check if user already converted or dismissed
    const hasConverted = localStorage.getItem('exit-popup-converted');
    const hasDismissed = localStorage.getItem('exit-popup-dismissed');
    
    if (hasConverted || hasDismissed) return;

    // Track mouse movements to detect exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving toward top of screen (exit intent)
      if (e.clientY <= 5 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    // Also trigger after 30 seconds of browsing as backup
    const timeoutId = setTimeout(() => {
      if (!hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasTriggered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    newsletterMutation.mutate({ email });
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exit-popup-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg border-2 border-primary relative animate-pulse-subtle">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full">
              <Gift className="w-8 h-8 text-black" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black uppercase">Wait! Don't Leave Empty-Handed</h2>
          
          <p className="text-gray-600">
            Get our <strong>FREE Top 5 Consistency Hacks</strong> that keep 1000+ members achieving their fitness goals daily.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email for instant access"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
              required
              disabled={newsletterMutation.isPending}
            />
            
            <button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="w-full bg-primary text-black py-3 font-bold uppercase tracking-wide rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {newsletterMutation.isPending ? "Sending..." : "Get My FREE Guide"}
            </button>
          </form>

          <div className="text-xs text-gray-500">
            <p>✓ Instant download • ✓ No spam • ✓ Unsubscribe anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}