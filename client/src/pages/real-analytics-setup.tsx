import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink, AlertTriangle } from "lucide-react";

export default function RealAnalyticsSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Analytics Integration Guide
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Step-by-step setup for authentic data tracking across all platforms
          </p>
        </div>

        {/* Current Status */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Current System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-4">
              All current social media metrics are placeholder data. To get real analytics, you need to complete the integrations below.
            </p>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Meta Business Suite */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Meta Business Suite</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Achievable
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Platforms:</strong> Instagram, Facebook, WhatsApp Business
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Data Available:</strong> Followers, engagement, reach, messages, response rates
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Setup Required:</strong> Meta Business API Access Token
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Setup Meta Business API
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Google Services */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Google Services</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Achievable
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Platforms:</strong> Google Analytics, YouTube, Gmail
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Data Available:</strong> Website traffic, video analytics, email campaigns
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Setup Required:</strong> OAuth2 Service Account
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Setup Google Cloud OAuth
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SendGrid */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SendGrid Email</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Data Available:</strong> Open rates, click rates, bounce rates
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> API key already configured
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Already Connected
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Analytics */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Launch Website</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Data Available:</strong> Page views, user interactions, conversions
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> Currently tracking real visitor data
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Currently Active
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Twitter/X */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Twitter/X</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />
                  Expensive
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Cost:</strong> $100+/month minimum
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Alternative:</strong> Manual data entry from native analytics
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="https://developer.twitter.com/en/portal/petition/essential/basic-info" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Twitter API Pricing
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TikTok */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>TikTok</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />
                  Enterprise Only
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Requirements:</strong> Business verification + API approval
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Alternative:</strong> Manual data entry from TikTok Pro dashboard
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    TikTok Developer Portal
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Implementation Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Implementation Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Meta Business API Setup</h4>
                  <p className="text-sm text-gray-600">Connects Instagram, Facebook, and WhatsApp - covers your largest social presence</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Google OAuth2 Setup</h4>
                  <p className="text-sm text-gray-600">Enables Google Analytics, YouTube, and Gmail campaign tracking</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Manual Data Dashboard</h4>
                  <p className="text-sm text-gray-600">Create input forms for platforms without APIs (Twitter, TikTok, Threads)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Ready to Start?</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="mb-4">
              Once you complete the Meta Business API setup, I can integrate real Instagram, Facebook, and WhatsApp data into your Launch Hub dashboard.
            </p>
            <p className="text-sm">
              The process takes about 30 minutes and requires business verification with Meta.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}