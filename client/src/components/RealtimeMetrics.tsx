import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Download, Mail, MessageSquare, Globe, Activity, Target, Eye, MousePointer, Share2 } from "lucide-react";
import { useState, useEffect } from "react";

interface RealtimeData {
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
  recentActivity: Array<{
    type: string;
    timestamp: string;
    data: any;
  }>;
  socialPlatformBreakdown: Array<{
    platform: string;
    visitors: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  utmPerformance: Array<{
    source: string;
    medium: string;
    campaign: string;
    visitors: number;
    conversions: number;
  }>;
}

export default function RealtimeMetrics() {
  const [refreshTick, setRefreshTick] = useState(0);

  const { data: metrics, isLoading } = useQuery<RealtimeData>({
    queryKey: ['/api/analytics/realtime', refreshTick],
    refetchInterval: 15000, // 15 seconds for ultra-fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTick(prev => prev + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200"></CardHeader>
            <CardContent className="h-16 bg-gray-100"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {metrics.activeUsers}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Live right now
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {metrics.todayStats.uniqueVisitors}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {metrics.todayStats.pageViews} page views
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Downloads</CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {metrics.todayStats.appDownloads}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Today's conversions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatDuration(metrics.todayStats.avgSessionDuration)}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Engagement time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Traffic (Real-time)
          </CardTitle>
          <CardDescription>Live performance across all social platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.socialPlatformBreakdown.map((platform, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{platform.platform}</h4>
                  <Badge variant={platform.visitors > 0 ? "default" : "secondary"}>
                    {platform.conversionRate.toFixed(1)}% CVR
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                    <div className="text-xl font-bold">{platform.visitors}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Clicks</div>
                    <div className="text-xl font-bold">{platform.clicks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
                    <div className="text-xl font-bold text-green-600">{platform.conversions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Countries Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.geographicData.slice(0, 5).map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.country === 'South Africa' ? '🇿🇦' : 
                                               country.country === 'United States' ? '🇺🇸' :
                                               country.country === 'United Kingdom' ? '🇬🇧' :
                                               country.country === 'Canada' ? '🇨🇦' :
                                               country.country === 'Australia' ? '🇦🇺' : '🌍'}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{country.visitors}</div>
                    <div className="text-xs text-gray-500">{country.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  📱 Mobile
                </span>
                <div className="text-right">
                  <div className="font-bold">{metrics.deviceBreakdown.mobile}</div>
                  <div className="text-xs text-gray-500">
                    {((metrics.deviceBreakdown.mobile / (metrics.deviceBreakdown.mobile + metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.tablet)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  💻 Desktop
                </span>
                <div className="text-right">
                  <div className="font-bold">{metrics.deviceBreakdown.desktop}</div>
                  <div className="text-xs text-gray-500">
                    {((metrics.deviceBreakdown.desktop / (metrics.deviceBreakdown.mobile + metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.tablet)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  📲 Tablet
                </span>
                <div className="text-right">
                  <div className="font-bold">{metrics.deviceBreakdown.tablet}</div>
                  <div className="text-xs text-gray-500">
                    {((metrics.deviceBreakdown.tablet / (metrics.deviceBreakdown.mobile + metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.tablet)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UTM Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Performance (UTM Tracking)
          </CardTitle>
          <CardDescription>Real-time tracking link performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Medium</th>
                  <th className="text-left p-2">Campaign</th>
                  <th className="text-right p-2">Visitors</th>
                  <th className="text-right p-2">Conversions</th>
                  <th className="text-right p-2">CVR</th>
                </tr>
              </thead>
              <tbody>
                {metrics.utmPerformance.map((campaign, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 font-medium">{campaign.source}</td>
                    <td className="p-2">{campaign.medium}</td>
                    <td className="p-2">{campaign.campaign}</td>
                    <td className="p-2 text-right">{campaign.visitors}</td>
                    <td className="p-2 text-right font-bold text-green-600">{campaign.conversions}</td>
                    <td className="p-2 text-right">
                      <Badge variant={campaign.conversions > 0 ? "default" : "secondary"}>
                        {campaign.visitors > 0 ? ((campaign.conversions / campaign.visitors) * 100).toFixed(1) : 0}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>Real-time user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {metrics.recentActivity.slice(0, 20).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.type}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {activity.data?.country || 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}