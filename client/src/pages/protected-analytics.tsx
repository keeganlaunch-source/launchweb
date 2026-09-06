import { useState } from "react";
import SimpleAnalytics from "./simple-analytics";
import PrivateAnalyticsLogin from "./private-analytics-login";

export default function ProtectedAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PrivateAnalyticsLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <SimpleAnalytics />;
}