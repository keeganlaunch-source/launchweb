import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ExternalLink, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Step {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'immediate' | 'week1' | 'week2' | 'week3';
  actions: {
    text: string;
    url?: string;
    type: 'link' | 'action' | 'code';
  }[];
}

export default function ActionPlan() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'utm-links',
      title: 'Create UTM Links for Social Media',
      description: 'Generate trackable links for all your social media platforms',
      timeEstimate: '30 minutes',
      priority: 'high',
      status: 'pending',
      category: 'immediate',
      actions: [
        { text: 'Use UTM Link Generator in dashboard', type: 'action' },
        { text: 'Create links for each platform campaign', type: 'action' },
        { text: 'Save links for social media posts', type: 'action' }
      ]
    },
    {
      id: 'app-store-connect',
      title: 'Set Up iOS App Store Connect Analytics',
      description: 'Configure analytics in App Store Connect to track downloads',
      timeEstimate: '45 minutes',
      priority: 'high',
      status: 'pending',
      category: 'week1',
      actions: [
        { text: 'Login to App Store Connect', url: 'https://appstoreconnect.apple.com', type: 'link' },
        { text: 'Navigate to App Analytics', type: 'action' },
        { text: 'Enable detailed analytics', type: 'action' },
        { text: 'Configure webhook URL', type: 'action' }
      ]
    },
    {
      id: 'play-console',
      title: 'Set Up Google Play Console Analytics',
      description: 'Configure Google Play Console for Android app tracking',
      timeEstimate: '45 minutes',
      priority: 'high',
      status: 'pending',
      category: 'week1',
      actions: [
        { text: 'Access Google Play Console', url: 'https://play.google.com/console', type: 'link' },
        { text: 'Go to Statistics → Downloads', type: 'action' },
        { text: 'Enable acquisition reports', type: 'action' },
        { text: 'Set up UTM tracking', type: 'action' }
      ]
    },
    {
      id: 'firebase-project',
      title: 'Create Firebase Project',
      description: 'Set up Firebase Analytics for cross-platform tracking',
      timeEstimate: '30 minutes',
      priority: 'medium',
      status: 'pending',
      category: 'week2',
      actions: [
        { text: 'Create Firebase project', url: 'https://console.firebase.google.com', type: 'link' },
        { text: 'Enable Google Analytics', type: 'action' },
        { text: 'Add iOS and Android apps', type: 'action' },
        { text: 'Download config files', type: 'action' }
      ]
    },
    {
      id: 'mobile-sdk',
      title: 'Implement Firebase SDK in Mobile App',
      description: 'Add tracking code to your React Native or native mobile app',
      timeEstimate: '2 hours',
      priority: 'medium',
      status: 'pending',
      category: 'week2',
      actions: [
        { text: 'Install Firebase SDK', type: 'code' },
        { text: 'Add conversion tracking events', type: 'code' },
        { text: 'Test event tracking', type: 'action' },
        { text: 'Deploy to app stores', type: 'action' }
      ]
    },
    {
      id: 'webhook-testing',
      title: 'Test Webhook Integration',
      description: 'Verify that app store data flows back to your dashboard',
      timeEstimate: '1 hour',
      priority: 'low',
      status: 'pending',
      category: 'week3',
      actions: [
        { text: 'Run test webhook commands', type: 'code' },
        { text: 'Verify data appears in dashboard', type: 'action' },
        { text: 'Configure real webhook endpoints', type: 'action' },
        { text: 'Monitor data flow', type: 'action' }
      ]
    }
  ]);

  const toggleStepStatus = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: step.status === 'completed' ? 'pending' : 'completed' }
        : step
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'immediate':
        return 'Start Now (Today)';
      case 'week1':
        return 'Week 1: App Store Setup';
      case 'week2':
        return 'Week 2: Mobile App Integration';
      case 'week3':
        return 'Week 3: Testing & Optimization';
      default:
        return category;
    }
  };

  const categories = ['immediate', 'week1', 'week2', 'week3'] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Complete Implementation Action Plan
        </CardTitle>
        <CardDescription>
          Follow this step-by-step plan to implement full social media to app store analytics tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {categories.map(category => {
          const categorySteps = steps.filter(step => step.category === category);
          const completedSteps = categorySteps.filter(step => step.status === 'completed').length;
          
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{getCategoryTitle(category)}</h3>
                <Badge variant="outline">
                  {completedSteps}/{categorySteps.length} Complete
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {categorySteps.map(step => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button 
                          onClick={() => toggleStepStatus(step.id)}
                          className="mt-1"
                        >
                          {getStatusIcon(step.status)}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{step.title}</h4>
                            <Badge className={getPriorityColor(step.priority)}>
                              {step.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {step.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Estimated time: {step.timeEstimate}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-2">
                      <p className="text-sm font-medium">Action Steps:</p>
                      {step.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {action.type === 'link' ? (
                            <Button
                              asChild
                              size="sm"
                              variant="link"
                              className="h-auto p-0 text-blue-600 hover:text-blue-800"
                            >
                              <a href={action.url} target="_blank" rel="noopener noreferrer">
                                {action.text}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-sm">{action.text}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Quick Start Recommendation
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Start with creating UTM links today and begin sharing them on your social media. 
            This will immediately start tracking your social media traffic sources.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Then tackle the app store setups in Week 1 - these require no coding and provide 
            immediate value for tracking downloads.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}