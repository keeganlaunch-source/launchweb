import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Copy, Code, Settings, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ImplementationGuide() {
  const [copiedCode, setCopiedCode] = useState<string>("");
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(label);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`
      });
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually",
        variant: "destructive"
      });
    }
  };

  const webhookUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Step-by-Step Implementation Guide
        </CardTitle>
        <CardDescription>
          Complete setup instructions with copy-paste code for tracking app downloads and subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="app-store" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="app-store">App Store Analytics</TabsTrigger>
            <TabsTrigger value="firebase">Firebase Setup</TabsTrigger>
            <TabsTrigger value="webhooks">Webhook Integration</TabsTrigger>
          </TabsList>

          {/* App Store Analytics Tab */}
          <TabsContent value="app-store" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* iOS Setup */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">iOS App Store Connect</h3>
                  <Badge className="bg-blue-100 text-blue-800">Apple</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                    <h4 className="font-semibold mb-2">Step 1: Enable Analytics</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to <a href="https://appstoreconnect.apple.com" target="_blank" className="text-blue-600 hover:underline">App Store Connect</a></li>
                      <li>Select your app → App Analytics</li>
                      <li>Enable "Analytics" in your app settings</li>
                      <li>Navigate to Sources tab for attribution data</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-semibold mb-2">Step 2: Server Notifications</h4>
                    <p className="text-sm mb-2">Configure webhook URL for real-time updates:</p>
                    <div className="bg-white dark:bg-gray-700 p-2 rounded border text-xs font-mono">
                      {webhookUrl}/api/webhooks/app-store-data
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => copyToClipboard(`${webhookUrl}/api/webhooks/app-store-data`, "iOS Webhook URL")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedCode === "iOS Webhook URL" ? "Copied!" : "Copy URL"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Android Setup */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Google Play Console</h3>
                  <Badge className="bg-green-100 text-green-800">Google</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                    <h4 className="font-semibold mb-2">Step 1: Enable Reports</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Access <a href="https://play.google.com/console" target="_blank" className="text-green-600 hover:underline">Play Console</a></li>
                      <li>Go to Statistics → Downloads</li>
                      <li>Enable detailed acquisition reports</li>
                      <li>Set up UTM parameter tracking</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-semibold mb-2">Step 2: Install Referrer API</h4>
                    <p className="text-sm mb-2">Add to your Android app's build.gradle:</p>
                    <div className="bg-white dark:bg-gray-700 p-2 rounded border text-xs font-mono">
                      implementation 'com.android.installreferrer:installreferrer:2.2'
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => copyToClipboard("implementation 'com.android.installreferrer:installreferrer:2.2'", "Android Dependency")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedCode === "Android Dependency" ? "Copied!" : "Copy Code"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Firebase Setup Tab */}
          <TabsContent value="firebase" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Firebase Analytics Setup
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">1. Create Firebase Project</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to <a href="https://console.firebase.google.com" target="_blank" className="text-orange-600 hover:underline">Firebase Console</a></li>
                      <li>Create new project or select existing</li>
                      <li>Enable Google Analytics</li>
                      <li>Add your iOS/Android apps</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">2. Install SDK</h4>
                    <p className="text-sm">For React Native:</p>
                    <div className="bg-white dark:bg-gray-700 p-2 rounded border text-xs font-mono">
                      npm install @react-native-firebase/analytics
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard("npm install @react-native-firebase/analytics", "Firebase Install")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedCode === "Firebase Install" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="font-semibold mb-3">3. Track Conversion Events</h4>
                <p className="text-sm mb-2">Add this code to track app downloads and subscriptions:</p>
                <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                  <pre className="text-xs font-mono overflow-x-auto">
{`import analytics from '@react-native-firebase/analytics';

// Track app install
await analytics().logEvent('app_install', {
  source: 'social_media',
  campaign: 'launch_fitness'
});

// Track subscription
await analytics().logEvent('purchase', {
  currency: 'USD',
  value: 9.99,
  item_name: 'Premium_Subscription'
});`}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`import analytics from '@react-native-firebase/analytics';

// Track app install
await analytics().logEvent('app_install', {
  source: 'social_media',
  campaign: 'launch_fitness'
});

// Track subscription
await analytics().logEvent('purchase', {
  currency: 'USD',
  value: 9.99,
  item_name: 'Premium_Subscription'
});`, "Firebase Tracking Code")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copiedCode === "Firebase Tracking Code" ? "Copied!" : "Copy Code"}
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <h4 className="font-semibold mb-2">4. Configure Data Export</h4>
                <p className="text-sm mb-2">Set up Cloud Functions to send data to your dashboard:</p>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Webhook URL:</strong></p>
                  <div className="bg-white dark:bg-gray-700 p-2 rounded border text-xs font-mono">
                    {webhookUrl}/api/webhooks/firebase-analytics
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(`${webhookUrl}/api/webhooks/firebase-analytics`, "Firebase Webhook URL")}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copiedCode === "Firebase Webhook URL" ? "Copied!" : "Copy URL"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Webhook Integration
                </h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <h4 className="font-semibold text-sm">App Store Data</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">iOS/Android downloads</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded block">
                        {webhookUrl}/api/webhooks/app-store-data
                      </code>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <h4 className="font-semibold text-sm">Firebase Analytics</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Conversion events</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded block">
                        {webhookUrl}/api/webhooks/firebase-analytics
                      </code>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <h4 className="font-semibold text-sm">Branch Attribution</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Deep link tracking</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded block">
                        {webhookUrl}/api/webhooks/branch-attribution
                      </code>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <h4 className="font-semibold mb-2">Test Your Webhooks</h4>
                    <p className="text-sm mb-3">Use this curl command to test webhook integration:</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                      <pre className="text-xs font-mono overflow-x-auto">
{`curl -X POST ${webhookUrl}/api/webhooks/app-store-data \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "ios",
    "eventType": "download",
    "transactionId": "test-123",
    "timestamp": "${new Date().toISOString()}"
  }'`}
                      </pre>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => copyToClipboard(`curl -X POST ${webhookUrl}/api/webhooks/app-store-data \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "ios",
    "eventType": "download",
    "transactionId": "test-123",
    "timestamp": "${new Date().toISOString()}"
  }'`, "Test Webhook Command")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedCode === "Test Webhook Command" ? "Copied!" : "Copy Test Command"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <h4 className="font-semibold mb-3">Implementation Timeline</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold text-green-700 dark:text-green-300">Week 1</p>
                    <p>Set up App Store Connect and Play Console analytics</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold text-green-700 dark:text-green-300">Week 2</p>
                    <p>Implement Firebase Analytics in your mobile app</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="font-semibold text-green-700 dark:text-green-300">Week 3</p>
                    <p>Configure webhooks and test complete tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}