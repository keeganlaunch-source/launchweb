import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Play, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Target,
  Activity,
  BarChart3,
  Globe,
  Smartphone,
  Clock,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  realTimeUsers: number;
  totalPageViews: number;
  emailSubscribers: number;
  youtubeViews: number;
  socialMediaClicks: number;
  launchAIInteractions: number;
  avgSessionDuration: string;
  bounceRate: number;
  conversionRate: number;
  topTrafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  revenueMetrics: {
    monthlyRevenue: number;
    weeklyGrowth: number;
    totalSubscriptions: number;
  };
  userBehavior: {
    mobileUsers: number;
    desktopUsers: number;
    avgTimeOnPage: string;
    returningUsers: number;
  };
  launchAIMetrics: {
    totalConversations: number;
    avgResponseTime: string;
    userSatisfaction: number;
    topCategories: string[];
  };
}

export default function LiveAnalyticsDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: analytics, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/live-dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
              <p className="text-gray-400">Loading live analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">Launch Lifestyle Analytics</h1>
            <p className="text-gray-400">Real-time business intelligence dashboard</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-400 mb-2">
              <Activity className="w-4 h-4 mr-1" />
              Live Data
            </Badge>
            <p className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="mt-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Real-Time Users</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.realTimeUsers}</div>
              <p className="text-xs text-green-400">
                +12% from last hour
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.totalPageViews.toLocaleString()}</div>
              <p className="text-xs text-blue-400">
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Email Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.emailSubscribers.toLocaleString()}</div>
              <p className="text-xs text-purple-400">
                +15% this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Launch AI Interactions</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.launchAIInteractions.toLocaleString()}</div>
              <p className="text-xs text-yellow-400">
                +23% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue and Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Revenue Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Revenue</span>
                <span className="text-2xl font-bold text-green-400">
                  R{analytics.revenueMetrics.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Weekly Growth</span>
                <span className="text-lg font-semibold text-green-400">
                  +{analytics.revenueMetrics.weeklyGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Subscriptions</span>
                <span className="text-lg font-semibold text-white">
                  {analytics.revenueMetrics.totalSubscriptions}
                </span>
              </div>
              <Progress 
                value={analytics.revenueMetrics.weeklyGrowth} 
                className="h-2 bg-gray-700"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg Session Duration</span>
                <span className="text-lg font-semibold text-white">
                  {analytics.avgSessionDuration}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Bounce Rate</span>
                <span className="text-lg font-semibold text-orange-400">
                  {analytics.bounceRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Conversion Rate</span>
                <span className="text-lg font-semibold text-green-400">
                  {analytics.conversionRate}%
                </span>
              </div>
              <Progress 
                value={analytics.conversionRate} 
                className="h-2 bg-gray-700"
              />
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources and User Behavior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                Top Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topTrafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {source.source}
                      </Badge>
                      <span className="text-sm text-gray-300">{source.visitors} visitors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={source.percentage} 
                        className="h-2 w-16 bg-gray-700"
                      />
                      <span className="text-sm text-white">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-pink-400" />
                User Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mobile Users</span>
                <span className="text-lg font-semibold text-pink-400">
                  {analytics.userBehavior.mobileUsers}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Desktop Users</span>
                <span className="text-lg font-semibold text-blue-400">
                  {analytics.userBehavior.desktopUsers}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg Time on Page</span>
                <span className="text-lg font-semibold text-white">
                  {analytics.userBehavior.avgTimeOnPage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Returning Users</span>
                <span className="text-lg font-semibold text-green-400">
                  {analytics.userBehavior.returningUsers}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launch AI Analytics */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Launch AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {analytics.launchAIMetrics.totalConversations.toLocaleString()}
                </div>
                <p className="text-sm text-gray-400">Total Conversations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {analytics.launchAIMetrics.avgResponseTime}
                </div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {analytics.launchAIMetrics.userSatisfaction}/5
                </div>
                <p className="text-sm text-gray-400">User Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {analytics.launchAIMetrics.topCategories.slice(0, 3).map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Top Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Play className="w-5 h-5 mr-2 text-red-400" />
                YouTube
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {analytics.youtubeViews.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">Total Views</p>
              <div className="mt-4">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  +18% this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <MousePointer className="w-5 h-5 mr-2 text-indigo-400" />
                Social Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {analytics.socialMediaClicks.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">From All Platforms</p>
              <div className="mt-4">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Instagram leading
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                Overall Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400 mb-2">
                +24%
              </div>
              <p className="text-sm text-gray-400">Monthly Growth Rate</p>
              <div className="mt-4">
                <Progress value={76} className="h-2 bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}