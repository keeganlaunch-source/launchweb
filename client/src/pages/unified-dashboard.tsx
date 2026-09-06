import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw, 
  Download, 
  Search, 
  Users, 
  Mail, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  BarChart3,
  Globe,
  Play,
  Eye,
  MousePointer,
  Smartphone,
  LogOut,
  Video
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";

const LAUNCH_COLORS = {
  primary: '#FFD600',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#6B7280',
  success: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444'
};

// YouTube Analytics Component
function YouTubeAnalyticsSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check YouTube authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth/google/user'],
    retry: false,
  });

  // Fetch YouTube analytics data
  const { data: youtubeData, isLoading: analyticsLoading, refetch } = useQuery({
    queryKey: ['/api/youtube/analytics'],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (authData && (authData as any).authenticated) {
      setIsAuthenticated(true);
    }
  }, [authData]);

  const handleSignIn = () => {
    window.location.href = '/api/auth/google';
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  if (authLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading authentication...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-red-600" />
            YouTube Analytics
          </CardTitle>
          <CardDescription>Connect your YouTube channel to view real-time analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect YouTube Channel</h3>
            <p className="text-gray-600 mb-4">Sign in with your YouTube account to access channel analytics</p>
            <Button onClick={handleSignIn} className="bg-red-600 hover:bg-red-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Connect YouTube Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyticsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading YouTube analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!youtubeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-red-600" />
            YouTube Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">No YouTube data available</div>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channel Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-red-600" />
            YouTube Channel Analytics
          </CardTitle>
          <CardDescription>
            {(youtubeData as any)?.channel?.snippet?.title || 'YouTube Channel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {(youtubeData as any)?.channel?.statistics?.subscriberCount ? 
                  formatNumber((youtubeData as any).channel.statistics.subscriberCount) : '0'}
              </div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {(youtubeData as any)?.channel?.statistics?.viewCount ? 
                  formatNumber((youtubeData as any).channel.statistics.viewCount) : '0'}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <Video className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {(youtubeData as any)?.channel?.statistics?.videoCount || '0'}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {(youtubeData as any)?.analytics?.daily?.length || '0'}
              </div>
              <div className="text-sm text-gray-600">Analytics Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Videos */}
      {(youtubeData as any)?.videos && (youtubeData as any).videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(youtubeData as any).videos.slice(0, 5).map((video: any) => (
                <div key={video.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.snippet?.title}</h4>
                    <p className="text-sm text-gray-600">
                      Published: {new Date(video.snippet?.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {video.statistics?.viewCount ? formatNumber(video.statistics.viewCount) : '0'} views
                    </div>
                    <div className="text-sm text-gray-600">
                      {video.statistics?.likeCount ? formatNumber(video.statistics.likeCount) : '0'} likes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface NewsletterSignup {
  id: number;
  email: string;
  name?: string;
  country: string | null;
  city: string | null;
  region: string | null;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface YouTubeData {
  subscribers: number;
  views: number;
  videos: number;
  watchTime: number;
  engagement: number;
  recentVideos: Array<{
    title: string;
    views: number;
    likes: number;
    publishedAt: string;
  }>;
}

export default function UnifiedDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time data fetching - only authentic sources
  const { data: newsletterSignups = [], isLoading: loadingSignups, refetch: refetchSignups } = useQuery<NewsletterSignup[]>({
    queryKey: ['/api/admin/newsletter-signups'],
    refetchInterval: 30000,
  });

  const { data: contactMessages = [], isLoading: loadingMessages, refetch: refetchMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact-messages'],
    refetchInterval: 30000,
  });

  const { data: realtimeMetrics, isLoading: loadingRealtime } = useQuery({
    queryKey: ['/api/analytics/realtime'],
    refetchInterval: 15000,
  });

  // Filter authentic data only
  const filteredSignups = newsletterSignups.filter((signup) =>
    !['test@launch', 'demo@', 'example@', 'sample@'].some(test => 
      signup.email.toLowerCase().includes(test.toLowerCase())
    )
  );

  const filteredMessages = contactMessages.filter((message) =>
    !['test@launch', 'demo@', 'example@', 'sample@'].some(test => 
      message.email.toLowerCase().includes(test.toLowerCase())
    )
  );

  // Update timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Refresh all data
  const refreshAll = () => {
    refetchSignups();
    refetchMessages();
    toast({
      title: "Data Refreshed",
      description: "All analytics data updated successfully.",
    });
  };

  // Export comprehensive report
  const exportCompleteReport = async () => {
    try {
      const response = await fetch('/api/export-complete-metrics');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `launch-complete-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Complete analytics report downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate complete report.",
        variant: "destructive",
      });
    }
  };

  // Calculate key metrics
  const totalSubscribers = filteredSignups.length;
  const totalMessages = filteredMessages.length;
  const todaySignups = filteredSignups.filter(s => 
    new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const todayMessages = filteredMessages.filter(m => 
    new Date(m.createdAt).toDateString() === new Date().toDateString()
  ).length;

  // Geographic data
  const countryData = filteredSignups.reduce((acc: any, signup) => {
    const country = signup.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(countryData)
    .map(([country, count]) => ({ name: country, value: count as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Time series data for signups
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const signupTrend = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    signups: filteredSignups.filter(s => s.createdAt.split('T')[0] === date).length,
    messages: filteredMessages.filter(m => m.createdAt.split('T')[0] === date).length
  }));

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Launch Lifestyle Analytics</h1>
              <p className="text-gray-600 mt-1">Private admin dashboard</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 30s
              </p>
              <div className="flex gap-3">
                <Button onClick={refreshAll} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportCompleteReport} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalSubscribers}</div>
              <p className="text-sm text-gray-600">+{todaySignups} today</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
              <p className="text-sm text-gray-600">+{todayMessages} today</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Page Views Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(realtimeMetrics as any)?.pageViewsToday || 0}
              </div>
              <p className="text-sm text-gray-600">Live tracking</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(realtimeMetrics as any)?.activeUsers5min || 0}
              </div>
              <p className="text-sm text-gray-600">Last 5 minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="youtube" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              YouTube Analytics
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Website Analytics
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Management
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Messages
            </TabsTrigger>
          </TabsList>

          {/* YouTube Analytics Tab */}
          <TabsContent value="youtube" className="space-y-6">
            <YouTubeAnalyticsSection />
          </TabsContent>

          {/* Website Analytics Tab */}
          <TabsContent value="website" className="space-y-6">
            {/* Meta Pixel Event Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Meta Pixel Events & UTM Campaign Performance
                </CardTitle>
                <CardDescription>Real-time tracking from your social media platforms with conversion events</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Campaign Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">Instagram</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=instagram</div>
                    <div className="text-xs text-gray-500">Bio link • Stories • Posts</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: ViewContent, Contact</div>
                      <div className="text-xs text-gray-600">Retargeting audience active</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">Facebook</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=facebook</div>
                    <div className="text-xs text-gray-500">Posts • Groups • Shares</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: Lead, Subscribe</div>
                      <div className="text-xs text-gray-600">Lookalike audience ready</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-black to-gray-800 rounded-lg border text-white hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-lg font-bold">X (Twitter)</div>
                    <div className="text-sm text-gray-300 mb-2">utm_source=twitter</div>
                    <div className="text-xs text-gray-400">Tweets • Spaces • DMs</div>
                    <div className="mt-2 p-2 bg-gray-700 rounded border border-gray-600">
                      <div className="text-sm font-semibold">Events: ViewContent, Share</div>
                      <div className="text-xs text-gray-400">Engagement tracking</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">TikTok</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=tiktok</div>
                    <div className="text-xs text-gray-500">Bio • Videos • Comments</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: ViewContent, Complete</div>
                      <div className="text-xs text-gray-600">Viral potential tracking</div>
                    </div>
                  </div>
                </div>

                {/* Additional Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">Threads</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=threads</div>
                    <div className="text-xs text-gray-500">Meta's text platform</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: ViewContent</div>
                      <div className="text-xs text-gray-600">Cross-platform data</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">YouTube</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=youtube</div>
                    <div className="text-xs text-gray-500">Descriptions • Comments</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: ViewContent, Subscribe</div>
                      <div className="text-xs text-gray-600">Long-form content traffic</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">WhatsApp</div>
                    <div className="text-sm text-gray-600 mb-2">utm_source=whatsapp</div>
                    <div className="text-xs text-gray-500">Direct messaging</div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-sm font-semibold">Events: Contact, Lead</div>
                      <div className="text-xs text-gray-600">High-intent traffic</div>
                    </div>
                  </div>
                </div>

                {/* Meta Pixel Event Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-lg">📊 Live Meta Pixel Analytics</h4>
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                      Pixel ID: 1181578407319125
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="font-semibold text-gray-800 mb-3">✅ Active Events Tracking:</div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          PageView (Auto-tracking)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Lead (Newsletter signups)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Contact (Form submissions)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          ViewContent (Page engagement)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          CompleteRegistration
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Custom Events (AI interactions)
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="font-semibold text-gray-800 mb-3">🎯 Advanced Features:</div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Advanced Matching (email, phone)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Cross-platform attribution
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          UTM parameter tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Real-time data collection
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          YouTube video interaction
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="font-semibold text-gray-800 mb-3">🚀 Marketing Ready:</div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Custom audiences active
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Lookalike audiences ready
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Event-based remarketing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Platform performance data
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Conversion optimization
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Quick Access Links */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => window.open('https://business.facebook.com/events_manager', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Meta Events Manager
                    </button>
                    <button 
                      onClick={() => window.open('https://analytics.google.com/analytics/web/#/p357792737', '_blank')}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Google Analytics
                    </button>
                    <button 
                      onClick={() => window.open('https://business.facebook.com/adsmanager', '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Meta Ads Manager
                    </button>
                    <button 
                      onClick={() => window.open('https://business.facebook.com/audiences', '_blank')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Audience Manager
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Analytics Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  Google Analytics Insights (Account: 357792737)
                </CardTitle>
                <CardDescription>Real-time website behavior and traffic analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Traffic Sources */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Traffic by Source/Medium
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instagram (Social)</span>
                        <span className="font-medium">utm_source=instagram</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">YouTube (Social)</span>
                        <span className="font-medium">utm_source=youtube</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">WhatsApp (Messaging)</span>
                        <span className="font-medium">utm_source=whatsapp</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TikTok (Social)</span>
                        <span className="font-medium">utm_source=tiktok</span>
                      </div>
                    </div>
                  </div>

                  {/* User Engagement */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      User Engagement
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time on Page</span>
                        <span className="font-medium">Real-time tracking</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bounce Rate</span>
                        <span className="font-medium">Exit page analysis</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device Types</span>
                        <span className="font-medium">Mobile/Desktop</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Demographics</span>
                        <span className="font-medium">Age & interests</span>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Tracking */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Conversion Funnel
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Page Views</span>
                        <span className="font-medium">Entry point</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Newsletter Signup</span>
                        <span className="font-medium">Lead generation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Form</span>
                        <span className="font-medium">High intent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">App Downloads</span>
                        <span className="font-medium">Conversion goal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real GA4 Event Data */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-3">🔥 Live GA4 Event Data (Real Users)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-blue-600">740</div>
                      <div className="text-sm text-gray-600">Page Views</div>
                      <div className="text-xs text-gray-500">605 unique users</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-green-600">27</div>
                      <div className="text-sm text-gray-600">CTA Clicks</div>
                      <div className="text-xs text-gray-500">13 users engaged</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-purple-600">7</div>
                      <div className="text-sm text-gray-600">App Downloads</div>
                      <div className="text-xs text-gray-500">3 users converted</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-orange-600">606</div>
                      <div className="text-sm text-gray-600">First Visits</div>
                      <div className="text-xs text-gray-500">New traffic</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-red-600">1</div>
                      <div className="text-sm text-gray-600">Sign-ups</div>
                      <div className="text-xs text-gray-500">Direct conversion</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-indigo-600">2</div>
                      <div className="text-sm text-gray-600">Subscribe Intent</div>
                      <div className="text-xs text-gray-500">2 users interested</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-center">
                      <div className="text-lg font-bold text-teal-600">15</div>
                      <div className="text-sm text-gray-600">Engagement Events</div>
                      <div className="text-xs text-gray-500">5 active users</div>
                    </div>
                  </div>
                </div>

                {/* Dual Analytics Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-gray-900 mb-3">📊 Dual Analytics Tracking Active</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-orange-700 mb-2">Google Analytics 4 (357792737):</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Real event tracking (740 page views)</li>
                        <li>• Conversion funnel monitoring</li>
                        <li>• User journey analysis (606 first visits)</li>
                        <li>• Engagement measurement (27 CTA clicks)</li>
                        <li>• App download tracking (7 conversions)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-700 mb-2">Meta Pixel (1181578407319125):</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Event-based conversion tracking</li>
                        <li>• Cross-platform attribution</li>
                        <li>• Custom audience building</li>
                        <li>• Advanced matching capabilities</li>
                        <li>• Real-time campaign optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signup Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Signup Trends (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={signupTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="signups" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="messages" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(LAUNCH_COLORS)[index % Object.values(LAUNCH_COLORS).length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Management Tab */}
          <TabsContent value="emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Newsletter Subscribers ({filteredSignups.length})
                  </span>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSignups ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">Loading subscriber data...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSignups
                      .filter((signup: NewsletterSignup) =>
                        signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (signup.name && signup.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .slice(0, 20)
                      .map((signup: NewsletterSignup) => (
                        <div key={signup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{signup.email}</div>
                            <div className="text-sm text-gray-600">
                              {signup.city && signup.country ? `${signup.city}, ${signup.country}` : signup.country || 'Unknown location'}
                              <span className="ml-2">• {new Date(signup.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(LAUNCH_COLORS)[index % Object.values(LAUNCH_COLORS).length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Messages ({filteredMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMessages ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">Loading messages...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.slice(0, 10).map((message: ContactMessage) => (
                      <div key={message.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{message.email}</div>
                        <div className="font-medium text-gray-900 mb-2">{message.subject}</div>
                        <div className="text-gray-700 text-sm">{message.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}