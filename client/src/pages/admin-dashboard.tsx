import { useState } from "react";
import { Youtube, BarChart3, Users, Clock, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { connectToYouTube, youtubeData, isConnected, disconnect } = useGoogleAuth();

  // Simple admin authentication
  const handleAdminLogin = () => {
    if (adminKey === "LAUNCH2024") { // You can change this password
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin key");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <BarChart3 className="h-6 w-6" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Enter admin key to access analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <Button 
              onClick={handleAdminLogin}
              className="w-full"
            >
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Launch Lifestyle Analytics</h1>
            <p className="text-muted-foreground">Private admin dashboard</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        {/* YouTube Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube Analytics
            </CardTitle>
            <CardDescription>
              Connect your YouTube channel to view real-time analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center py-8">
                <Youtube className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect YouTube Channel</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in with your YouTube account to access channel analytics
                </p>
                <Button onClick={connectToYouTube} className="gap-2">
                  <Youtube className="h-4 w-4" />
                  Connect YouTube Account
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      YouTube Connected
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={disconnect}>
                    Disconnect
                  </Button>
                </div>

                {/* Analytics Grid */}
                {youtubeData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Subscribers</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          {youtubeData.subscriberCount?.toLocaleString() || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Total Views</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          {youtubeData.viewCount?.toLocaleString() || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Videos</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          {youtubeData.videoCount?.toLocaleString() || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Watch Time</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          {youtubeData.watchTimeHours ? `${youtubeData.watchTimeHours.toLocaleString()}h` : 'N/A'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Recent Videos */}
                {youtubeData?.recentVideos && youtubeData.recentVideos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Videos Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {youtubeData.recentVideos.map((video: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1">{video.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {video.publishedAt && new Date(video.publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{video.viewCount?.toLocaleString() || '0'} views</p>
                              <p className="text-sm text-muted-foreground">{video.likeCount?.toLocaleString() || '0'} likes</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Google Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Website Analytics
            </CardTitle>
            <CardDescription>
              Google Analytics data for launchfit.app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Google Analytics Integration</h3>
              <p className="text-muted-foreground mb-4">
                View website traffic, user behavior, and conversion metrics
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}