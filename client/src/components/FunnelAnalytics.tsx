import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react";

interface FunnelStage {
  stage: string;
  customerAction: string;
  whatYouSpendOn: string;
  howYouEarnValue: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  costPerUnit: number;
  conversionRate: number;
}

interface PerformanceMetric {
  metric: string;
  currentValue: number;
  targetValue: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

interface Bottleneck {
  stage: string;
  issueDescription: string;
  impactLevel: 'high' | 'medium' | 'low';
  suggestedActions: string[];
}

interface SuccessFactor {
  area: string;
  description: string;
  recommendation: string;
}

interface AdvancedAnalytics {
  funnelStages: FunnelStage[];
  performanceMetrics: PerformanceMetric[];
  bottlenecks: Bottleneck[];
  successFactors: SuccessFactor[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-blue-500';
    case 'needs_improvement': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case 'needs_improvement': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'critical': return <TrendingDown className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

export default function FunnelAnalytics() {
  const { data: analytics, isLoading } = useQuery<AdvancedAnalytics>({
    queryKey: ['/api/analytics/funnel'],
    refetchInterval: 30000
  });

  const { data: recommendations } = useQuery<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  }>({
    queryKey: ['/api/analytics/recommendations'],
    refetchInterval: 60000
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Launch Lifestyle Funnel Analytics</h2>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: getStatusColor(metric.status).replace('bg-', '') }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                {getStatusIcon(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.currentValue}
                {metric.metric.includes('Rate') || metric.metric.includes('CTR') ? '%' : ''}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Target: {metric.targetValue}
                {metric.metric.includes('Rate') || metric.metric.includes('CTR') ? '%' : ''}
              </div>
              <Progress 
                value={(metric.currentValue / metric.targetValue) * 100} 
                className="h-2 mb-3" 
              />
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(metric.priority)} className="text-xs">
                  {metric.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{metric.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel Stages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Launch App CAC-LTV Funnel Matrix</CardTitle>
          <CardDescription>Complete customer journey from social media to subscription revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Funnel Stage</th>
                  <th className="text-left p-2 font-medium">Customer Action</th>
                  <th className="text-left p-2 font-medium">What You Spend On</th>
                  <th className="text-left p-2 font-medium">How You Earn Value</th>
                  <th className="text-left p-2 font-medium">Target Metric</th>
                  <th className="text-left p-2 font-medium">Current</th>
                  <th className="text-left p-2 font-medium">Cost/Unit</th>
                </tr>
              </thead>
              <tbody>
                {analytics.funnelStages.map((stage, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium capitalize">{stage.stage.replace('_', ' ')}</td>
                    <td className="p-2">{stage.customerAction}</td>
                    <td className="p-2">{stage.whatYouSpendOn}</td>
                    <td className="p-2">{stage.howYouEarnValue}</td>
                    <td className="p-2">{stage.targetMetric}</td>
                    <td className="p-2">
                      <span className={`font-medium ${
                        stage.currentValue >= stage.targetValue ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {stage.currentValue}
                        {stage.stage.includes('rate') || stage.targetMetric.includes('%') ? '%' : ''}
                      </span>
                    </td>
                    <td className="p-2">R{stage.costPerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Critical Bottlenecks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Critical Bottlenecks & Fixes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.bottlenecks.map((bottleneck, index) => (
            <Alert key={index} className="border-l-4 border-l-red-500">
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{bottleneck.stage}</h4>
                    <Badge variant="destructive">{bottleneck.impactLevel.toUpperCase()} IMPACT</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{bottleneck.issueDescription}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Immediate Actions:</p>
                    <ul className="text-xs space-y-1">
                      {bottleneck.suggestedActions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Success Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            What's Working Well
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.successFactors.map((factor, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
              <h4 className="font-semibold text-green-800">{factor.area}</h4>
              <p className="text-sm text-green-700 mb-2">{factor.description}</p>
              <p className="text-xs text-green-600 font-medium">Next Step: {factor.recommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Plan */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Optimization Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-red-600 mb-2">🚨 Immediate (This Week)</h4>
              <ul className="space-y-1">
                {recommendations.immediate.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">📈 Short-term (Next Month)</h4>
              <ul className="space-y-1">
                {recommendations.shortTerm.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">🎯 Long-term (Next Quarter)</h4>
              <ul className="space-y-1">
                {recommendations.longTerm.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}