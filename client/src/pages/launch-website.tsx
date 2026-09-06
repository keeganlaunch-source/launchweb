import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Trophy, Users, Smartphone, BarChart3, Target, ArrowRight, Play, MessageSquare } from "lucide-react";
import { CTAButton } from "@/components/cta-button";

export default function LaunchWebsite() {
  const [stats, setStats] = useState({
    activeUsers: 2,
    totalSignups: 1847,
    successStories: 1200,
    averageResults: "15lbs"
  });

  useEffect(() => {
    // Track page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        data: { 
          page: 'launch_website',
          timestamp: new Date().toISOString()
        }
      })
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold">LAUNCH</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
          <a href="#stories" className="hover:text-yellow-400 transition-colors">Stories</a>
          <a href="#pricing" className="hover:text-yellow-400 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
        </div>
        <CTAButton variant="outline" size="sm">
          Start Now
        </CTAButton>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/50 mb-6">
            🔥 {stats.activeUsers} people are transforming right now
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
            Transform Your Body,
            <br />
            Transform Your Life
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join {stats.totalSignups.toLocaleString()}+ members who've already started their fitness journey with personalized coaching, custom workouts, and proven results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <CTAButton variant="primary" size="lg" className="px-12 py-4 text-xl">
              <Zap className="h-6 w-6 mr-2" />
              Start Free Trial
            </CTAButton>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Play className="h-5 w-5 mr-2" />
              Watch Success Stories
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.successStories.toLocaleString()}+</div>
              <div className="text-gray-400">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.averageResults}</div>
              <div className="text-gray-400">Average Weight Loss</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">4.9★</div>
              <div className="text-gray-400">App Store Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Comprehensive fitness solution with personalized coaching and real-time analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <Target className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personalized Plans</h3>
              <p className="text-gray-300">Custom workout and nutrition plans tailored to your goals, fitness level, and lifestyle.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">1-on-1 Coaching</h3>
              <p className="text-gray-300">Direct access to certified trainers and nutrition experts for personalized guidance.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <BarChart3 className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-300">Advanced analytics to monitor your progress and optimize your results.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <Smartphone className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="text-gray-300">Access your workouts, nutrition plans, and coaching anywhere, anytime.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <MessageSquare className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-gray-300">Join a supportive community of like-minded individuals on similar journeys.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:border-yellow-400/50 transition-all">
            <CardContent className="p-6">
              <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-300">Join thousands who've achieved their fitness goals with our proven methodology.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-300 text-xl">Start your transformation today with our flexible pricing options</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
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
              <CTAButton variant="outline" className="w-full">
                Get Started
              </CTAButton>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-yellow-400/50 text-white border-2 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-400 text-black font-semibold px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium Plan</CardTitle>
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
              <CTAButton variant="primary" className="w-full">
                Start Premium
              </CTAButton>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
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
              <CTAButton variant="secondary" className="w-full">
                Start Annual
              </CTAButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who've already started their journey. Create your account, choose your plan, and begin transforming your life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton variant="primary" size="lg" className="px-12 py-4 text-xl">
              <ArrowRight className="h-6 w-6 mr-2" />
              Start Your Journey Now
            </CTAButton>
            <p className="text-sm text-gray-400">
              No commitment • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
              <span className="text-lg font-bold">LAUNCH</span>
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/10 text-gray-400">
            <p>&copy; 2025 Launch Lifestyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}