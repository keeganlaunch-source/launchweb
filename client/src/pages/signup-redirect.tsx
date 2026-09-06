import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Smartphone, CreditCard, Users } from "lucide-react";

export default function SignupRedirect() {
  const [countdown, setCountdown] = useState(5);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Track signup redirect event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'signup_redirect_view',
        data: { 
          timestamp: new Date().toISOString(),
          source: 'website_cta',
          destination: 'sudor_signup'
        }
      })
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && !hasRedirected) {
          setHasRedirected(true);
          // Track redirect event
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'signup_redirect_executed',
              data: { 
                timestamp: new Date().toISOString(),
                source: 'auto_redirect'
              }
            })
          });
          window.location.href = 'https://launch.gcph.tv/signup';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasRedirected]);

  const handleManualRedirect = () => {
    if (!hasRedirected) {
      setHasRedirected(true);
      // Track manual redirect
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'signup_redirect_executed',
          data: { 
            timestamp: new Date().toISOString(),
            source: 'manual_click'
          }
        })
      });
      window.location.href = 'https://launch.gcph.tv/signup';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">LAUNCH</span>
          </div>
          <CardTitle className="text-3xl font-bold">Get Started with Launch</CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            You're being redirected to create your account and choose your plan
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-2">{countdown}</div>
            <p className="text-gray-300">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                What happens next:
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-yellow-400" />
                  Choose your subscription plan
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-yellow-400" />
                  Create your Launch account
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-yellow-400" />
                  Download the mobile app
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                  Start your fitness journey
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-yellow-400">Available Plans:</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-between border-yellow-400/50 text-yellow-400">
                  Basic Plan <span>R300/month</span>
                </Badge>
                <Badge variant="outline" className="w-full justify-between border-yellow-400/50 text-yellow-400">
                  Premium Monthly <span>R450/month</span>
                </Badge>
                <Badge variant="outline" className="w-full justify-between border-yellow-400/50 text-yellow-400">
                  Premium Annual <span>R4500/year</span>
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={handleManualRedirect}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3"
              disabled={hasRedirected}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Continue to Signup Now
            </Button>
            
            <p className="text-xs text-gray-400">
              You'll be redirected to launch.gcph.tv to complete your registration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}