import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Play, 
  Eye, 
  Clock, 
  Users, 
  TrendingUp, 
  Youtube,
  BarChart3,
  Calendar,
  Globe
} from 'lucide-react';

interface YouTubeChannel {
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

interface YouTubeVideo {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

interface AnalyticsData {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  analytics: {
    daily: any[];
    videos: any[];
    headers: {
      daily: any[];
      videos: any[];
    };
  };
}

export default function YouTubeAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth/google/user'],
    retry: false,
  });

  // Fetch YouTube analytics data
  const { data: analyticsData, isLoading: analyticsLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/youtube/analytics'],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (authData?.authenticated) {
      setIsAuthenticated(true);
    }
  }, [authData]);

  const handleSignIn = () => {
    window.location.href = '/api/auth/google';
  };

  const handleSignOut = async () => {
    try {
      await apiRequest('/api/auth/google/signout', 'POST');
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Youtube className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">YouTube Analytics</h1>
            <p className="text-gray-400 mb-8">
              Connect your YouTube account to view detailed analytics for your fitness coaching channel.
            </p>
            <Button 
              onClick={handleSignIn}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
            >
              <Youtube className="h-5 w-5 mr-2" />
              Connect YouTube Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading YouTube analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">YouTube Analytics</h1>
            <p className="text-gray-400">Real-time insights for your fitness coaching channel</p>
          </div>
          <div className="flex items-center gap-4">
            {authData?.user && (
              <div className="flex items-center gap-2">
                <img 
                  src={authData.user.picture} 
                  alt={authData.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{authData.user.name}</span>
              </div>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Channel Overview */}
            {analyticsData.channel && (
              <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Youtube className="h-6 w-6 text-red-500" />
                    Channel Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-6">
                    <img 
                      src={analyticsData.channel.snippet.thumbnails.default.url}
                      alt="Channel thumbnail"
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {analyticsData.channel.snippet.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {analyticsData.channel.snippet.description.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {formatNumber(analyticsData.channel.statistics.subscriberCount)}
                      </div>
                      <div className="text-gray-400 text-sm">Subscribers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {formatNumber(analyticsData.channel.statistics.viewCount)}
                      </div>
                      <div className="text-gray-400 text-sm">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {analyticsData.channel.statistics.videoCount}
                      </div>
                      <div className="text-gray-400 text-sm">Videos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analytics Summary */}
            {analyticsData.analytics?.daily && analyticsData.analytics.daily.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Recent Views</p>
                        <p className="text-2xl font-bold text-white">
                          {analyticsData.analytics.daily.reduce((sum, day) => sum + (day[1] || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Impressions</p>
                        <p className="text-2xl font-bold text-white">
                          {analyticsData.analytics.daily.reduce((sum, day) => sum + (day[2] || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Watch Time</p>
                        <p className="text-2xl font-bold text-white">
                          {Math.round(analyticsData.analytics.daily.reduce((sum, day) => sum + (day[4] || 0), 0) / 60).toLocaleString()}h
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Avg View %</p>
                        <p className="text-2xl font-bold text-white">
                          {(analyticsData.analytics.daily.reduce((sum, day) => sum + (day[5] || 0), 0) / analyticsData.analytics.daily.length).toFixed(1)}%
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Top Videos */}
            {analyticsData.videos && analyticsData.videos.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {analyticsData.videos.slice(0, 10).map((video, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg">
                          <img 
                            src={video.snippet.thumbnails.medium.url}
                            alt={video.snippet.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">
                              {video.snippet.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(video.statistics.viewCount)} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {formatNumber(video.statistics.likeCount)} likes
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(video.snippet.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <Button onClick={() => refetch()} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}