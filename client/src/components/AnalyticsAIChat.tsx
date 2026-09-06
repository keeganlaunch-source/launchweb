import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react";
import { format } from "date-fns";

interface RealtimeMetrics {
  activeUsers: number;
  todayStats: {
    pageViews: number;
    uniqueVisitors: number;
    newsletterSignups: number;
    contactForms: number;
    socialClicks: number;
    avgSessionDuration: number;
  };
  socialPlatforms: Array<{
    platform: string;
    visitors: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
  topCountries: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  fullFunnelMetrics: {
    websiteVisitors: number;
    newsletterSignups: number;
    contactInquiries: number;
    appDownloads: number;
    activeSubscribers: number;
    totalRevenue: number;
    lifetimeValue: number;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AnalyticsAIChatProps {
  metrics?: RealtimeMetrics;
}

export default function AnalyticsAIChat({ metrics }: AnalyticsAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm Launch AI, your analytics optimization assistant for Launch Lifestyle. I'm here to help you understand your fitness business metrics and suggest ways to improve your conversion rates, engagement, and revenue growth.

Based on your current data:
${metrics ? `
📊 **Today's Performance:**
• ${metrics.todayStats.pageViews} page views
• ${metrics.todayStats.newsletterSignups} newsletter signups  
• ${metrics.todayStats.contactForms} contact inquiries
• ${metrics.topCountries.length} countries represented

What would you like to know about your analytics or how to optimize them?` : 'Loading your metrics data...'}`,
      timestamp: new Date(),
      suggestions: [
        "How can I improve my conversion rate?",
        "What's my best performing traffic source?",
        "Tips to increase newsletter signups",
        "How to optimize for mobile users?"
      ]
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculateMetrics = (metrics?: RealtimeMetrics) => {
    if (!metrics) return {};
    
    const pageViews = metrics.todayStats.pageViews || 0;
    const newsletterSignups = metrics.todayStats.newsletterSignups || 0;
    const contactForms = metrics.todayStats.contactForms || 0;
    const socialClicks = metrics.todayStats.socialClicks || 0;
    
    return {
      conversionRate: pageViews > 0 ? (newsletterSignups / pageViews * 100) : 0,
      contactRate: pageViews > 0 ? (contactForms / pageViews * 100) : 0,
      socialCTR: pageViews > 0 ? (socialClicks / pageViews * 100) : 0,
      totalConversions: newsletterSignups + contactForms,
      overallConversionRate: pageViews > 0 ? ((newsletterSignups + contactForms) / pageViews * 100) : 0,
      engagementRate: pageViews > 0 ? ((socialClicks + newsletterSignups + contactForms) / pageViews * 100) : 0
    };
  };

  const formatCalculation = (label: string, numerator: number, denominator: number, percentage: number): string => {
    return `**${label}:**
• Calculation: ${numerator} ÷ ${denominator} × 100 = ${percentage.toFixed(2)}%
• Formula: (Conversions ÷ Total Visitors) × 100`;
  };

  const generateAnalyticsInsights = (userMessage: string, metrics?: RealtimeMetrics): string => {
    const message = userMessage.toLowerCase();
    const calc = calculateMetrics(metrics);
    
    if (message.includes('calculate') || message.includes('math') || message.includes('formula')) {
      return `🧮 **Analytics Calculations for Launch Lifestyle:**

**Current Metrics:**
• Page Views: ${metrics?.todayStats.pageViews || 0}
• Newsletter Signups: ${metrics?.todayStats.newsletterSignups || 0}
• Contact Forms: ${metrics?.todayStats.contactForms || 0}
• Social Clicks: ${metrics?.todayStats.socialClicks || 0}

**Calculated Rates:**
${formatCalculation('Newsletter Conversion Rate', metrics?.todayStats.newsletterSignups || 0, metrics?.todayStats.pageViews || 1, calc.conversionRate || 0)}

${formatCalculation('Contact Inquiry Rate', metrics?.todayStats.contactForms || 0, metrics?.todayStats.pageViews || 1, calc.contactRate || 0)}

${formatCalculation('Social Click-Through Rate', metrics?.todayStats.socialClicks || 0, metrics?.todayStats.pageViews || 1, calc.socialCTR || 0)}

**Overall Performance:**
• Total Conversions: ${calc.totalConversions}
• Overall Conversion Rate: ${calc.overallConversionRate?.toFixed(2)}%
• Engagement Rate: ${calc.engagementRate?.toFixed(2)}%

**Industry Benchmarks:**
• Fitness Newsletter Signup: 2-5% (You: ${calc.conversionRate?.toFixed(2)}%)
• Contact Form Conversion: 1-3% (You: ${calc.contactRate?.toFixed(2)}%)
• Social CTR: 1-2% (You: ${calc.socialCTR?.toFixed(2)}%)`;
    }

    if (message.includes('impressions') || message.includes('ctr') || message.includes('click')) {
      return `📊 **Click-Through Rate & Impressions Analysis:**

**Current Data:**
• Page Views (Impressions): ${metrics?.todayStats.pageViews || 0}
• Social Clicks: ${metrics?.todayStats.socialClicks || 0}
• CTR Calculation: ${metrics?.todayStats.socialClicks || 0} ÷ ${metrics?.todayStats.pageViews || 1} × 100 = ${calc.socialCTR?.toFixed(2)}%

**CTR Optimization Strategies:**
• **Compelling Headlines:** Use action words like "Transform Your Body in 30 Days"
• **Visual Content:** High-quality before/after transformation photos
• **Clear CTAs:** "Start Your Fitness Journey Today" vs generic "Click Here"
• **Social Proof:** "Join 1,000+ successful transformations"

**Expected Improvements:**
• Optimized headlines: +25-40% CTR improvement
• Better visuals: +30-50% engagement
• A/B tested CTAs: +15-25% conversion boost

**Calculation Formula:**
CTR = (Clicks ÷ Impressions) × 100
Industry Average: 1-2% for fitness content
Your Current: ${calc.socialCTR?.toFixed(2)}%`;
    }

    if (message.includes('roi') || message.includes('return') || message.includes('investment')) {
      const estimatedRevenue = (metrics?.todayStats.newsletterSignups || 0) * 29; // Assuming $29 avg value per signup
      const estimatedCost = (metrics?.todayStats.pageViews || 0) * 0.50; // Assuming $0.50 cost per visitor
      const roi = estimatedCost > 0 ? ((estimatedRevenue - estimatedCost) / estimatedCost * 100) : 0;

      return `💰 **ROI Calculations for Launch Lifestyle:**

**Revenue Calculation:**
• Newsletter Signups: ${metrics?.todayStats.newsletterSignups || 0}
• Estimated Value per Signup: $29 (fitness coaching average)
• Total Estimated Revenue: ${metrics?.todayStats.newsletterSignups || 0} × $29 = $${estimatedRevenue}

**Cost Calculation:**
• Page Views: ${metrics?.todayStats.pageViews || 0}
• Estimated Cost per Visitor: $0.50 (marketing spend)
• Total Estimated Cost: ${metrics?.todayStats.pageViews || 0} × $0.50 = $${estimatedCost.toFixed(2)}

**ROI Analysis:**
• Formula: (Revenue - Cost) ÷ Cost × 100
• Calculation: ($${estimatedRevenue} - $${estimatedCost.toFixed(2)}) ÷ $${estimatedCost.toFixed(2)} × 100 = ${roi.toFixed(2)}%

**Optimization Opportunities:**
• Increase signup value through premium offerings
• Reduce acquisition cost through organic content
• Improve conversion rates to maximize ROI
• Target high-intent keywords for better quality traffic`;
    }
    
    if (message.includes('conversion') || message.includes('rate')) {
      const conversionRate = metrics ? (metrics.todayStats.newsletterSignups / Math.max(metrics.todayStats.pageViews, 1) * 100) : 0;
      return `🎯 **Conversion Rate Analysis for Launch Lifestyle:**

Your current newsletter conversion rate is ${conversionRate.toFixed(2)}%. Here's how to optimize:

**Quick Wins:**
• Add exit-intent popups with exclusive workout content
• Create urgency with limited-time fitness challenges
• Use social proof testimonials from transformation success stories
• Optimize your CTA buttons with action words like "Start My Transformation"

**Advanced Strategies:**
• Implement progressive profiling in your forms
• A/B test different lead magnets (workout plans vs nutrition guides)
• Add WhatsApp quick signup option for South African audience
• Create location-specific landing pages for your top countries

**Expected Impact:** These changes typically increase conversion rates by 15-30% for fitness businesses.`;
    }

    if (message.includes('traffic') || message.includes('source')) {
      return `🚀 **Traffic Source Optimization for Launch Lifestyle:**

**Your Top Performing Channels:**
${metrics?.topCountries.map(country => `• ${country.country}: ${country.visitors} users (${country.percentage.toFixed(1)}%)`).join('\n') || '• Analyzing your traffic sources...'}

**Optimization Recommendations:**
• **Social Media Focus:** Invest more in Instagram and TikTok for fitness content
• **SEO Strategy:** Target "personal trainer South Africa" and "home workout plans"
• **Local Marketing:** Partner with Cape Town and Johannesburg fitness influencers
• **Content Marketing:** Create "Launch Transformation" success story videos

**Action Items:**
1. Increase posting frequency on your best-performing social platforms
2. Create location-specific content for your top countries
3. Use UTM tracking to measure campaign effectiveness
4. Consider Google Ads for high-intent fitness keywords`;
    }

    if (message.includes('newsletter') || message.includes('signup')) {
      return `📧 **Newsletter Signup Optimization:**

**Current Performance:** ${metrics?.todayStats.newsletterSignups || 0} signups today

**Proven Tactics for Fitness Businesses:**
• **Lead Magnets:** "7-Day Launch Transformation Challenge" PDF
• **Timing:** Exit-intent popups when users spend 2+ minutes on page
• **Value Proposition:** "Get Coach Keegs' exclusive workout plans and nutrition tips"
• **Social Proof:** "Join 1,000+ fitness enthusiasts transforming their lives"

**Technical Optimizations:**
• Reduce form fields to just email initially
• Add one-click social login options
• Mobile-optimize signup forms (70%+ of fitness traffic is mobile)
• Send immediate welcome email with first workout

**Expected Results:** 25-40% increase in newsletter signups within 30 days.`;
    }

    if (message.includes('mobile') || message.includes('optimize')) {
      return `📱 **Mobile Optimization for Launch Lifestyle:**

**Why Mobile Matters for Fitness:**
• 75% of fitness content is consumed on mobile
• Users check workout plans on-the-go
• Quick access to nutrition tracking

**Key Optimizations:**
• **Loading Speed:** Compress images, optimize for 3G networks
• **Touch-Friendly:** Large buttons, easy scrolling
• **WhatsApp Integration:** Direct contact for South African market
• **Progressive Web App:** Add "Add to Home Screen" feature

**Fitness-Specific Mobile Features:**
• Workout video controls optimized for portrait mode
• Quick screenshot sharing for meal plans
• One-tap social sharing for transformation photos
• Voice search for exercise instructions

**Implementation Priority:**
1. Speed optimization (biggest impact)
2. WhatsApp widget for instant queries
3. Mobile-first form design
4. Social sharing buttons`;
    }

    if (message.includes('revenue') || message.includes('money') || message.includes('income')) {
      return `💰 **Revenue Growth Strategy for Launch Lifestyle:**

**Current Funnel Analysis:**
• Website Visitors: ${metrics?.todayStats.pageViews || 0}
• Newsletter Signups: ${metrics?.todayStats.newsletterSignups || 0}
• Contact Inquiries: ${metrics?.todayStats.contactForms || 0}

**Revenue Optimization Plan:**
• **Premium Content:** Launch exclusive workout programs ($29-49/month)
• **1-on-1 Coaching:** High-value personal training packages ($200-500/month)
• **Group Challenges:** Monthly transformation challenges ($19/month)
• **Affiliate Marketing:** Fitness equipment and supplement partnerships

**Pricing Strategy:**
• Free: Basic workout plans and tips
• Premium ($29/month): Personalized plans + nutrition guidance
• VIP ($99/month): 1-on-1 coaching + meal plans + WhatsApp support

**Launch Timeline:**
1. Week 1-2: Create premium content library
2. Week 3: Launch membership tiers
3. Week 4: Implement payment processing
4. Month 2: Scale marketing to drive subscriptions`;
    }

    // Default response with general analytics insights
    return `🎯 **Analytics Insights for Launch Lifestyle:**

I can help you optimize several key areas:

**📊 Current Focus Areas:**
• **Conversion Optimization:** Improve signup rates and engagement
• **Traffic Growth:** Scale your reach across South Africa and globally  
• **Revenue Generation:** Monetize your fitness expertise
• **User Experience:** Optimize for mobile and social platforms

**🚀 Quick Wins Available:**
• Add exit-intent popups to capture leaving visitors
• Optimize your WhatsApp integration for instant queries
• Create urgency with limited-time fitness challenges
• Implement social proof with transformation testimonials

**📈 Advanced Strategies:**
• A/B test different lead magnets and CTAs
• Segment users by fitness goals and location
• Create personalized workout recommendation engines
• Build automated email sequences for new subscribers

Ask me about any specific area you'd like to dive deeper into!`;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAnalyticsInsights(currentMessage, metrics),
        timestamp: new Date(),
        suggestions: [
          "How can I increase engagement?",
          "Best times to post content?",
          "ROI tracking strategies",
          "Competitor analysis tips"
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {format(message.timestamp, 'HH:mm')}
                  </div>
                </div>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-4 rounded-lg max-w-3xl">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your analytics, optimization tips, or growth strategies..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !currentMessage.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Calculate all conversion rates and CTR")}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Calculate Metrics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Show ROI calculations and revenue analysis")}
          >
            <Target className="w-3 h-3 mr-1" />
            ROI Calculator
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Analyze impressions vs clicks and CTR optimization")}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            CTR Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Compare my metrics to industry benchmarks")}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Benchmarks
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Conversion funnel optimization")}
          >
            Funnel Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Revenue growth strategies")}
          >
            Revenue Growth
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleSuggestionClick("Marketing optimization tips")}
          >
            Marketing Tips
          </Button>
        </div>
      </div>
    </div>
  );
}