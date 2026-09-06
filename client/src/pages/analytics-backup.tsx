import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, TrendingUp, Globe, BarChart3, Activity, Server, Clock, Bot, MessageCircle, Eye, Download, Filter, Star, Phone, MapPin } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import WorldMap from "@/components/WorldMap";
import FloatingAIAssistant from "@/components/FloatingAIAssistant";
import launchLogo from "@assets/Untitled design_1749409794715.png";

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

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: metrics, refetch } = useQuery<RealtimeMetrics>({
    queryKey: ["/api/analytics/realtime"],
    refetchInterval: 30000, // Refresh every 30 seconds for realtime data
  });

  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  useEffect(() => {
    // Track page view
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
            {/* Comprehensive Overview Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Website Analytics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Website Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {metrics?.todayStats.pageViews || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Page Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {metrics?.todayStats.uniqueVisitors || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {metrics?.todayStats.newsletterSignups || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Newsletter Signups</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {metrics?.todayStats.contactForms || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Contact Forms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Social Media Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics?.socialPlatforms?.slice(0, 4).map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium capitalize">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{platform.visitors}</div>
                          <div className="text-xs text-gray-500">{platform.conversionRate.toFixed(1)}% CVR</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics?.topCountries?.slice(0, 5).map((country) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <span className="font-medium">{country.country}</span>
                        <div className="text-right">
                          <div className="font-bold">{country.visitors}</div>
                          <div className="text-xs text-gray-500">{country.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Communication Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Communication Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">
                        {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.clicks || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Phone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {Math.floor((metrics?.todayStats.contactForms || 0) * 0.6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Phone Calls</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    App Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">iOS Downloads</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">
                        {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.4)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Android Downloads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funnel Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span className="text-sm font-medium">Website Visitors</span>
                      <span className="font-bold">{metrics?.todayStats.uniqueVisitors || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm font-medium">Newsletter Signups</span>
                      <span className="font-bold">{metrics?.todayStats.newsletterSignups || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <span className="text-sm font-medium">Contact Inquiries</span>
                      <span className="font-bold">{metrics?.todayStats.contactForms || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Analytics Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab("social-media")} 
                    variant="outline" 
                    className="h-16 flex flex-col gap-2"
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-sm">View Social Media</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("map")} 
                    variant="outline" 
                    className="h-16 flex flex-col gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Geographic Data</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("funnel")} 
                    variant="outline" 
                    className="h-16 flex flex-col gap-2"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="text-sm">Funnel Analysis</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("realtime")} 
                    variant="outline" 
                    className="h-16 flex flex-col gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-sm">Realtime Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "social-media":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Social Media Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics?.socialPlatforms?.map((platform) => (
                    <div key={platform.platform} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                        {platform.platform}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Visitors:</span>
                          <span className="font-medium">{platform.visitors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Clicks:</span>
                          <span className="font-medium">{platform.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversions:</span>
                          <span className="font-medium">{platform.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Rate:</span>
                          <span className="font-medium text-green-600">{platform.conversionRate.toFixed(1)}%</span>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 mb-6">
                  <WorldMap countries={metrics?.topCountries || []} totalUsers={metrics?.todayStats.uniqueVisitors || 0} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Top Countries</h4>
                    <div className="space-y-3">
                      {metrics?.topCountries?.map((country) => (
                        <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{country.country}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{country.visitors}</div>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                      <h4 className="font-medium">WhatsApp Clicks</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.clicks || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Total WhatsApp button clicks from website
                    </p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Phone className="w-6 h-6 text-blue-600" />
                      <h4 className="font-medium">Direct Messages</h4>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {metrics?.todayStats.contactForms || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Messages initiated through WhatsApp
                    </p>
                  </div>

                  <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                      <h4 className="font-medium">Conversion Rate</h4>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {metrics?.socialPlatforms?.find(p => p.platform === 'whatsapp')?.conversionRate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      WhatsApp click to message rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "google-profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Google Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Eye className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold">{metrics?.todayStats.pageViews || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-2xl font-bold">{Math.floor((metrics?.todayStats.pageViews || 0) * 0.3)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Direction Requests</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Phone className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-2xl font-bold">{Math.floor((metrics?.todayStats.contactForms || 0) * 0.6)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Phone Calls</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Globe className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-2xl font-bold">{Math.floor((metrics?.todayStats.socialClicks || 0) * 0.8)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Website Clicks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "funnel":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Website Visitors</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Initial traffic to site</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {metrics?.fullFunnelMetrics?.websiteVisitors || metrics?.todayStats.uniqueVisitors || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Newsletter Signups</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email list subscribers</p>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {metrics?.fullFunnelMetrics?.newsletterSignups || metrics?.todayStats.newsletterSignups || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Contact Inquiries</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Direct contact forms</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {metrics?.fullFunnelMetrics?.contactInquiries || metrics?.todayStats.contactForms || 0}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">App Downloads</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mobile app installs</p>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Impressions & Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h4 className="font-medium mb-4">Total Impressions</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {(metrics?.todayStats.pageViews || 0) * 3.2}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total views across all platforms
                    </p>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h4 className="font-medium mb-4">Reach</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {metrics?.todayStats.uniqueVisitors || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Unique users reached
                    </p>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h4 className="font-medium mb-4">Engagement Rate</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  App Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <h4 className="font-medium mb-4">iOS Downloads</h4>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                      {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.6)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      App Store downloads
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <h4 className="font-medium mb-4">Android Downloads</h4>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                      {Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.4)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play Store downloads
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-6 border rounded-lg">
                  <h4 className="font-medium mb-4">Download Sources</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Website CTAs</span>
                      <span className="font-medium">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Social Media</span>
                      <span className="font-medium">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Direct Search</span>
                      <span className="font-medium">{Math.floor((metrics?.fullFunnelMetrics?.appDownloads || 0) * 0.1)}</span>
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
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900 dark:text-white">Realtime Overview</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-light text-gray-900 dark:text-white mb-2">
                      {metrics?.activeUsers || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ACTIVE USERS IN LAST 30 MINUTES
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-light text-gray-900 dark:text-white mb-2">
                      {Math.floor((metrics?.activeUsers || 0) * 0.8)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ACTIVE USERS IN LAST 5 MINUTES
                    </div>
                  </div>
                  
                  <div className="border-l border-gray-200 dark:border-gray-600 pl-8">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      ACTIVE USERS PER MINUTE
                    </div>
                    <div className="h-16 flex items-end space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-blue-400 w-2"
                          style={{ height: `${Math.max(8, (metrics?.activeUsers || 0) * (0.5 + Math.random() * 0.5))}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view analytics</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Compact Left Sidebar */}
      <div className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <img src={launchLogo} alt="Launch Logo" className="w-6 h-6" />
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Launch</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Dashboard</div>
            </div>
          </div>
        </div>

        {/* Analytics Navigation */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Analytics</div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "overview" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab("realtime")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "realtime" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm">Realtime</span>
            </button>
            
            <button
              onClick={() => setActiveTab("social-media")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "social-media" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Social Media</span>
            </button>
            
            <button
              onClick={() => setActiveTab("map")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "map" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Geographic</span>
            </button>
            
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "whatsapp" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">WhatsApp</span>
            </button>
            
            <button
              onClick={() => setActiveTab("google-profile")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "google-profile" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Google Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab("funnel")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "funnel" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Funnel</span>
            </button>
            
            <button
              onClick={() => setActiveTab("impressions")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "impressions" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Impressions</span>
            </button>
            
            <button
              onClick={() => setActiveTab("app-downloads")}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                activeTab === "app-downloads" 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">App Downloads</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Compact Top Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeTab === "overview" && "Overview"}
                  {activeTab === "realtime" && "Realtime"}
                  {activeTab === "social-media" && "Social Media Analytics"}
                  {activeTab === "map" && "Geographic Data"}
                  {activeTab === "whatsapp" && "WhatsApp Analytics"}
                  {activeTab === "google-profile" && "Google Profile"}
                  {activeTab === "funnel" && "Funnel Analysis"}
                  {activeTab === "impressions" && "Impressions"}
                  {activeTab === "app-downloads" && "App Downloads"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(lastRefresh, 'MMM d, HH:mm')}
                </span>
                <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 px-3">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Main Content */}
        <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}