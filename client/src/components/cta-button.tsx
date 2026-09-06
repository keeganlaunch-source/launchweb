import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CTAButton({ 
  variant = "primary", 
  size = "md", 
  children, 
  className,
  onClick
}: CTAButtonProps) {
  
  const handleClick = () => {
    // Track CTA click before redirect
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'cta_click',
        data: { 
          buttonText: typeof children === 'string' ? children : 'CTA Button',
          timestamp: new Date().toISOString(),
          variant,
          size
        }
      })
    });

    if (onClick) {
      onClick();
    } else {
      // Keep users on your domain with embedded signup
      window.location.href = '/signup';
    }
  };

  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl",
    secondary: "bg-white hover:bg-gray-100 text-black border-2 border-yellow-400",
    outline: "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Button>
  );
}