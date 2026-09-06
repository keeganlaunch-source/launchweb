import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Smartphone, CreditCard, Users, Star, Zap, Trophy } from "lucide-react";

export default function SignupFlow() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Track signup flow page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'signup_flow_view',
        data: { 
          timestamp: new Date().toISOString(),
          source: 'website_cta',
          page: 'signup_flow'
        }
      })
    });
  }, []);

  const handleSignupRedirect = (planType: string) => {
    setIsRedirecting(true);
    
    // Track plan selection and redirect
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'signup_plan_selected',
        data: { 
          planType,
          timestamp: new Date().toISOString(),
          source: 'signup_flow'
        }
      })
    });

    // Redirect to Sudor signup with UTM parameters for tracking
    const utmParams = new URLSearchParams({
      utm_source: 'launchfit_website',
      utm_medium: 'cta_button',
      utm_campaign: 'signup_flow',
      utm_content: planType
    });
    
    window.location.href = `https://launch.gcph.tv/signup?${utmParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-2xl">LAUNCH</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Ready to Transform Your Fitness?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of success stories. Create your account, choose your plan, and start your journey today.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-300">1000+ success stories and counting</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-300">Start your workouts immediately</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Coaching</h3>
              <p className="text-gray-300">Personal guidance every step</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Basic Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white relative">
            <CardHeader>
              <CardTitle className="text-2xl">Basic Plan</CardTitle>
              <CardDescription className="text-gray-300">Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold text-yellow-400">
                R300
                <span className="text-lg text-gray-300">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Custom workout plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Mobile app access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Community access</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSignupRedirect('basic')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                disabled={isRedirecting}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Premium Monthly Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-yellow-400/50 text-white relative border-2">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-400 text-black font-semibold px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium Monthly</CardTitle>
              <CardDescription className="text-gray-300">Everything you need to succeed</CardDescription>
              <div className="text-4xl font-bold text-yellow-400">
                R450
                <span className="text-lg text-gray-300">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>1-on-1 coaching sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Nutrition planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSignupRedirect('premium_monthly')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                disabled={isRedirecting}
              >
                Start Premium
              </Button>
            </CardContent>
          </Card>

          {/* Premium Annual Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white relative">
            <div className="absolute -top-4 right-4">
              <Badge className="bg-green-500 text-white font-semibold px-3 py-1">
                Save R900
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium Annual</CardTitle>
              <CardDescription className="text-gray-300">Best value for serious athletes</CardDescription>
              <div className="text-4xl font-bold text-yellow-400">
                R4500
                <span className="text-lg text-gray-300">/year</span>
              </div>
              <p className="text-sm text-green-400">That's only R375/month!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>2 months free</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Exclusive content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Priority booking</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSignupRedirect('premium_annual')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                disabled={isRedirecting}
              >
                Start Annual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Simple 3-Step Process</CardTitle>
            <CardDescription className="text-gray-300">
              Get started in minutes with our streamlined signup process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-black" />
                </div>
                <h3 className="font-semibold">1. Choose Your Plan</h3>
                <p className="text-sm text-gray-300">Select the subscription that fits your goals</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="font-semibold">2. Create Account</h3>
                <p className="text-sm text-gray-300">Quick registration with your details</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-black" />
                </div>
                <h3 className="font-semibold">3. Download & Start</h3>
                <p className="text-sm text-gray-300">Get the app and begin your transformation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={() => handleSignupRedirect('general')}
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl px-12 py-4"
            disabled={isRedirecting}
          >
            <ExternalLink className="h-6 w-6 mr-2" />
            {isRedirecting ? 'Redirecting...' : 'Start Your Journey Now'}
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            You'll be redirected to launch.gcph.tv to complete your registration
          </p>
        </div>
      </div>
    </div>
  );
}