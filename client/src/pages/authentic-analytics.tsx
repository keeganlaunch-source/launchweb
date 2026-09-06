import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Globe, MousePointer, Clock } from "lucide-react";

export default function AuthenticAnalytics() {
  const { data: realMetrics, isLoading } = useQuery({
    queryKey: ["/api/authentic-metrics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading authentic data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Authentic Launch Hub Analytics
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            100% Real Data - No Estimates or Placeholders
          </p>
          
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Only tracking actual website interactions
            </Badge>
          </div>
        </div>

        {/* Current Limitations */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Current Data Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Social Media Platforms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Instagram: Requires Meta Business API token</li>
                  <li>• Facebook: Requires Meta Business API token</li>
                  <li>• WhatsApp: Requires Business API credentials</li>
                  <li>• TikTok: Requires enterprise API access</li>
                  <li>• Twitter/X: Requires paid developer account</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analytics Platforms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Google Analytics: Requires OAuth2 setup</li>
                  <li>• Email campaigns: Need ESP integration</li>
                  <li>• YouTube: Requires channel authorization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-blue-600" />
                Website Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {realMetrics?.pageViews || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Actual visits to Launch Hub
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <MousePointer className="w-4 h-4 mr-2 text-green-600" />
                User Interactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {realMetrics?.interactions || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Button clicks and form submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Session Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {realMetrics?.avgSessionDuration || "0m"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average time on site
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Real Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {realMetrics?.recentActivity?.length > 0 ? (
              <div className="space-y-2">
                {realMetrics.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{activity.action}</span>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent activity recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Authentication Required */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              To Get Full Social Media Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="mb-4">
              For complete authentic data from your social media accounts, you need to provide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Meta Platforms</h4>
                <p>Access token from Meta Business Suite for Instagram and Facebook data</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Google Services</h4>
                <p>OAuth2 credentials for Google Analytics and YouTube data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}