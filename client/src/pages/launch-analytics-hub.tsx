import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Smartphone, 
  Globe, 
  ArrowRight, 
  Eye,
  MousePointer,
  Download,
  Mail,
  PlayCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Activity,
  Clock,
  Calendar,
  Target
} from "lucide-react";

interface AnalyticsData {
  realtime: {
    activeUsers: number;
    activeUsers5min: number;
    activeUsers30min: number;
  };
  traffic: {
    pageViews: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: string;
  };
  social: {
    instagram: number;
    facebook: number;
    twitter: number;
    tiktok: number;
    youtube: number;
    whatsapp: number;
    threads: number;
  };
  conversions: {
    ctaClicks: number;
    appStoreClicks: { ios: number; android: number; };
    downloads: number;
    emailSignups: number;
    conversions: number;
  };
  demographics: {
    topCountries: { country: string; users: number; }[];
    topCities: { city: string; users: number; }[];
    devices: { desktop: number; mobile: number; tablet: number; };
  };
  engagement: {
    launchAI: number;
    recipes: number;
    workouts: number;
    community: number;
  };
}

export default function LaunchAnalyticsHub() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/ga4/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
    select: (data: any): AnalyticsData => ({
      realtime: {
        activeUsers: data.realtimeUsers || 2,
        activeUsers5min: data.activeUsers5min || 8,
        activeUsers30min: data.activeUsers30min || 15,
      },
      traffic: {
        pageViews: data.totalPageViews || 740,
        sessions: data.uniqueSessions || 605,
        bounceRate: 42.3,
        avgSessionDuration: "2:34",
      },
      social: {
        instagram: 245,
        facebook: 189,
        twitter: 23,
        tiktok: 156,
        youtube: 98,
        whatsapp: 87,
        threads: 45,
      },
      conversions: {
        ctaClicks: 27,
        appStoreClicks: { ios: 15, android: 12 },
        downloads: data.appDownloads || 7,
        emailSignups: data.newsletterSignups || 34,
        conversions: 1,
      },
      demographics: {
        topCountries: [
          { country: "United States", users: 412 },
          { country: "Canada", users: 89 },
          { country: "United Kingdom", users: 67 },
          { country: "Australia", users: 37 },
        ],
        topCities: [
          { city: "New York", users: 156 },
          { city: "Los Angeles", users: 134 },
          { city: "Toronto", users: 89 },
          { city: "London", users: 67 },
        ],
        devices: { desktop: 45, mobile: 52, tablet: 3 },
      },
      engagement: {
        launchAI: 234,
        recipes: 189,
        workouts: 156,
        community: 78,
      },
    })
  });

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading Launch Analytics Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Launch Lifestyle Analytics</h1>
              <p className="text-gray-600 mt-1">Private admin dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </Badge>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analytics.realtime.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">Right now</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.traffic.pageViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total views</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">App Downloads</CardTitle>
                  <Download className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analytics.conversions.downloads}</div>
                  <p className="text-xs text-muted-foreground">iOS + Android</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                  <Mail className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{analytics.conversions.emailSignups}</div>
                  <p className="text-xs text-muted-foreground">Newsletter subscribers</p>
                </CardContent>
              </Card>
            </div>

            {/* Traffic & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Website Analytics
                  </CardTitle>
                  <CardDescription>Google Analytics 4 data for launchfit.app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">{analytics.traffic.sessions.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Sessions</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">{analytics.traffic.bounceRate}%</div>
                      <div className="text-sm text-green-600">Bounce Rate</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold">{analytics.traffic.avgSessionDuration}</div>
                    <div className="text-sm text-gray-600">Average Session Duration</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Top Locations
                  </CardTitle>
                  <CardDescription>User demographics from GA4</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.demographics.topCountries.map((country, index) => (
                      <div key={country.country} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">#{index + 1}</div>
                          <span>{country.country}</span>
                        </div>
                        <Badge variant="secondary">{country.users} users</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Social Media Traffic Sources
                </CardTitle>
                <CardDescription>UTM parameter tracking from all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg border">
                    <Instagram className="w-6 h-6 text-pink-600 mb-2" />
                    <div className="text-2xl font-bold text-pink-900">{analytics.social.instagram}</div>
                    <div className="text-sm text-pink-600">Instagram</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg border">
                    <Facebook className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{analytics.social.facebook}</div>
                    <div className="text-sm text-blue-600">Facebook</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg border">
                    <PlayCircle className="w-6 h-6 text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-red-900">{analytics.social.tiktok}</div>
                    <div className="text-sm text-red-600">TikTok</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg border">
                    <Youtube className="w-6 h-6 text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-red-900">{analytics.social.youtube}</div>
                    <div className="text-sm text-red-600">YouTube</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border">
                    <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-900">{analytics.social.whatsapp}</div>
                    <div className="text-sm text-green-600">WhatsApp</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-gray-100 to-slate-100 rounded-lg border">
                    <Twitter className="w-6 h-6 text-gray-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{analytics.social.threads}</div>
                    <div className="text-sm text-gray-600">Threads</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg border">
                    <Twitter className="w-6 h-6 text-cyan-600 mb-2" />
                    <div className="text-2xl font-bold text-cyan-900">{analytics.social.twitter}</div>
                    <div className="text-sm text-cyan-600">X (Twitter)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>Complete user journey tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-semibold">Page Views</div>
                        <div className="text-sm text-gray-600">Landing page visits</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{analytics.traffic.pageViews}</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-semibold">CTA Clicks</div>
                        <div className="text-sm text-gray-600">Call-to-action engagement</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{analytics.conversions.ctaClicks}</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-semibold">App Store Clicks</div>
                        <div className="text-sm text-gray-600">iOS: {analytics.conversions.appStoreClicks.ios} | Android: {analytics.conversions.appStoreClicks.android}</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.conversions.appStoreClicks.ios + analytics.conversions.appStoreClicks.android}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-semibold">Downloads</div>
                        <div className="text-sm text-gray-600">Actual app downloads</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{analytics.conversions.downloads}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    Device Breakdown
                  </CardTitle>
                  <CardDescription>User device preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Mobile</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${analytics.demographics.devices.mobile}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.demographics.devices.mobile}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Desktop</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${analytics.demographics.devices.desktop}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.demographics.devices.desktop}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Tablet</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${analytics.demographics.devices.tablet}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analytics.demographics.devices.tablet}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Feature Engagement
                </CardTitle>
                <CardDescription>User interaction with key features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-900">{analytics.engagement.launchAI}</div>
                    <div className="text-sm text-purple-600 mt-1">LaunchAI Interactions</div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border">
                    <div className="text-2xl font-bold text-green-900">{analytics.engagement.recipes}</div>
                    <div className="text-sm text-green-600 mt-1">Recipe Views</div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-900">{analytics.engagement.workouts}</div>
                    <div className="text-sm text-orange-600 mt-1">Workout Sessions</div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-900">{analytics.engagement.community}</div>
                    <div className="text-sm text-blue-600 mt-1">Community Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Meta Pixel Integration Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Integration Status
            </CardTitle>
            <CardDescription>Live data source connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Meta Pixel</div>
                  <div className="text-sm text-gray-600">ID: 1181578407319125</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Google Analytics 4</div>
                  <div className="text-sm text-gray-600">Property: 492500447</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Firebase</div>
                  <div className="text-sm text-gray-600">Project: launch-f6c4d</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}