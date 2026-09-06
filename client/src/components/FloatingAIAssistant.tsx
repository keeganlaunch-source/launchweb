import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2, Calculator, TrendingUp, Target } from "lucide-react";
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
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface FloatingAIAssistantProps {
  metrics?: RealtimeMetrics;
}

export default function FloatingAIAssistant({ metrics }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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

  const generateAnalyticsInsights = (userMessage: string, metrics?: RealtimeMetrics): string => {
    const message = userMessage.toLowerCase();
    const calc = calculateMetrics(metrics);
    
    if (message.includes('calculate') || message.includes('metrics') || message.includes('quick')) {
      return `📊 **Quick Metrics Summary:**

**Today's Performance:**
• Page Views: ${metrics?.todayStats.pageViews || 0}
• Newsletter Signups: ${metrics?.todayStats.newsletterSignups || 0} (${calc.conversionRate?.toFixed(2)}%)
• Contact Forms: ${metrics?.todayStats.contactForms || 0} (${calc.contactRate?.toFixed(2)}%)
• Social Clicks: ${metrics?.todayStats.socialClicks || 0} (${calc.socialCTR?.toFixed(2)}%)

**Key Calculations:**
• Total Conversions: ${calc.totalConversions}
• Overall Conversion Rate: ${calc.overallConversionRate?.toFixed(2)}%
• Engagement Rate: ${calc.engagementRate?.toFixed(2)}%

**vs Industry Benchmarks:**
• Newsletter Signup: 2-5% (You: ${calc.conversionRate?.toFixed(2)}%)
• Contact Rate: 1-3% (You: ${calc.contactRate?.toFixed(2)}%)
• Social CTR: 1-2% (You: ${calc.socialCTR?.toFixed(2)}%)`;
    }

    if (message.includes('ctr') || message.includes('click') || message.includes('impression')) {
      return `📈 **CTR Analysis:**

• Impressions (Page Views): ${metrics?.todayStats.pageViews || 0}
• Clicks: ${metrics?.todayStats.socialClicks || 0}
• CTR: ${calc.socialCTR?.toFixed(2)}%
• Formula: ${metrics?.todayStats.socialClicks || 0} ÷ ${metrics?.todayStats.pageViews || 1} × 100

**Quick Optimizations:**
• Use action-oriented CTAs: "Start Your Transformation"
• Add urgency: "Limited spots available"
• Include social proof: "Join 1,000+ members"`;
    }

    if (message.includes('roi') || message.includes('revenue')) {
      return `📊 **ROI Analysis Requires Verified Financial Data:**

ROI calculation needs your actual:
• Advertising spend amounts
• Customer lifetime value data
• Revenue per conversion

Please provide these verified figures for accurate ROI calculations. I cannot estimate or use placeholder values for financial analysis.`;

    }

    return `Hi! I'm Launch AI, your analytics assistant.

Verified data from your sources:
• ${metrics?.todayStats.pageViews || 0} page views today
• ${metrics?.todayStats.newsletterSignups || 0} newsletter signups
• ${metrics?.todayStats.contactForms || 0} contact forms
• ${metrics?.topCountries?.length || 0} countries reached

I can calculate CTR, conversion rates, and other metrics using only your authentic data. Ask me for specific calculations.`;
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

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAnalyticsInsights(currentMessage, metrics),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    if (!isOpen) setIsOpen(true);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: generateAnalyticsInsights('welcome', metrics),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <>
      {/* Floating Launch AI Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={openChat}
            className="h-12 px-4 rounded-xl bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 border border-gray-300"
          >
            <img 
              src="/attached_assets/Untitled design_1749409794715.png" 
              alt="Launch Logo" 
              className="w-7 h-7 object-contain"
            />
            <div className="bg-white px-2 py-1 rounded h-7 flex items-center">
              <span className="text-black font-black text-base">AI</span>
            </div>
          </Button>
        </div>
      )}



      {/* Compact Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 h-96'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img 
                  src="/attached_assets/Untitled design_1749409794715.png" 
                  alt="Launch Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Launch AI</h3>
                <p className="text-xs text-gray-500">Launch Lifestyle Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-56 overflow-y-auto p-3 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {format(message.timestamp, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about metrics, CTR, ROI..."
                    className="flex-1 text-sm"
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
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}