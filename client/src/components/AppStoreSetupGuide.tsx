import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Smartphone, Download, BarChart3, Settings, Key, Webhook } from "lucide-react";

export default function AppStoreSetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Complete App Store Analytics Setup Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to track the complete customer journey from social media to app subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: App Store Connect */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
                iOS App Store Connect Analytics
              </h3>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Apple</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Log into <a href="https://appstoreconnect.apple.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Store Connect</a></li>
                  <li>Select your app → Analytics → App Downloads</li>
                  <li>Enable "Detailed Analytics" in App Store Connect settings</li>
                  <li>Go to Analytics → Sources to see traffic attribution</li>
                  <li>Set up Apple Search Ads Attribution for precise tracking</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <h4 className="font-semibold mb-2">What You'll Track:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>App downloads by traffic source</li>
                  <li>Subscription conversions and revenue</li>
                  <li>User acquisition costs by platform</li>
                  <li>Retention rates and lifetime value</li>
                </ul>
              </div>
              
              <Button asChild className="w-full">
                <a href="https://appstoreconnect.apple.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open App Store Connect
                </a>
              </Button>
            </div>
          </div>

          {/* Step 2: Google Play Console */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
                Google Play Console Analytics
              </h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Google</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Access <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Google Play Console</a></li>
                  <li>Select your app → Statistics → Overview</li>
                  <li>Navigate to Acquisition → User acquisition</li>
                  <li>Enable Play Install Referrer API in your app</li>
                  <li>Set up UTM tracking for campaign attribution</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <h4 className="font-semibold mb-2">Integration Required:</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Play Install Referrer API:</strong> Add to your Android app to track install sources</p>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">
                    implementation 'com.android.installreferrer:installreferrer:2.2'
                  </code>
                </div>
              </div>
              
              <Button asChild className="w-full">
                <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Play Console
                </a>
              </Button>
            </div>
          </div>

          {/* Step 3: Mobile Attribution SDKs */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
                Mobile Attribution SDKs
              </h3>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Cross-Platform</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Firebase Analytics */}
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Firebase Analytics (Free)
                </h4>
                <div className="text-sm space-y-2">
                  <p>Best for: Basic attribution and user journey tracking</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Create Firebase project</li>
                    <li>Add Firebase SDK to your app</li>
                    <li>Configure conversion events</li>
                    <li>Link Google Ads for attribution</li>
                  </ol>
                  <Button asChild size="sm" className="w-full mt-2">
                    <a href="https://firebase.google.com/docs/analytics" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Firebase Setup
                    </a>
                  </Button>
                </div>
              </div>

              {/* Branch.io */}
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Branch.io (Premium)
                </h4>
                <div className="text-sm space-y-2">
                  <p>Best for: Deep linking with precise attribution</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Sign up for Branch account</li>
                    <li>Integrate Branch SDK</li>
                    <li>Create Branch links for social media</li>
                    <li>Configure attribution windows</li>
                  </ol>
                  <Button asChild size="sm" className="w-full mt-2">
                    <a href="https://branch.io" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Branch.io Setup
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Webhook Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm">4</div>
                Connect Data to Your Dashboard
              </h3>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Integration</Badge>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded space-y-3">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Webhook Configuration
              </h4>
              
              <div className="text-sm space-y-2">
                <p>Set up webhooks to send app store data back to your dashboard:</p>
                
                <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                  <p className="font-medium">Your Webhook URL:</p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded block">
                    {window.location.origin}/api/webhooks/app-store-data
                  </code>
                </div>
                
                <div className="space-y-1">
                  <p><strong>Firebase:</strong> Configure Cloud Functions to send conversion events</p>
                  <p><strong>Branch.io:</strong> Set up Data Export to your webhook endpoint</p>
                  <p><strong>App Store/Play Store:</strong> Use Server-to-Server notifications</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h5 className="font-semibold mb-2">Implementation Roadmap:</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Start with Firebase Analytics (easiest setup)</li>
                  <li>Configure App Store Connect and Play Console</li>
                  <li>Add Branch.io for advanced attribution (optional)</li>
                  <li>Set up webhooks to sync data to this dashboard</li>
                  <li>Test end-to-end tracking with your social media campaigns</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Expected Setup Timeline
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Week 1: Store Analytics</p>
                <p className="text-gray-600 dark:text-gray-400">Set up App Store Connect and Play Console analytics</p>
              </div>
              <div>
                <p className="font-medium">Week 2: SDK Integration</p>
                <p className="text-gray-600 dark:text-gray-400">Implement Firebase or Branch.io in your mobile app</p>
              </div>
              <div>
                <p className="font-medium">Week 3: Webhooks</p>
                <p className="text-gray-600 dark:text-gray-400">Connect attribution data back to this dashboard</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}