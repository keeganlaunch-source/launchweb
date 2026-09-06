import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, TrendingUp, TrendingDown, Activity, Smartphone } from "lucide-react";

interface SubscriberMetrics {
  overview: {
    totalSubscribers: number;
    activeSubscribers: number;
    totalMonthlyRevenue: string;
    totalLifetimeRevenue: string;
    churnRate: string;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  breakdown: {
    subscriptionTypes: Record<string, number>;
    platforms: Record<string, number>;
    sources: Record<string, number>;
  };
  trends: {
    newSubscribersThisWeek: number;
    newSubscribersThisMonth: number;
    churnedThisMonth: number;
  };
}

export default function SubscriberAnalytics() {
  const { data: metrics, isLoading } = useQuery<SubscriberMetrics>({
    queryKey: ['/api/admin/subscribers'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading subscriber data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No subscriber data available yet. Data will appear when subscribers are tracked.
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeRate = metrics.overview.totalSubscribers > 0 
    ? ((metrics.overview.activeSubscribers / metrics.overview.totalSubscribers) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {activeRate}% of total ({metrics.overview.totalSubscribers})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.overview.totalMonthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime: ${metrics.overview.totalLifetimeRevenue}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            {parseFloat(metrics.overview.churnRate) > 5 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.trends.churnedThisMonth} churned this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.monthlyActiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Weekly: {metrics.overview.weeklyActiveUsers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Subscription Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Types</CardTitle>
            <CardDescription>Distribution of subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.breakdown.subscriptionTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'premium' ? 'bg-yellow-500' :
                      type === 'pro' ? 'bg-purple-500' : 'bg-green-500'
                    }`} />
                    <span className="capitalize font-medium">{type}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Distribution</CardTitle>
            <CardDescription>Where subscribers are using the app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.breakdown.platforms).map(([platform, count]) => (
                <div key={platform} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <span className="capitalize font-medium">{platform}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscriber Sources</CardTitle>
            <CardDescription>How subscribers found your app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.breakdown.sources).map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="capitalize font-medium">{source}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Growth Metrics</CardTitle>
          <CardDescription>Subscriber acquisition and retention trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {metrics.trends.newSubscribersThisWeek}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">New This Week</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {metrics.trends.newSubscribersThisMonth}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">New This Month</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {metrics.trends.churnedThisMonth}
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">Churned This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscriber Tracking Status</CardTitle>
          <CardDescription>How to start tracking active subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                To track active subscribers, implement these in your mobile app:
              </h4>
              <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                <p>• Send subscriber data when users sign up for premium plans</p>
                <p>• Track user activity (logins, workouts, content views)</p>
                <p>• Update subscription status changes (upgrades, cancellations)</p>
                <p>• Monitor app usage to identify active vs inactive users</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                API Endpoints Ready:
              </h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• POST /api/subscribers - Create/update subscriber</p>
                <p>• POST /api/subscriber-activity - Track user activity</p>
                <p>• Webhooks ready for app store subscription events</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}