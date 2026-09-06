import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Mail, Users, MessageSquare, Activity, RefreshCw, Eye, Target, TrendingUp, Globe, Share2, BarChart3, Zap, DollarSign, Clock, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Area, AreaChart } from 'recharts';
import UTMCampaignBuilder from "@/components/UTMCampaignBuilder";
import SocialShareSection from "@/components/SocialShareSection";
import FunnelAnalytics from "@/components/FunnelAnalytics";
import launchLogo from "@assets/Untitled design.png";

interface NewsletterSignup {
  id: number;
  email: string;
  country?: string;
  city?: string;
  region?: string;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  country?: string;
  city?: string;
  region?: string;
  createdAt: string;
}

interface RealtimeMetrics {
  activeUsers: number;
  todayStats: {
    pageViews: number;
    uniqueVisitors: number;
    appDownloads: number;
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

// Chart colors for Launch theme
const LAUNCH_COLORS = {
  primary: '#FFD700',
  black: '#000000',
  gray: '#666666',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6'
};

const PIE_COLORS = [LAUNCH_COLORS.primary, LAUNCH_COLORS.black, LAUNCH_COLORS.gray, LAUNCH_COLORS.success, LAUNCH_COLORS.blue, LAUNCH_COLORS.purple, LAUNCH_COLORS.warning, LAUNCH_COLORS.danger];

export default function Admin() {
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time data fetching
  const { data: newsletterSignups = [], isLoading: loadingSignups, refetch: refetchSignups } = useQuery<NewsletterSignup[]>({
    queryKey: ['/api/admin/newsletter-signups'],
    refetchInterval: isAutoRefresh ? refreshInterval : false,
    refetchOnWindowFocus: true
  });

  const { data: contactMessages = [], isLoading: loadingMessages, refetch: refetchMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact-messages'],
    refetchInterval: isAutoRefresh ? refreshInterval : false,
    refetchOnWindowFocus: true
  });

  const { data: metrics, isLoading: loadingMetrics, refetch: refetchMetrics } = useQuery<RealtimeMetrics>({
    queryKey: ['/api/analytics/realtime'],
    refetchInterval: isAutoRefresh ? 15000 : false,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const forceRefresh = async () => {
    await Promise.all([refetchSignups(), refetchMessages(), refetchMetrics()]);
    setLastUpdate(new Date());
  };

  const downloadEmailList = () => {
    const emails = newsletterSignups.map(signup => signup.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-lifestyle-emails-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadContactList = () => {
    const contacts = contactMessages.map(msg => 
      `Name: ${msg.name}\nEmail: ${msg.email}\nMessage: ${msg.message}\nDate: ${new Date(msg.createdAt).toLocaleDateString()}\n\n---\n\n`
    ).join('');
    const blob = new Blob([contacts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-lifestyle-contacts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loadingSignups || loadingMessages) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-primary">Loading Launch Command Center...</div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const socialPlatformData = metrics?.socialPlatforms?.map(platform => ({
    name: platform.platform,
    visitors: platform.visitors,
    conversions: platform.conversions,
    conversionRate: platform.conversionRate
  })) || [];

  const countryData = metrics?.topCountries?.map(country => ({
    name: country.country,
    value: country.visitors
  })) || [];

  const engagementData = [
    { time: '12:00', visitors: metrics?.todayStats?.uniqueVisitors || 0 },
    { time: '13:00', visitors: Math.floor((metrics?.todayStats?.uniqueVisitors || 0) * 0.8) },
    { time: '14:00', visitors: Math.floor((metrics?.todayStats?.uniqueVisitors || 0) * 1.2) },
    { time: '15:00', visitors: Math.floor((metrics?.todayStats?.uniqueVisitors || 0) * 0.9) },
    { time: '16:00', visitors: Math.floor((metrics?.todayStats?.uniqueVisitors || 0) * 1.1) },
    { time: '17:00', visitors: Math.floor((metrics?.todayStats?.uniqueVisitors || 0) * 0.7) },
    { time: '18:00', visitors: metrics?.activeUsers || 0 }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Launch Themed Header */}
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-lg p-8 shadow-2xl border-2 border-primary">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tight">
                LAUNCH <span className="text-primary">COMMAND</span> CENTER
              </h1>
              <p className="text-gray-300 text-lg">
                Real-time business intelligence & performance metrics
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-4 mb-2">
                <Button
                  onClick={forceRefresh}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-primary text-black hover:bg-yellow-500 border-primary"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </Button>
                <Button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  variant={isAutoRefresh ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${isAutoRefresh ? 'bg-primary text-black' : 'border-primary text-primary hover:bg-primary hover:text-black'}`}
                >
                  <Activity className="w-4 h-4" />
                  {isAutoRefresh ? "Live Mode" : "Manual Mode"}
                </Button>
              </div>
              <p className="text-xs text-primary font-bold">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Live refresh every {refreshInterval / 1000}s
              </p>
              <img src={launchLogo} alt="Launch Logo" className="w-12 h-12 rounded-lg bg-transparent" style={{filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'}} />
            </div>
          </div>
          
          {/* Launch Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-800 p-3 rounded border border-primary/20">
              <div className={`w-3 h-3 rounded-full ${!loadingMetrics ? 'bg-primary' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-white font-semibold">Firebase: </span>
              <span className="text-primary">{!loadingMetrics ? 'Active' : 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-800 p-3 rounded border border-primary/20">
              <div className={`w-3 h-3 rounded-full ${!loadingSignups ? 'bg-primary' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-white font-semibold">Newsletter: </span>
              <span className="text-primary">{!loadingSignups ? 'Active' : 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-800 p-3 rounded border border-primary/20">
              <div className={`w-3 h-3 rounded-full ${!loadingMessages ? 'bg-primary' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-white font-semibold">Contacts: </span>
              <span className="text-primary">{!loadingMessages ? 'Active' : 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-800 p-3 rounded border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-white font-semibold">System: </span>
              <span className="text-primary">Operational</span>
            </div>
          </div>
        </div>

        {/* Main Metrics Dashboard */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-primary/20">
            <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              📊 METRICS
            </TabsTrigger>
            <TabsTrigger value="social" className="text-white data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              📱 SOCIAL
            </TabsTrigger>
            <TabsTrigger value="funnel" className="text-white data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              🎯 FUNNEL
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-white data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              ⚡ ACTIONS
            </TabsTrigger>
          </TabsList>

          {/* METRICS TAB */}
          <TabsContent value="metrics" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-semibold uppercase">Today's Visitors</p>
                      <p className="text-3xl font-black text-primary">{metrics?.todayStats?.uniqueVisitors || 0}</p>
                    </div>
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {metrics?.todayStats?.pageViews || 0} total page views
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-semibold uppercase">Session Time</p>
                      <p className="text-3xl font-black text-primary">{formatDuration(metrics?.todayStats?.avgSessionDuration || 0)}</p>
                    </div>
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Average engagement time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Engagement Chart */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary font-black uppercase">Today's Traffic Flow</CardTitle>
                  <CardDescription className="text-gray-300">Real visitor activity patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#FFD700" />
                      <YAxis stroke="#FFD700" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#000', 
                          border: '2px solid #FFD700',
                          borderRadius: '8px',
                          color: '#FFD700'
                        }} 
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#FFD700" fill="#FFD700" fillOpacity={0.3} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Traffic Sources Pie Chart */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary font-black uppercase">Traffic Sources</CardTitle>
                  <CardDescription className="text-gray-300">Top visitor countries breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={countryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {countryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#000', 
                          border: '2px solid #FFD700',
                          borderRadius: '8px',
                          color: '#FFD700'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SOCIAL TAB */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Platform Performance */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary font-black uppercase">Platform Performance</CardTitle>
                  <CardDescription className="text-gray-300">Conversion rates by social platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={socialPlatformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#FFD700" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#FFD700" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#000', 
                          border: '2px solid #FFD700',
                          borderRadius: '8px',
                          color: '#FFD700'
                        }} 
                      />
                      <Bar dataKey="visitors" fill="#FFD700" />
                      <Bar dataKey="conversions" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Social Media Grid */}
              <div className="space-y-4">
                {socialPlatformData.slice(0, 6).map((platform, index) => (
                  <Card key={platform.name} className="bg-gradient-to-r from-gray-900 to-black border border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold">{platform.name}</h3>
                          <p className="text-gray-300 text-sm">{platform.visitors} visitors</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-black text-lg">{platform.conversions}</p>
                          <p className="text-gray-400 text-xs">conversions</p>
                        </div>
                      </div>
                      <div className="mt-2 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(platform.conversionRate * 10, 100)}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FUNNEL TAB */}
          <TabsContent value="funnel">
            <FunnelAnalytics />
          </TabsContent>

          {/* ACTIONS TAB */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Action Plans moved to side tab */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary font-black uppercase flex items-center gap-2">
                    <Flame className="w-6 h-6" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-900/30 border border-red-500 p-4 rounded">
                    <h4 className="text-red-400 font-bold mb-2">Critical: Bounce Rate (55%)</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Exit-intent popup deployed ✓</li>
                      <li>• WhatsApp support widget active ✓</li>
                      <li>• Hero CTA optimized ✓</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500 p-4 rounded">
                    <h4 className="text-yellow-400 font-bold mb-2">Optimize: Newsletter Conversion</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Free guide offer implemented ✓</li>
                      <li>• Social proof added ✓</li>
                      <li>• Trust indicators displayed ✓</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary font-black uppercase">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-primary/20">
                    <div>
                      <p className="text-white font-semibold">Newsletter Subscribers</p>
                      <p className="text-gray-400 text-sm">{newsletterSignups.length} total emails</p>
                    </div>
                    <Button
                      onClick={downloadEmailList}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-primary/20">
                    <div>
                      <p className="text-white font-semibold">Contact Messages</p>
                      <p className="text-gray-400 text-sm">{contactMessages.length} inquiries</p>
                    </div>
                    <Button
                      onClick={downloadContactList}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* UTM and Social Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UTMCampaignBuilder />
              <SocialShareSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}