import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UTMLinkGenerator() {
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const { toast } = useToast();

  const socialPlatforms = [
    { value: "facebook", label: "Facebook", medium: "social" },
    { value: "instagram", label: "Instagram", medium: "social" },
    { value: "tiktok", label: "TikTok", medium: "social" },
    { value: "youtube", label: "YouTube", medium: "social" },
    { value: "whatsapp", label: "WhatsApp", medium: "social" },
    { value: "twitter", label: "Twitter", medium: "social" },
    { value: "linkedin", label: "LinkedIn", medium: "social" }
  ];

  const campaignTypes = [
    { value: "app_launch", label: "App Launch" },
    { value: "newsletter_signup", label: "Newsletter Signup" },
    { value: "fitness_tips", label: "Fitness Tips" },
    { value: "workout_challenge", label: "Workout Challenge" },
    { value: "transformation", label: "Transformation Story" },
    { value: "free_guide", label: "Free Guide" }
  ];

  const generateUrl = () => {
    if (!source || !campaign) {
      toast({
        title: "Missing Information",
        description: "Please select a platform and campaign type",
        variant: "destructive"
      });
      return;
    }

    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', medium || 'social');
    url.searchParams.set('utm_campaign', campaign);
    url.searchParams.set('utm_content', `${source}_${campaign}`);
    
    setGeneratedUrl(url.toString());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Copied!",
        description: "Trackable link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const openPreview = () => {
    window.open(generatedUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Social Media Link Generator
        </CardTitle>
        <CardDescription>
          Generate trackable links for your social media posts to monitor traffic sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Social Platform</Label>
            <Select onValueChange={(value) => {
              setSource(value);
              const platform = socialPlatforms.find(p => p.value === value);
              if (platform) setMedium(platform.medium);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign Type</Label>
            <Select onValueChange={setCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map(campaign => (
                  <SelectItem key={campaign.value} value={campaign.value}>
                    {campaign.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseUrl">Destination URL</Label>
          <Input
            id="baseUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-site.com"
          />
        </div>

        <Button onClick={generateUrl} className="w-full bg-[#FFD600] hover:bg-[#E6C100] text-black">
          Generate Trackable Link
        </Button>

        {generatedUrl && (
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Label>Your Trackable Link:</Label>
            <div className="flex items-center gap-2">
              <Input value={generatedUrl} readOnly className="flex-1" />
              <Button size="sm" onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={openPreview} variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use this link in your {source} posts to track clicks and conversions automatically.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pro Tips:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use different campaign names for different types of posts</li>
            <li>• Add these links to your Instagram bio, TikTok bio, and YouTube descriptions</li>
            <li>• Share directly in WhatsApp messages for accurate tracking</li>
            <li>• Track which platforms drive the most app downloads</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}