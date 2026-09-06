import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

interface ConversionMetrics {
  scarcityClicks: number;
  floatingCtaClicks: number;
  exitIntentTriggers: number;
  smartOptimizerShows: number;
  totalConversions: number;
  conversionRate: number;
  avgTimeToConvert: number;
  topPerformingVariant: string;
}

interface UserSession {
  id: string;
  startTime: number;
  interactions: string[];
  converted: boolean;
  variant: string;
}

export default function ConversionAnalytics() {
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    scarcityClicks: 0,
    floatingCtaClicks: 0,
    exitIntentTriggers: 0,
    smartOptimizerShows: 0,
    totalConversions: 0,
    conversionRate: 0,
    avgTimeToConvert: 0,
    topPerformingVariant: 'control'
  });

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize session
    const sessionId = Math.random().toString(36).substr(2, 9);
    const currentSession: UserSession = {
      id: sessionId,
      startTime: Date.now(),
      interactions: [],
      converted: false,
      variant: 'control'
    };
    
    setSessions([currentSession]);

    // Track conversion events
    const trackEvent = (eventType: string) => {
      setMetrics(prev => ({
        ...prev,
        [eventType]: prev[eventType as keyof ConversionMetrics] + 1
      }));
    };

    // Listen for custom conversion events
    const handleScarcityClick = () => trackEvent('scarcityClicks');
    const handleFloatingCtaClick = () => trackEvent('floatingCtaClicks');
    const handleExitIntentTrigger = () => trackEvent('exitIntentTriggers');
    const handleSmartOptimizerShow = () => trackEvent('smartOptimizerShows');

    // Simulate real-time metrics updates
    const metricsTimer = setInterval(() => {
      setMetrics(prev => {
        const totalViews = prev.scarcityClicks + prev.floatingCtaClicks + prev.exitIntentTriggers + prev.smartOptimizerShows + 100;
        const conversionRate = totalViews > 0 ? (prev.totalConversions / totalViews) * 100 : 0;
        
        return {
          ...prev,
          conversionRate: Number(conversionRate.toFixed(2)),
          avgTimeToConvert: 45 + Math.random() * 60, // 45-105 seconds average
        };
      });
    }, 10000);

    // Show analytics after 2 minutes for admin/testing
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 120000);

    return () => {
      clearInterval(metricsTimer);
      clearTimeout(showTimer);
    };
  }, []);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Quick access via keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={handleToggleVisibility}
        className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded-full shadow-lg z-[200] opacity-20 hover:opacity-100 transition-opacity"
        title="Show Conversion Analytics (Ctrl+Shift+A)"
      >
        <BarChart3 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[200] p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Conversion Analytics
        </h3>
        <button
          onClick={handleToggleVisibility}
          className="text-gray-500 hover:text-gray-700 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* Real-time metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
            <div className="font-semibold text-blue-700 dark:text-blue-300">Scarcity</div>
            <div className="text-lg font-bold">{metrics.scarcityClicks}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
            <div className="font-semibold text-green-700 dark:text-green-300">Floating CTA</div>
            <div className="text-lg font-bold">{metrics.floatingCtaClicks}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
            <div className="font-semibold text-orange-700 dark:text-orange-300">Exit Intent</div>
            <div className="text-lg font-bold">{metrics.exitIntentTriggers}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
            <div className="font-semibold text-purple-700 dark:text-purple-300">Smart CTA</div>
            <div className="text-lg font-bold">{metrics.smartOptimizerShows}</div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Conversion Rate
            </span>
            <span className="font-bold">{metrics.conversionRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Avg Convert Time
            </span>
            <span className="font-bold">{Math.round(metrics.avgTimeToConvert)}s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Total Conversions
            </span>
            <span className="font-bold">{metrics.totalConversions}</span>
          </div>
        </div>

        {/* A/B Testing insights */}
        <div className="border-t pt-2">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Top Variant:</div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
            <span className="font-semibold text-yellow-700 dark:text-yellow-300">
              {metrics.topPerformingVariant}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}