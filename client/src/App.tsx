import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initializeAnalytics } from "./lib/analytics-tracker";
import { useFirebaseAnalytics } from "./hooks/useFirebaseAnalytics";
import { useMetaPixel } from "./hooks/useMetaPixel";
import { initMetaPixel } from "./lib/meta-pixel";
import { initMultiPlatformTracking } from "./lib/multi-platform-tracking";
import { initRealTimeAnalytics } from "./lib/real-time-analytics";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import EmailPreview from "@/pages/email-preview";
import EmailDashboard from "@/pages/email-dashboard";
import ProfessionalDashboard from "@/pages/professional-dashboard";
import ProfessionalDashboardPreview from "@/pages/professional-dashboard-preview";
import YouTubeAnalytics from "@/pages/youtube-analytics";
import AdminDashboard from "@/pages/admin-dashboard";
import UnifiedDashboard from "@/pages/unified-dashboard";
import FunnelAnalytics from "@/pages/funnel-analytics";
import LaunchAnalyticsHub from "@/pages/launch-analytics-hub";
import EmbeddedSignup from "@/pages/embedded-signup";
import SignupFlow from "@/pages/signup-flow";
import SignupRedirect from "@/pages/signup-redirect";
import LaunchWebsite from "@/pages/launch-website";
import Products from "@/pages/Products";

import Success from "@/pages/success";

function Router() {
  // Initialize Firebase Analytics tracking
  useFirebaseAnalytics();
  // Initialize Meta Pixel tracking
  useMetaPixel();
  // Initialize Google Analytics page tracking
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={EmbeddedSignup} />
      <Route path="/get-started" component={SignupFlow} />
      <Route path="/start-now" component={SignupRedirect} />
      <Route path="/start-premium" component={SignupRedirect} />
      <Route path="/start-free-trial" component={SignupRedirect} />
      <Route path="/launch-analytics-hub" component={LaunchAnalyticsHub} />
      <Route path="/products" component={Products} />

      <Route path="/success" component={Success} />
      <Route path="/email-preview" component={EmailPreview} />
      <Route path="/emails" component={EmailDashboard} />
      <Route path="/email-dashboard" component={ProfessionalDashboard} />
      <Route path="/professional-dashboard" component={ProfessionalDashboard} />
      <Route path="/professional-dashboard-preview" component={ProfessionalDashboardPreview} />
      <Route path="/youtube-analytics" component={YouTubeAnalytics} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/unified-dashboard" component={UnifiedDashboard} />
      <Route path="/funnel-analytics" component={FunnelAnalytics} />
      <Route path="/home" component={Home} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeAnalytics();
    // Initialize Meta Pixel with your ID
    initMetaPixel('1181578407319125');
    // Initialize comprehensive multi-platform tracking
    initMultiPlatformTracking();
    // Initialize real-time user behavior analytics
    initRealTimeAnalytics();
    // Initialize Google Analytics with G-08HCZR6RCF
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    } else {
      console.warn('Google Analytics not initialized: Missing VITE_GA_MEASUREMENT_ID');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
