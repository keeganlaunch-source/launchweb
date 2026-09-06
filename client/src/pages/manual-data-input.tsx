import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Upload, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SocialMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  weeklyGrowth: number;
}

export default function ManualDataInput() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [instagramData, setInstagramData] = useState({
    followers: '',
    posts: '',
    avgEngagement: '',
    weeklyGrowth: '',
    topPost: ''
  });

  const [facebookData, setFacebookData] = useState({
    followers: '',
    likes: '',
    reach: '',
    impressions: '',
    weeklyGrowth: '',
    topPost: ''
  });

  const [whatsappData, setWhatsappData] = useState({
    totalChats: '',
    activeChats: '',
    dailyMessages: '',
    responseRate: '',
    conversions: ''
  });

  const saveMetrics = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/manual-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save metrics');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Metrics Saved",
        description: "Your social media metrics have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/launch-hub/analytics'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save metrics. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveAll = () => {
    const allData = {
      instagram: {
        accountId: "1057498421730534",
        username: "launch_lifestyle",
        followers: parseInt(instagramData.followers) || 0,
        posts: parseInt(instagramData.posts) || 0,
        avgEngagementRate: parseFloat(instagramData.avgEngagement) || 0,
        weeklyGrowth: parseFloat(instagramData.weeklyGrowth) || 0,
        topPerformingContent: instagramData.topPost || "Recent posts"
      },
      facebook: {
        pageId: "461507487294269",
        pageName: "Launch",
        followers: parseInt(facebookData.followers) || 0,
        likes: parseInt(facebookData.likes) || 0,
        reach: parseInt(facebookData.reach) || 0,
        impressions: parseInt(facebookData.impressions) || 0,
        weeklyGrowth: parseFloat(facebookData.weeklyGrowth) || 0,
        topPerformingContent: facebookData.topPost || "Recent posts"
      },
      whatsapp: {
        accountId: "274678025737928",
        businessName: "Keegan Marsden",
        totalChats: parseInt(whatsappData.totalChats) || 0,
        activeChats: parseInt(whatsappData.activeChats) || 0,
        dailyMessages: parseInt(whatsappData.dailyMessages) || 0,
        responseRate: parseFloat(whatsappData.responseRate) || 0,
        conversions: parseInt(whatsappData.conversions) || 0
      }
    };

    saveMetrics.mutate(allData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manual Analytics Input
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Enter your real social media metrics from native analytics dashboards
          </p>
          <Badge variant="outline" className="px-4 py-2">
            Updates your Launch Hub with authentic data
          </Badge>
        </div>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">How to Get Your Real Data</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Instagram</h4>
                <p>Go to Instagram → Professional Dashboard → Insights</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Facebook</h4>
                <p>Go to Meta Business Suite → Insights → Page Performance</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">WhatsApp Business</h4>
                <p>Go to WhatsApp Business → Settings → Business Tools → Statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Input Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Instagram Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Instagram className="w-5 h-5 mr-2 text-pink-600" />
                Instagram Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ig-followers">Followers</Label>
                <Input
                  id="ig-followers"
                  type="number"
                  placeholder="e.g. 772"
                  value={instagramData.followers}
                  onChange={(e) => setInstagramData(prev => ({...prev, followers: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="ig-posts">Total Posts</Label>
                <Input
                  id="ig-posts"
                  type="number"
                  placeholder="e.g. 42"
                  value={instagramData.posts}
                  onChange={(e) => setInstagramData(prev => ({...prev, posts: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="ig-engagement">Avg Engagement Rate (%)</Label>
                <Input
                  id="ig-engagement"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 4.2"
                  value={instagramData.avgEngagement}
                  onChange={(e) => setInstagramData(prev => ({...prev, avgEngagement: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="ig-growth">Weekly Growth (%)</Label>
                <Input
                  id="ig-growth"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1.8"
                  value={instagramData.weeklyGrowth}
                  onChange={(e) => setInstagramData(prev => ({...prev, weeklyGrowth: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="ig-top-post">Top Performing Content</Label>
                <Textarea
                  id="ig-top-post"
                  placeholder="Describe your best performing post"
                  value={instagramData.topPost}
                  onChange={(e) => setInstagramData(prev => ({...prev, topPost: e.target.value}))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Facebook Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                Facebook Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fb-followers">Page Followers</Label>
                <Input
                  id="fb-followers"
                  type="number"
                  placeholder="e.g. 2054"
                  value={facebookData.followers}
                  onChange={(e) => setFacebookData(prev => ({...prev, followers: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="fb-likes">Page Likes</Label>
                <Input
                  id="fb-likes"
                  type="number"
                  placeholder="e.g. 2054"
                  value={facebookData.likes}
                  onChange={(e) => setFacebookData(prev => ({...prev, likes: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="fb-reach">Weekly Reach</Label>
                <Input
                  id="fb-reach"
                  type="number"
                  placeholder="e.g. 19800"
                  value={facebookData.reach}
                  onChange={(e) => setFacebookData(prev => ({...prev, reach: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="fb-impressions">Weekly Impressions</Label>
                <Input
                  id="fb-impressions"
                  type="number"
                  placeholder="e.g. 45000"
                  value={facebookData.impressions}
                  onChange={(e) => setFacebookData(prev => ({...prev, impressions: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="fb-growth">Weekly Growth (%)</Label>
                <Input
                  id="fb-growth"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.1"
                  value={facebookData.weeklyGrowth}
                  onChange={(e) => setFacebookData(prev => ({...prev, weeklyGrowth: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="fb-top-post">Top Performing Content</Label>
                <Textarea
                  id="fb-top-post"
                  placeholder="Describe your best performing post"
                  value={facebookData.topPost}
                  onChange={(e) => setFacebookData(prev => ({...prev, topPost: e.target.value}))}
                />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Input */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-green-600 rounded"></div>
                WhatsApp Business Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wa-total-chats">Total Chats</Label>
                  <Input
                    id="wa-total-chats"
                    type="number"
                    placeholder="e.g. 156"
                    value={whatsappData.totalChats}
                    onChange={(e) => setWhatsappData(prev => ({...prev, totalChats: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="wa-active-chats">Active Chats</Label>
                  <Input
                    id="wa-active-chats"
                    type="number"
                    placeholder="e.g. 23"
                    value={whatsappData.activeChats}
                    onChange={(e) => setWhatsappData(prev => ({...prev, activeChats: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="wa-daily-messages">Daily Messages</Label>
                  <Input
                    id="wa-daily-messages"
                    type="number"
                    placeholder="e.g. 47"
                    value={whatsappData.dailyMessages}
                    onChange={(e) => setWhatsappData(prev => ({...prev, dailyMessages: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="wa-response-rate">Response Rate (%)</Label>
                  <Input
                    id="wa-response-rate"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 94.2"
                    value={whatsappData.responseRate}
                    onChange={(e) => setWhatsappData(prev => ({...prev, responseRate: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="wa-conversions">Conversions</Label>
                  <Input
                    id="wa-conversions"
                    type="number"
                    placeholder="e.g. 12"
                    value={whatsappData.conversions}
                    onChange={(e) => setWhatsappData(prev => ({...prev, conversions: e.target.value}))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSaveAll}
            disabled={saveMetrics.isPending}
            size="lg"
            className="px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMetrics.isPending ? 'Saving...' : 'Save All Metrics'}
          </Button>
        </div>

      </div>
    </div>
  );
}