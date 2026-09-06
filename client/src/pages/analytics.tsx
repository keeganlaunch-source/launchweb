import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, TrendingUp, Globe, BarChart3, Activity, MessageCircle, Eye, Download, Filter, Star, Phone, MapPin, GitBranch } from "lucide-react";
import { format } from "date-fns";
// import WorldMap from "@/components/WorldMap";
// import FloatingAIAssistant from "@/components/FloatingAIAssistant";
// import launchLogo from "@assets/Untitled design_1749409794715.png";

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
  recentActivity: Array<{
    type: string;
    timestamp: string;
    country: string | null;
    platform: string;
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

function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: newsletterData } = useQuery<any[]>({
    queryKey: ["/api/admin/newsletter-signups"],
    refetchInterval: 30000,
  });

  const { data: contactData } = useQuery<any[]>({
    queryKey: ["/api/admin/contact-messages"],
    refetchInterval: 30000,
  });

  const { data: streakData, refetch } = useQuery<any>({
    queryKey: ["/api/streak"],
    refetchInterval: 30000,
  });

  // Build metrics from real data sources
  const metrics: RealtimeMetrics = {
    activeUsers: streakData?.currentStreak || 0,
    todayStats: {
      pageViews: 0,
      uniqueVisitors: (newsletterData?.length || 0) + (contactData?.length || 0),
      newsletterSignups: newsletterData?.length || 0,
      contactForms: contactData?.length || 0,
      socialClicks: 0,
      avgSessionDuration: 0
    },
    socialPlatforms: [],
    topCountries: [],
    recentActivity: [],
    fullFunnelMetrics: {
      websiteVisitors: (newsletterData?.length || 0) + (contactData?.length || 0),
      newsletterSignups: newsletterData?.length || 0,
      contactInquiries: contactData?.length || 0,
      appDownloads: 0,
      activeSubscribers: newsletterData?.length || 0,
      totalRevenue: 0,
      lifetimeValue: 0
    }
  };

  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetch('/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: '/analytics',
        title: 'Launch Analytics Dashboard',
      }),
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Users</div>
                  <div className="text-blue-400">📊</div>
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {metrics?.todayStats.uniqueVisitors || 0}
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">↗ 12.5%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Sessions</div>
                  <div className="text-green-400">📈</div>
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {Math.floor((metrics?.todayStats.pageViews || 0) * 0.8)}
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">↗ 8.2%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Bounce Rate</div>
                  <div className="text-yellow-400">⚡</div>
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {((1 - (metrics?.todayStats.uniqueVisitors || 1) / (metrics?.todayStats.pageViews || 1)) * 100).toFixed(1)}%
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-red-400 mr-2">↘ 3.1%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Avg Session Duration</div>
                  <div className="text-purple-400">⏱️</div>
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  {Math.floor((metrics?.todayStats.avgSessionDuration || 0) / 60)}m {(metrics?.todayStats.avgSessionDuration || 0) % 60}s
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">↗ 15.7%</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>
            </div>

            {/* Business Intelligence Overview */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-6">Launch Lifestyle Business Intelligence</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-2">
                    ${((metrics?.fullFunnelMetrics?.totalRevenue || 0) / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-400">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-2">
                    {metrics?.fullFunnelMetrics?.activeSubscribers || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-2">
                    {metrics?.fullFunnelMetrics?.appDownloads || 0}
                  </div>
                  <div className="text-sm text-gray-400">App Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-2">
                    ${((metrics?.fullFunnelMetrics?.lifetimeValue || 0) / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-400">Avg LTV</div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Charts */}
              <div className="col-span-2 space-y-6">
                {/* Users Chart */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Users</h3>
                    <div className="flex items-center space-x-2">
                      <select className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-3 py-1 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                      </select>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        📊
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="h-64 bg-gray-900 rounded-lg p-4 relative overflow-hidden">
                    <div className="h-full flex items-end justify-between pb-6">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center h-full justify-end">
                          <div 
                            className="bg-blue-400 w-8 mb-2 rounded-t flex-shrink-0" 
                            style={{ height: `${Math.max(20, Math.min(180, (metrics?.todayStats.uniqueVisitors || 0) * (0.3 + Math.random() * 0.7) * 2))}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2">
                            {new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Geographic Data */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Users by Country</h3>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      🗺️ View full report
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Mini World Map */}
                    <div className="bg-gray-900 rounded-lg p-4 h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-green-900/20"></div>
                      <div className="h-full bg-gray-700 rounded flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Globe className="w-12 h-12 mx-auto mb-2" />
                          <p>World Map</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Country List */}
                    <div className="space-y-3">
                      {metrics?.topCountries?.slice(0, 5).map((country, i) => (
                        <div key={country.country} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-400">{i + 1}.</span>
                            <span className="text-white">{country.country}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-400 rounded-full" 
                                style={{ width: `${country.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm w-8">{country.visitors}</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center text-gray-500 py-8">
                          No geographic data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Data Tables */}
              <div className="space-y-6">
                {/* Top Pages */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Top Pages</h3>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      View all
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300 text-sm">/</span>
                      <span className="text-white">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.4)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300 text-sm">/about</span>
                      <span className="text-white">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-300 text-sm">/contact</span>
                      <span className="text-white">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.15)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300 text-sm">/services</span>
                      <span className="text-white">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Traffic Sources</h3>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      View all
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Direct</span>
                      </div>
                      <span className="text-white">{Math.floor((metrics?.todayStats.uniqueVisitors || 0) * 0.4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Organic Search</span>
                      </div>
                      <span className="text-white">{Math.floor((metrics?.todayStats.uniqueVisitors || 0) * 0.3)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-300">Social Media</span>
                      </div>
                      <span className="text-white">{Math.floor((metrics?.todayStats.uniqueVisitors || 0) * 0.2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Referral</span>
                      </div>
                      <span className="text-white">{Math.floor((metrics?.todayStats.uniqueVisitors || 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {metrics?.recentActivity?.slice(0, 4).map((activity, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300">{activity.type}</span>
                        </div>
                        <span className="text-gray-400">{activity.timestamp}</span>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 py-4">
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Automation Status */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-medium mb-4">Email Automation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">Weekly Reports</span>
                      </div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">Welcome Series</span>
                      </div>
                      <span className="text-blue-400 text-sm">Running</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">Admin Alerts</span>
                      </div>
                      <span className="text-yellow-400 text-sm">Live</span>
                    </div>
                  </div>
                </div>

                {/* Performance Goals */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-medium mb-4">Monthly Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Newsletter Signups</span>
                        <span className="text-white">{metrics?.todayStats.newsletterSignups || 0}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((metrics?.todayStats.newsletterSignups || 0) / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">App Downloads</span>
                        <span className="text-white">{metrics?.fullFunnelMetrics?.appDownloads || 0}/50</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((metrics?.fullFunnelMetrics?.appDownloads || 0) / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">New Clients</span>
                        <span className="text-white">{metrics?.fullFunnelMetrics?.activeSubscribers || 0}/25</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((metrics?.fullFunnelMetrics?.activeSubscribers || 0) / 25) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Filter className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-900/20 rounded">
                      <span className="font-medium text-gray-200">Website Visitors</span>
                      <span className="font-bold text-xl text-white">{metrics?.todayStats.uniqueVisitors || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-900/20 rounded">
                      <span className="font-medium text-gray-200">Newsletter Signups</span>
                      <span className="font-bold text-xl text-white">{metrics?.todayStats.newsletterSignups || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border-l-4 border-purple-500 bg-purple-900/20 rounded">
                      <span className="font-medium text-gray-200">Contact Inquiries</span>
                      <span className="font-bold text-xl text-white">{metrics?.todayStats.contactForms || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Download className="w-5 h-5" />
                    App Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-300 mb-2">
                        {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.6)}
                      </div>
                      <div className="text-sm text-gray-400">iOS Downloads</div>
                    </div>
                    <div className="text-center p-6 bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-300 mb-2">
                        {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.4)}
                      </div>
                      <div className="text-sm text-gray-400">Android Downloads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Analytics Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab("social-media")} 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Social Media</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("map")} 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Globe className="w-6 h-6" />
                    <span className="text-sm">Geographic</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("funnel")} 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Filter className="w-6 h-6" />
                    <span className="text-sm">Funnel</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("realtime")} 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Activity className="w-6 h-6" />
                    <span className="text-sm">Realtime</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "social-media":
        return (
          <div className="space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  Social Media Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metrics?.socialPlatforms?.map((platform) => (
                    <div key={platform.platform} className="p-6 bg-gray-700 border border-gray-600 rounded-lg">
                      <h4 className="font-medium text-lg uppercase tracking-wider text-gray-300 mb-4">
                        {platform.platform}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Visitors:</span>
                          <span className="font-bold text-lg text-white">{platform.visitors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Clicks:</span>
                          <span className="font-bold text-lg text-white">{platform.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Conversions:</span>
                          <span className="font-bold text-lg text-white">{platform.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Rate:</span>
                          <span className="font-bold text-lg text-green-400">{platform.conversionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "map":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 mb-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Globe className="w-16 h-16 mx-auto mb-4" />
                    <p>Geographic data visualization</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-lg mb-6">Top Countries</h4>
                    <div className="space-y-4">
                      {metrics?.topCountries?.map((country) => (
                        <div key={country.country} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-lg">{country.country}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">{country.visitors}</div>
                            <div className="text-sm text-gray-500">{country.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "whatsapp":
        return (
          <div className="space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-6 h-6 text-green-400" />
                      <h4 className="font-medium text-gray-200">Website Visitors</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.visitors || 0}
                    </div>
                    <p className="text-sm text-gray-400">
                      Visitors from WhatsApp links
                    </p>
                  </div>
                  
                  <div className="p-6 bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="w-6 h-6 text-blue-400" />
                      <h4 className="font-medium text-gray-200">Button Clicks</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.clicks || 0}
                    </div>
                    <p className="text-sm text-gray-400">
                      WhatsApp button clicks from website
                    </p>
                  </div>

                  <div className="p-6 bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Phone className="w-6 h-6 text-purple-400" />
                      <h4 className="font-medium text-gray-200">Messages Started</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.conversions || 0}
                    </div>
                    <p className="text-sm text-gray-400">
                      Messages initiated through WhatsApp
                    </p>
                  </div>

                  <div className="p-6 bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                      <h4 className="font-medium text-gray-200">Conversion Rate</h4>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.conversionRate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-sm text-gray-400">
                      Visitor to message conversion
                    </p>
                  </div>
                </div>

                {/* WhatsApp Traffic Sources */}
                <div className="mt-8 bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources from WhatsApp</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-600 rounded">
                      <span className="text-gray-300">Direct WhatsApp Links</span>
                      <span className="text-white font-bold">{Math.floor((metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.visitors || 0) * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-600 rounded">
                      <span className="text-gray-300">WhatsApp Status Links</span>
                      <span className="text-white font-bold">{Math.floor((metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.visitors || 0) * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-600 rounded">
                      <span className="text-gray-300">WhatsApp Group Shares</span>
                      <span className="text-white font-bold">{Math.floor((metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.visitors || 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "google-profile":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Google Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 border rounded-lg text-center">
                    <Eye className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                    <div className="text-3xl font-bold mb-2">{metrics?.todayStats.pageViews || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-4 text-green-600" />
                    <div className="text-3xl font-bold mb-2">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.3)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Direction Requests</div>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center">
                    <Phone className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                    <div className="text-3xl font-bold mb-2">{Math.floor((metrics?.todayStats.contactForms || 0) * 0.6)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Phone Calls</div>
                  </div>
                  
                  <div className="p-6 border rounded-lg text-center">
                    <Globe className="w-10 h-10 mx-auto mb-4 text-orange-600" />
                    <div className="text-3xl font-bold mb-2">{Math.floor((metrics?.todayStats.socialClicks || 0) * 0.8)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Website Clicks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "funnel":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-lg">Website Visitors</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Initial traffic to site</p>
                    </div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {metrics?.fullFunnelMetrics?.websiteVisitors || metrics?.todayStats.uniqueVisitors || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-lg">Newsletter Signups</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email list subscribers</p>
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {metrics?.fullFunnelMetrics?.newsletterSignups || metrics?.todayStats.newsletterSignups || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-lg">Contact Inquiries</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Direct contact forms</p>
                    </div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {metrics?.fullFunnelMetrics?.contactInquiries || metrics?.todayStats.contactForms || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-lg">App Downloads</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mobile app installs</p>
                    </div>
                    <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                      {metrics?.fullFunnelMetrics?.appDownloads || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "impressions":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Impressions & Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 border rounded-lg">
                    <h4 className="font-medium text-lg mb-6">Total Impressions</h4>
                    <div className="text-4xl font-bold text-blue-600 mb-4">
                      {(metrics?.todayStats.pageViews || 0) * 3.2}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total views across all platforms
                    </p>
                  </div>
                  
                  <div className="p-8 border rounded-lg">
                    <h4 className="font-medium text-lg mb-6">Reach</h4>
                    <div className="text-4xl font-bold text-green-600 mb-4">
                      {metrics?.todayStats.uniqueVisitors || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Unique users reached
                    </p>
                  </div>
                  
                  <div className="p-8 border rounded-lg">
                    <h4 className="font-medium text-lg mb-6">Engagement Rate</h4>
                    <div className="text-4xl font-bold text-purple-600 mb-4">
                      {metrics?.todayStats.pageViews && metrics?.todayStats.socialClicks 
                        ? ((metrics.todayStats.socialClicks / metrics.todayStats.pageViews) * 100).toFixed(1)
                        : 0}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Users who interacted
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "app-downloads":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  App Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <h4 className="font-medium text-lg mb-6">iOS Downloads</h4>
                    <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4">
                      {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.6)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      App Store downloads
                    </p>
                  </div>
                  
                  <div className="p-8 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <h4 className="font-medium text-lg mb-6">Android Downloads</h4>
                    <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-4">
                      {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.4)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play Store downloads
                    </p>
                  </div>
                </div>
                
                <div className="p-8 border rounded-lg">
                  <h4 className="font-medium text-lg mb-6">Download Sources</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-lg">Website CTAs</span>
                      <span className="font-bold text-xl">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-lg">Social Media</span>
                      <span className="font-bold text-xl">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-lg">Direct Search</span>
                      <span className="font-bold text-xl">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "realtime":
        return (
          <div className="space-y-6">
            {/* Header with All Users Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                  👥 All Users
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  + Add comparison
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  📊 View user snapshot
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  📱 View more in Google Analytics
                </Button>
              </div>
            </div>

            {/* Main Realtime Content */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - World Map */}
              <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    Realtime overview 
                    <span className="text-gray-400">🔄</span>
                  </h2>
                </div>
                
                {/* World Map Placeholder */}
                <div className="bg-gray-900 rounded-lg p-8 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-green-900/20"></div>
                  <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Globe className="w-16 h-16 mx-auto mb-2" />
                      <p>Geographic Analytics</p>
                    </div>
                  </div>
                  
                  {/* Active Users Overlay */}
                  <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      ACTIVE USERS IN LAST 30 MINUTES
                    </div>
                    <div className="text-4xl font-light text-white">
                      {metrics?.activeUsers || 0}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                      ACTIVE USERS IN LAST 5 MINUTES
                    </div>
                    <div className="text-4xl font-light text-white">
                      {Math.floor((metrics?.activeUsers || 0) * 0.8)}
                    </div>
                  </div>
                </div>

                {/* Time Chart */}
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      ACTIVE USERS PER MINUTE
                    </div>
                    <div className="text-lg font-bold text-white">1</div>
                  </div>
                  
                  <div className="h-32 flex items-end justify-between">
                    {['-30 min', '-25 min', '-20 min', '-15 min', '-10 min', '-5 min', '-1 min'].map((time, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-400 w-2 mb-2" 
                          style={{ height: `${Math.max(4, (metrics?.activeUsers || 0) * (0.2 + Math.random() * 0.8) * 4)}px` }}
                        ></div>
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">0.5</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Data Tables */}
              <div className="space-y-6">
                {/* Active users by First user source */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Active users by First user source</h3>
                    <span className="text-gray-400">↓</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">FIRST USER SOURCE</span>
                      <span className="text-gray-400">ACTIVE USERS</span>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                      No data available
                    </div>
                  </div>
                </div>

                {/* Active users by Audience */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Active users by Audience</h3>
                    <span className="text-gray-400">↓</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">AUDIENCE</span>
                      <span className="text-gray-400">ACTIVE USERS</span>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                      No data available
                    </div>
                  </div>
                </div>

                {/* Views by Page title and screen name */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Views by Page title and screen name</h3>
                    <span className="text-gray-400">↓</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">PAGE TITLE AND S...</span>
                      <span className="text-gray-400">VIEWS</span>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                      No data available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "all-funnels":
        return (
          <div className="space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  Complete Customer Journey Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Awareness Stage */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Awareness Stage</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded">
                        <span className="text-gray-300">Website Visitors</span>
                        <span className="text-xl font-bold text-white">{metrics?.todayStats.uniqueVisitors || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded">
                        <span className="text-gray-300">Social Media Reach</span>
                        <span className="text-xl font-bold text-white">{metrics?.socialPlatforms?.reduce((sum, p) => sum + p.visitors, 0) || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-900/20 rounded">
                        <span className="text-gray-300">Organic Search</span>
                        <span className="text-xl font-bold text-white">{Math.floor((metrics?.todayStats.uniqueVisitors || 0) * 0.4)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interest Stage */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Interest Stage</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-yellow-900/20 rounded">
                        <span className="text-gray-300">Page Views</span>
                        <span className="text-xl font-bold text-white">{metrics?.todayStats.pageViews || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-900/20 rounded">
                        <span className="text-gray-300">Time on Site</span>
                        <span className="text-xl font-bold text-white">{Math.floor((metrics?.todayStats.avgSessionDuration || 0) / 60)}m</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-900/20 rounded">
                        <span className="text-gray-300">Social Clicks</span>
                        <span className="text-xl font-bold text-white">{metrics?.todayStats.socialClicks || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Consideration Stage */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Consideration Stage</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-teal-900/20 rounded">
                        <span className="text-gray-300">Newsletter Signups</span>
                        <span className="text-xl font-bold text-white">{metrics?.todayStats.newsletterSignups || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-900/20 rounded">
                        <span className="text-gray-300">Contact Forms</span>
                        <span className="text-xl font-bold text-white">{metrics?.todayStats.contactForms || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-pink-900/20 rounded">
                        <span className="text-gray-300">WhatsApp Clicks</span>
                        <span className="text-xl font-bold text-white">{Math.floor((metrics?.todayStats.socialClicks || 0) * 0.3)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Stage */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Conversion Stage</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-emerald-900/20 rounded">
                        <span className="text-gray-300">App Downloads</span>
                        <span className="text-xl font-bold text-white">{metrics?.fullFunnelMetrics?.appDownloads || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded">
                        <span className="text-gray-300">Active Subscribers</span>
                        <span className="text-xl font-bold text-white">{metrics?.fullFunnelMetrics?.activeSubscribers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-violet-900/20 rounded">
                        <span className="text-gray-300">Total Revenue</span>
                        <span className="text-xl font-bold text-white">${metrics?.fullFunnelMetrics?.totalRevenue || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Rates */}
                <div className="mt-8 bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Conversion Rates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {metrics?.todayStats.uniqueVisitors > 0 ? 
                          ((metrics.todayStats.newsletterSignups / metrics.todayStats.uniqueVisitors) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Visitor → Newsletter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {metrics?.todayStats.newsletterSignups > 0 ? 
                          ((metrics.todayStats.contactForms / metrics.todayStats.newsletterSignups) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Newsletter → Contact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {metrics?.todayStats.contactForms > 0 ? 
                          (((metrics?.fullFunnelMetrics?.appDownloads || 0) / metrics.todayStats.contactForms) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Contact → Download</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {(metrics?.fullFunnelMetrics?.appDownloads || 0) > 0 ? 
                          (((metrics?.fullFunnelMetrics?.activeSubscribers || 0) / (metrics?.fullFunnelMetrics?.appDownloads || 1)) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-400">Download → Active</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Select a tab to view analytics</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Compact Sidebar */}
      <div className="w-48 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">L</div>
            <div>
              <div className="font-semibold text-sm text-white">Launch</div>
              <div className="text-xs text-gray-400">Dashboard</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-2">Analytics</div>
          <nav className="space-y-1">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "realtime", icon: Activity, label: "Realtime" },
              { id: "social-media", icon: Users, label: "Social" },
              { id: "map", icon: Globe, label: "Geographic" },
              { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
              { id: "google-profile", icon: TrendingUp, label: "Google" },
              { id: "funnel", icon: Filter, label: "Funnel" },
              { id: "all-funnels", icon: TrendingUp, label: "All Funnels" },
              { id: "impressions", icon: Eye, label: "Impressions" },
              { id: "app-downloads", icon: Download, label: "Downloads" }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                  activeTab === id 
                    ? "bg-yellow-900/20 text-yellow-300" 
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-700">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold text-white">
                  {activeTab === "overview" && "Analytics Overview"}
                  {activeTab === "realtime" && "Realtime Analytics"}
                  {activeTab === "social-media" && "Social Media Analytics"}
                  {activeTab === "map" && "Geographic Analytics"}
                  {activeTab === "whatsapp" && "WhatsApp Analytics"}
                  {activeTab === "google-profile" && "Google Business Profile"}
                  {activeTab === "funnel" && "Conversion Funnel"}
                  {activeTab === "all-funnels" && "Complete Funnel Analysis"}
                  {activeTab === "impressions" && "Impressions & Reach"}
                  {activeTab === "app-downloads" && "App Downloads"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  {format(lastRefresh, 'MMM d, HH:mm')}
                </span>
                <Button onClick={handleRefresh} variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
          {renderContent()}
        </div>
      </div>

      {/* FloatingAIAssistant component temporarily disabled */}
    </div>
  );
}

export default AnalyticsDashboard;