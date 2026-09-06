import { z } from "zod";

// Funnel Stage Configuration
export const funnelStageSchema = z.object({
  stage: z.enum([
    'ad_impressions',
    'engagement_clicks', 
    'landing_page_visit',
    'signup_lead',
    'subscription',
    'retention',
    'expansion',
    'churn'
  ]),
  customerAction: z.string(),
  whatYouSpendOn: z.string(),
  howYouEarnValue: z.string(),
  targetMetric: z.string(),
  currentValue: z.number(),
  targetValue: z.number(),
  costPerUnit: z.number(),
  conversionRate: z.number(),
  recommendations: z.array(z.string()).optional()
});

export type FunnelStage = z.infer<typeof funnelStageSchema>;

// Performance Metrics
export const performanceMetricSchema = z.object({
  metric: z.string(),
  currentValue: z.number(),
  targetValue: z.number(),
  status: z.enum(['excellent', 'good', 'needs_improvement', 'critical']),
  recommendation: z.string(),
  priority: z.enum(['high', 'medium', 'low'])
});

export type PerformanceMetric = z.infer<typeof performanceMetricSchema>;

// Advanced Analytics Data
export const advancedAnalyticsSchema = z.object({
  funnelStages: z.array(funnelStageSchema),
  performanceMetrics: z.array(performanceMetricSchema),
  bottlenecks: z.array(z.object({
    stage: z.string(),
    issueDescription: z.string(),
    impactLevel: z.enum(['high', 'medium', 'low']),
    suggestedActions: z.array(z.string())
  })),
  successFactors: z.array(z.object({
    area: z.string(),
    description: z.string(),
    recommendation: z.string()
  }))
});

export type AdvancedAnalytics = z.infer<typeof advancedAnalyticsSchema>;