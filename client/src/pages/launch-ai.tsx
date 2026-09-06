import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Sparkles, Target, Heart, Zap, Trophy, Users, BarChart3, MessageSquare, ArrowLeft } from 'lucide-react';
import LaunchAI from '@/components/LaunchAI';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface AIAnalytics {
  totalChats: number;
  todayChats: number;
  weeklyChats: number;
  topQuestions: Array<{ question: string; count: number }>;
  questionCategories: Array<{ category: string; count: number }>;
  averageResponseTime: number;
  averageRating: number;
  recentChats: any[];
}

export default function LaunchAIPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Fetch AI analytics data
  const { data: aiAnalytics } = useQuery<AIAnalytics>({
    queryKey: ['/api/ai/analytics'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Workout Plans",
      description: "AI-generated fitness routines tailored to your goals, experience level, and available equipment.",
      category: "fitness"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Nutrition Guidance",
      description: "Smart meal planning and nutrition advice based on your fitness objectives and dietary preferences.",
      category: "nutrition"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Motivation & Mindset",
      description: "Personalized motivational coaching to keep you consistent and focused on your journey.",
      category: "motivation"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Advanced analytics and insights to monitor your fitness progress and celebrate achievements.",
      category: "progress"
    }
  ];

  const demoQuestions = [
    {
      category: "fitness",
      question: "Create a 4-week workout plan for building muscle at home",
      preview: "I'll create a comprehensive 4-week muscle-building program that you can do at home..."
    },
    {
      category: "nutrition",
      question: "What should I eat to support my fitness goals?",
      preview: "Based on your goals, here's a nutrition strategy that will fuel your workouts..."
    },
    {
      category: "motivation",
      question: "I'm struggling to stay consistent with my workouts",
      preview: "Consistency is the key to success. Let me share some proven strategies..."
    },
    {
      category: "progress",
      question: "How do I track my fitness progress effectively?",
      preview: "Effective progress tracking involves multiple metrics beyond just weight..."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b-2 border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-grunge uppercase tracking-tight text-foreground font-black">
                    <span className="inline-block bg-primary text-black px-2 py-1 transform -rotate-2 rounded">LAUNCH</span> AI
                  </h1>
                  <p className="text-muted-foreground font-semibold">Your Personal Fitness Coach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-background border-2 border-border">
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold uppercase">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold uppercase">
              <Sparkles className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold uppercase">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chat Interface */}
              <div className="lg:col-span-2">
                <LaunchAI 
                  key={selectedQuestion || 'default'} 
                  initialQuestion={selectedQuestion || undefined} 
                />
              </div>

              {/* Demo Questions Sidebar */}
              <div className="space-y-4">
                <Card className="bg-black border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚀</span>
                      <CardTitle className="text-white">Launch These Questions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {demoQuestions.map((demo, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-primary text-black hover:bg-primary/90 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-white/20"
                        onClick={() => {
                          setSelectedQuestion(demo.question);
                          // Also trigger floating Launch AI
                          window.dispatchEvent(new CustomEvent('openLaunchAI', { 
                            detail: { question: demo.question } 
                          }));
                        }}
                      >
                        <p className="text-sm font-bold mb-1">🚀 {demo.question}</p>
                        <Badge variant="outline" className="text-xs border-black/30 text-black font-semibold uppercase bg-white/20">
                          {demo.category}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-background border-2 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Coach Keegs' Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Launch AI is powered by Coach Keegs' extensive fitness knowledge and proven methodologies. 
                      Get personalized advice that combines AI intelligence with real coaching experience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-background border-2 border-border hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-foreground">{feature.title}</CardTitle>
                        <Badge variant="outline" className="border-primary/30 text-primary text-xs font-semibold uppercase">
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-2 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-lg">
                    <Sparkles className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Powered by Advanced AI</h3>
                    <p className="text-muted-foreground">
                      Launch AI uses cutting-edge natural language processing to understand your unique needs 
                      and provide personalized fitness guidance that adapts to your progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Total Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {aiAnalytics?.totalChats || 0}
                  </div>
                  <p className="text-sm text-gray-400">All time conversations</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Today's Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {aiAnalytics?.todayChats || 0}
                  </div>
                  <p className="text-sm text-gray-400">Conversations today</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {aiAnalytics?.averageRating ? `${aiAnalytics.averageRating.toFixed(1)}⭐` : 'N/A'}
                  </div>
                  <p className="text-sm text-gray-400">User satisfaction</p>
                </CardContent>
              </Card>
            </div>

            {aiAnalytics?.questionCategories && (
              <Card className="bg-gray-900 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiAnalytics.questionCategories.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white capitalize">{category.category}</span>
                        <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-yellow-400">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Response Time</span>
                  <span className="text-white font-mono">
                    {aiAnalytics?.averageResponseTime ? `${aiAnalytics.averageResponseTime}ms` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Weekly Growth</span>
                  <span className="text-white">
                    {aiAnalytics?.weeklyChats || 0} chats
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">AI Model</span>
                  <span className="text-yellow-400">GPT-4o</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}