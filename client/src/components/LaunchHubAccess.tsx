import { useState } from "react";
import { Rocket, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LaunchHubAccess() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "LaunchLifestyle2025!") {
      // Open the analytics hub in a new window
      const analyticsHubHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#111827">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="LAUNCH HUB">
    <title>LAUNCH HUB - Analytics Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
            color: white; 
            min-height: 100vh; 
        }
        .header { 
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%); 
            border-bottom: 1px solid #374151; 
            padding: 40px; 
            text-align: center;
        }
        .header h1 { 
            font-size: 3rem; 
            font-weight: 800; 
            margin: 0; 
            background: linear-gradient(135deg, #ffffff 0%, #9ca3af 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent;
        }
        .header p { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 1.2rem;
        }
        .content { 
            padding: 40px;
        }
        .status-bar { 
            background: rgba(31, 41, 55, 0.8); 
            border: 1px solid #374151; 
            border-radius: 12px; 
            padding: 16px; 
            margin-bottom: 24px; 
            font-size: 0.875rem; 
            color: #9ca3af;
        }
        .sync-status { 
            display: inline-block; 
            width: 8px; 
            height: 8px; 
            border-radius: 50%; 
            background: #10b981; 
            margin-right: 8px; 
            animation: pulse 2s infinite;
        }
        @keyframes pulse { 
            0%, 100% { opacity: 1; } 
            50% { opacity: 0.5; } 
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 32px; 
            margin-bottom: 40px;
        }
        .metric-card { 
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
            border: 1px solid #374151; 
            border-radius: 16px; 
            padding: 32px; 
            transition: all 0.3s ease; 
            position: relative; 
            overflow: hidden;
        }
        .metric-card:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
        }
        .metric-card::before { 
            content: ''; 
            position: absolute; 
            top: 0; 
            left: 0; 
            right: 0; 
            height: 4px; 
            background: var(--accent-color);
        }
        .metric-card.blue { --accent-color: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); }
        .metric-card.green { --accent-color: linear-gradient(135deg, #34d399 0%, #10b981 100%); }
        .metric-card.orange { --accent-color: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%); }
        .metric-card.purple { --accent-color: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); }
        .metric-card h3 { 
            font-size: 1.125rem; 
            font-weight: 600; 
            margin: 0 0 16px 0; 
            color: #e5e7eb;
        }
        .metric-value { 
            font-size: 3rem; 
            font-weight: 800; 
            margin: 16px 0; 
            line-height: 1;
        }
        .metric-value.blue { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-value.green { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-value.orange { background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-value.purple { background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-desc { 
            color: #9ca3af; 
            font-size: 0.875rem;
        }
        .controls { 
            display: flex; 
            gap: 16px; 
            margin-bottom: 32px; 
            flex-wrap: wrap;
        }
        .btn-control { 
            padding: 12px 24px; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600; 
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
            color: white;
        }
        .btn-control:hover { 
            transform: translateY(-1px); 
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .install-prompt { 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
            border: 1px solid #334155; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center;
        }
        .install-prompt h4 { 
            color: #60a5fa; 
            margin-bottom: 12px;
        }
        .install-prompt p { 
            color: #94a3b8; 
            font-size: 0.9rem;
        }
        @media (max-width: 768px) { 
            .header { padding: 24px; }
            .header h1 { font-size: 2rem; }
            .content { padding: 24px; }
            .metrics-grid { grid-template-columns: 1fr; gap: 20px; }
            .metric-card { padding: 24px; }
            .metric-value { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 LAUNCH HUB</h1>
        <p>Personal Analytics Dashboard</p>
    </div>
    
    <div class="content">
        <div class="status-bar">
            <span class="sync-status"></span>
            <span id="statusText">Connected • Last updated: <span id="lastUpdated">--:--</span></span>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card blue">
                <h3>📧 Newsletter Signups</h3>
                <div class="metric-value blue" id="newsletterCount">0</div>
                <div class="metric-desc">Real subscribers</div>
            </div>
            
            <div class="metric-card green">
                <h3>💬 Contact Forms</h3>
                <div class="metric-value green" id="contactCount">0</div>
                <div class="metric-desc">Customer inquiries</div>
            </div>
            
            <div class="metric-card orange">
                <h3>📱 App Downloads</h3>
                <div class="metric-value orange" id="downloadCount">0</div>
                <div class="metric-desc">Total downloads</div>
            </div>
            
            <div class="metric-card purple">
                <h3>👁️ Page Views</h3>
                <div class="metric-value purple" id="pageViewCount">0</div>
                <div class="metric-desc">Total visits</div>
            </div>
        </div>
        
        <div class="controls">
            <button class="btn-control" onclick="refreshData()">🔄 Refresh Data</button>
        </div>
        
        <div class="install-prompt">
            <h4>📲 Install as App</h4>
            <p>Bookmark this page or add to home screen for quick access</p>
        </div>
    </div>

    <script>
        const API_BASE = 'https://launchfit.app';
        
        let analyticsData = {
            newsletter: 1,
            contact: 0,
            download: 0,
            pageView: 0,
            lastUpdated: Date.now()
        };
        
        function loadData() {
            const saved = localStorage.getItem('launchHubData');
            if (saved) {
                analyticsData = { ...analyticsData, ...JSON.parse(saved) };
            }
        }
        
        function saveData() {
            analyticsData.lastUpdated = Date.now();
            localStorage.setItem('launchHubData', JSON.stringify(analyticsData));
        }
        
        function updateDisplay() {
            document.getElementById('newsletterCount').textContent = analyticsData.newsletter;
            document.getElementById('contactCount').textContent = analyticsData.contact;
            document.getElementById('downloadCount').textContent = analyticsData.download;
            document.getElementById('pageViewCount').textContent = analyticsData.pageView;
            document.getElementById('lastUpdated').textContent = new Date(analyticsData.lastUpdated).toLocaleTimeString();
        }
        
        async function refreshData() {
            showSyncStatus('Syncing with live data...');
            
            try {
                const response = await fetch(API_BASE + '/api/analytics-data');
                if (response.ok) {
                    const liveData = await response.json();
                    
                    analyticsData.newsletter = liveData.eventCounts?.total?.newsletterSignups || analyticsData.newsletter;
                    analyticsData.contact = liveData.eventCounts?.total?.contactForms || analyticsData.contact;
                    analyticsData.download = liveData.eventCounts?.total?.appDownloads || analyticsData.download;
                    analyticsData.pageView = liveData.eventCounts?.total?.pageViews || analyticsData.pageView;
                    
                    saveData();
                    showSyncStatus('Synced with live data');
                } else {
                    showSyncStatus('Using offline data');
                }
            } catch (error) {
                console.error('Sync error:', error);
                showSyncStatus('Using offline data');
            }
            updateDisplay();
        }
        
        function showSyncStatus(message) {
            const statusElement = document.getElementById('statusText');
            const originalText = statusElement.innerHTML;
            statusElement.innerHTML = message + ' • Last updated: <span id="lastUpdated">' + new Date(analyticsData.lastUpdated).toLocaleTimeString() + '</span>';
            
            setTimeout(() => {
                statusElement.innerHTML = originalText;
                document.getElementById('lastUpdated').textContent = new Date(analyticsData.lastUpdated).toLocaleTimeString();
            }, 3000);
        }
        
        // Initialize
        loadData();
        updateDisplay();
        refreshData();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            refreshData();
        }, 30000);
    </script>
</body>
</html>`;

      const blob = new Blob([analyticsHubHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const newWindow = window.open(url, '_blank', 'width=1200,height=800');
      if (!newWindow) {
        alert('Please allow popups to open the analytics dashboard');
      } else {
        setIsOpen(false);
        setPassword("");
        setError("");
      }
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Rocket className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                Launch Hub Access
              </DialogTitle>
              <DialogDescription>
                Enter your password to access the analytics dashboard
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter launch password"
                    className="pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    {error}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                <Rocket className="h-4 w-4 mr-2" />
                Launch Dashboard
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}