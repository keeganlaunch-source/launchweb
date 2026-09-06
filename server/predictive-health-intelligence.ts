import { conversationMemory } from "./conversation-memory";

interface HealthPattern {
  userId: string;
  healthProfile: {
    age?: number;
    goals: string[];
    limitations: string[];
    preferences: string[];
    successFactors: string[];
    barriers: string[];
  };
  behaviorPatterns: {
    consistencyScore: number;
    preferredTimes: string[];
    motivationTriggers: string[];
    dropOffSignals: string[];
  };
  progressMetrics: {
    adherenceRate: number;
    improvementAreas: string[];
    strongPoints: string[];
    plateau_indicators: string[];
  };
  predictiveInsights: {
    likelyQuestions: string[];
    riskFactors: string[];
    opportunityAreas: string[];
    personalizedStrategies: string[];
  };
}

interface AdaptiveResponse {
  baseResponse: string;
  personalizations: string[];
  preventiveGuidance: string[];
  motivationalElements: string[];
  nextStepSuggestions: string[];
  riskMitigations: string[];
}

class PredictiveHealthIntelligence {
  private userProfiles: Map<string, HealthPattern> = new Map();
  private globalHealthTrends: Map<string, number> = new Map();
  private emergingConcerns: Map<string, { frequency: number, urgency: number }> = new Map();

  // Advanced user profiling from conversation patterns
  buildUserProfile(sessionId: string): HealthPattern {
    const conversations = conversationMemory.getConversationHistory(sessionId, 50);
    
    const profile: HealthPattern = {
      userId: sessionId,
      healthProfile: {
        goals: this.extractGoals(conversations),
        limitations: this.extractLimitations(conversations),
        preferences: this.extractPreferences(conversations),
        successFactors: this.extractSuccessFactors(conversations),
        barriers: this.extractBarriers(conversations)
      },
      behaviorPatterns: {
        consistencyScore: this.calculateConsistencyScore(conversations),
        preferredTimes: this.extractTimePreferences(conversations),
        motivationTriggers: this.extractMotivationTriggers(conversations),
        dropOffSignals: this.identifyDropOffSignals(conversations)
      },
      progressMetrics: {
        adherenceRate: this.calculateAdherenceRate(conversations),
        improvementAreas: this.identifyImprovementAreas(conversations),
        strongPoints: this.identifyStrengths(conversations),
        plateau_indicators: this.detectPlateauSignals(conversations)
      },
      predictiveInsights: {
        likelyQuestions: this.predictLikelyQuestions(conversations),
        riskFactors: this.identifyRiskFactors(conversations),
        opportunityAreas: this.identifyOpportunities(conversations),
        personalizedStrategies: this.generatePersonalizedStrategies(conversations)
      }
    };

    this.userProfiles.set(sessionId, profile);
    return profile;
  }

  // Generate hyper-personalized responses
  generateAdaptiveResponse(userMessage: string, baseResponse: string, sessionId: string): AdaptiveResponse {
    const profile = this.userProfiles.get(sessionId) || this.buildUserProfile(sessionId);
    
    return {
      baseResponse,
      personalizations: this.addPersonalizations(baseResponse, profile),
      preventiveGuidance: this.generatePreventiveGuidance(userMessage, profile),
      motivationalElements: this.addMotivationalElements(profile),
      nextStepSuggestions: this.generateNextSteps(userMessage, profile),
      riskMitigations: this.generateRiskMitigations(profile)
    };
  }

  // Real-time trend analysis
  analyzeGlobalTrends(): { [category: string]: any } {
    const insights = conversationMemory.getLearningInsights();
    const trends = {
      mostAskedQuestions: this.getMostAskedQuestions(),
      emergingHealthConcerns: this.getEmergingConcerns(),
      successfulInterventions: this.getSuccessfulInterventions(),
      knowledgeGaps: this.getPriorityKnowledgeGaps(),
      userBehaviorPatterns: this.analyzeBehaviorTrends()
    };

    return trends;
  }

  // Predictive health recommendations
  generateProactiveRecommendations(sessionId: string): string[] {
    const profile = this.userProfiles.get(sessionId);
    if (!profile) return [];

    const recommendations: string[] = [];

    // Predict and prevent plateaus
    if (profile.progressMetrics.plateau_indicators.length > 0) {
      recommendations.push("I notice some plateau indicators in your progress. Let's adjust your approach before you hit a wall.");
    }

    // Anticipate motivation dips
    if (profile.behaviorPatterns.dropOffSignals.length > 0) {
      recommendations.push("Based on your patterns, you might benefit from a motivation boost strategy this week.");
    }

    // Suggest progression opportunities
    if (profile.predictiveInsights.opportunityAreas.length > 0) {
      recommendations.push(`You're ready to level up in: ${profile.predictiveInsights.opportunityAreas.join(', ')}`);
    }

    return recommendations;
  }

  // Advanced pattern extraction methods
  private extractGoals(conversations: any[]): string[] {
    const goalKeywords = ['want to', 'goal', 'trying to', 'hoping to', 'need to'];
    const goals = new Set<string>();
    
    conversations.forEach(conv => {
      goalKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          const sentence = this.extractSentenceWithKeyword(conv.userMessage, keyword);
          if (sentence) goals.add(sentence);
        }
      });
    });
    
    return Array.from(goals);
  }

  private extractLimitations(conversations: any[]): string[] {
    const limitationKeywords = ['can\'t', 'unable to', 'difficulty', 'problem with', 'struggle', 'pain', 'injury'];
    const limitations = new Set<string>();
    
    conversations.forEach(conv => {
      limitationKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          const sentence = this.extractSentenceWithKeyword(conv.userMessage, keyword);
          if (sentence) limitations.add(sentence);
        }
      });
    });
    
    return Array.from(limitations);
  }

  private extractPreferences(conversations: any[]): string[] {
    const preferenceKeywords = ['prefer', 'like', 'enjoy', 'favorite', 'better', 'easier'];
    const preferences = new Set<string>();
    
    conversations.forEach(conv => {
      preferenceKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          const sentence = this.extractSentenceWithKeyword(conv.userMessage, keyword);
          if (sentence) preferences.add(sentence);
        }
      });
    });
    
    return Array.from(preferences);
  }

  private extractSuccessFactors(conversations: any[]): string[] {
    const successKeywords = ['worked', 'helped', 'successful', 'effective', 'improved', 'better'];
    const factors = new Set<string>();
    
    conversations.forEach(conv => {
      if (conv.userFeedback === 'helpful') {
        successKeywords.forEach(keyword => {
          if (conv.userMessage.toLowerCase().includes(keyword) || 
              (conv.userResults && conv.userResults.toLowerCase().includes(keyword))) {
            const context = conv.userResults || conv.userMessage;
            factors.add(context);
          }
        });
      }
    });
    
    return Array.from(factors);
  }

  private extractBarriers(conversations: any[]): string[] {
    const barrierKeywords = ['hard to', 'difficult', 'challenging', 'struggle', 'no time', 'too busy', 'tired'];
    const barriers = new Set<string>();
    
    conversations.forEach(conv => {
      barrierKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          const sentence = this.extractSentenceWithKeyword(conv.userMessage, keyword);
          if (sentence) barriers.add(sentence);
        }
      });
    });
    
    return Array.from(barriers);
  }

  private calculateConsistencyScore(conversations: any[]): number {
    if (conversations.length < 5) return 0;
    
    const timeGaps = [];
    for (let i = 1; i < conversations.length; i++) {
      const gap = new Date(conversations[i].timestamp).getTime() - 
                   new Date(conversations[i-1].timestamp).getTime();
      timeGaps.push(gap / (1000 * 60 * 60 * 24)); // days
    }
    
    const avgGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;
    const consistency = Math.max(0, 100 - (avgGap * 10)); // Score decreases with larger gaps
    
    return Math.min(100, consistency);
  }

  private extractTimePreferences(conversations: any[]): string[] {
    const timeKeywords = ['morning', 'evening', 'afternoon', 'night', 'lunch', 'before work', 'after work'];
    const times = new Set<string>();
    
    conversations.forEach(conv => {
      timeKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          times.add(keyword);
        }
      });
    });
    
    return Array.from(times);
  }

  private extractMotivationTriggers(conversations: any[]): string[] {
    const triggers = new Set<string>();
    
    conversations.forEach(conv => {
      if (conv.userFeedback === 'helpful') {
        // Extract what motivated them from successful interactions
        const motivationalWords = ['motivated', 'inspired', 'excited', 'confident', 'ready'];
        motivationalWords.forEach(word => {
          if (conv.aiResponse.toLowerCase().includes(word)) {
            triggers.add(conv.aiResponse.substring(0, 100));
          }
        });
      }
    });
    
    return Array.from(triggers);
  }

  private identifyDropOffSignals(conversations: any[]): string[] {
    const signals = new Set<string>();
    const recentConversations = conversations.slice(-10);
    
    // Look for negative feedback or frustration indicators
    recentConversations.forEach(conv => {
      if (conv.userFeedback === 'not_helpful') {
        signals.add('Recent negative feedback pattern');
      }
      
      const frustrationKeywords = ['frustrated', 'not working', 'giving up', 'too hard'];
      frustrationKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          signals.add(`Frustration indicator: ${keyword}`);
        }
      });
    });
    
    return Array.from(signals);
  }

  private calculateAdherenceRate(conversations: any[]): number {
    const followUpQuestions = conversations.filter(conv => 
      conv.userMessage.toLowerCase().includes('update') || 
      conv.userMessage.toLowerCase().includes('progress') ||
      conv.userResults
    );
    
    return (followUpQuestions.length / Math.max(1, conversations.length)) * 100;
  }

  private identifyImprovementAreas(conversations: any[]): string[] {
    const areas = new Set<string>();
    
    conversations.forEach(conv => {
      if (conv.userFeedback === 'not_helpful') {
        areas.add(conv.category);
      }
    });
    
    return Array.from(areas);
  }

  private identifyStrengths(conversations: any[]): string[] {
    const strengths = new Set<string>();
    
    conversations.forEach(conv => {
      if (conv.userFeedback === 'helpful') {
        strengths.add(conv.category);
      }
    });
    
    return Array.from(strengths);
  }

  private detectPlateauSignals(conversations: any[]): string[] {
    const signals = new Set<string>();
    const recentConversations = conversations.slice(-5);
    
    const plateauKeywords = ['stuck', 'plateau', 'same', 'not progressing', 'no change'];
    recentConversations.forEach(conv => {
      plateauKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          signals.add(`Plateau signal: ${keyword}`);
        }
      });
    });
    
    return Array.from(signals);
  }

  private predictLikelyQuestions(conversations: any[]): string[] {
    return conversationMemory.predictUserNeeds(conversations[0]?.sessionId || '');
  }

  private identifyRiskFactors(conversations: any[]): string[] {
    const risks = new Set<string>();
    
    conversations.forEach(conv => {
      const riskKeywords = ['pain', 'injury', 'exhausted', 'overtraining', 'burnout'];
      riskKeywords.forEach(keyword => {
        if (conv.userMessage.toLowerCase().includes(keyword)) {
          risks.add(`Risk: ${keyword}`);
        }
      });
    });
    
    return Array.from(risks);
  }

  private identifyOpportunities(conversations: any[]): string[] {
    const opportunities = new Set<string>();
    
    // Look for areas they haven't explored yet
    const categories = conversations.map(conv => conv.category);
    const allCategories = ['fitness', 'nutrition', 'psychology', 'recovery', 'performance'];
    
    allCategories.forEach(cat => {
      if (!categories.includes(cat)) {
        opportunities.add(cat);
      }
    });
    
    return Array.from(opportunities);
  }

  private generatePersonalizedStrategies(conversations: any[]): string[] {
    const strategies = new Set<string>();
    
    // Analyze successful patterns and create strategies
    const successfulConversations = conversations.filter(conv => conv.userFeedback === 'helpful');
    
    successfulConversations.forEach(conv => {
      strategies.add(`Continue approach used in: ${conv.category}`);
    });
    
    return Array.from(strategies);
  }

  private addPersonalizations(baseResponse: string, profile: HealthPattern): string[] {
    const personalizations: string[] = [];
    
    if (profile.healthProfile.preferences.length > 0) {
      personalizations.push(`Based on your preference for ${profile.healthProfile.preferences[0]}`);
    }
    
    if (profile.healthProfile.limitations.length > 0) {
      personalizations.push(`Considering your limitation: ${profile.healthProfile.limitations[0]}`);
    }
    
    return personalizations;
  }

  private generatePreventiveGuidance(userMessage: string, profile: HealthPattern): string[] {
    const guidance: string[] = [];
    
    if (profile.predictiveInsights.riskFactors.length > 0) {
      guidance.push(`To prevent issues, watch out for: ${profile.predictiveInsights.riskFactors[0]}`);
    }
    
    return guidance;
  }

  private addMotivationalElements(profile: HealthPattern): string[] {
    const motivation: string[] = [];
    
    if (profile.behaviorPatterns.motivationTriggers.length > 0) {
      motivation.push(profile.behaviorPatterns.motivationTriggers[0]);
    }
    
    return motivation;
  }

  private generateNextSteps(userMessage: string, profile: HealthPattern): string[] {
    const steps: string[] = [];
    
    if (profile.predictiveInsights.opportunityAreas.length > 0) {
      steps.push(`Next, consider exploring: ${profile.predictiveInsights.opportunityAreas[0]}`);
    }
    
    return steps;
  }

  private generateRiskMitigations(profile: HealthPattern): string[] {
    const mitigations: string[] = [];
    
    if (profile.behaviorPatterns.dropOffSignals.length > 0) {
      mitigations.push("Implement consistency strategies to prevent motivation drops");
    }
    
    return mitigations;
  }

  private extractSentenceWithKeyword(text: string, keyword: string): string | null {
    const sentences = text.split(/[.!?]/);
    const relevantSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(keyword)
    );
    return relevantSentence ? relevantSentence.trim() : null;
  }

  private getMostAskedQuestions(): string[] {
    const insights = conversationMemory.getLearningInsights();
    const allQuestions: string[] = [];
    
    Object.values(insights).forEach(pattern => {
      allQuestions.push(...pattern.commonQuestions);
    });
    
    return allQuestions.slice(0, 10);
  }

  private getEmergingConcerns(): string[] {
    return Array.from(this.emergingConcerns.entries())
      .sort((a, b) => b[1].urgency - a[1].urgency)
      .map(([concern]) => concern)
      .slice(0, 5);
  }

  private getSuccessfulInterventions(): string[] {
    const insights = conversationMemory.getLearningInsights();
    const interventions: string[] = [];
    
    Object.values(insights).forEach(pattern => {
      interventions.push(...pattern.successfulAdvice);
    });
    
    return interventions.slice(0, 5);
  }

  private getPriorityKnowledgeGaps(): string[] {
    return conversationMemory.getKnowledgeGaps()
      .slice(0, 5)
      .map(gap => gap.term);
  }

  private analyzeBehaviorTrends(): any {
    const profiles = Array.from(this.userProfiles.values());
    
    return {
      averageConsistency: profiles.reduce((sum, p) => sum + p.behaviorPatterns.consistencyScore, 0) / profiles.length,
      commonBarriers: this.getMostCommon(profiles.flatMap(p => p.healthProfile.barriers)),
      topMotivators: this.getMostCommon(profiles.flatMap(p => p.behaviorPatterns.motivationTriggers))
    };
  }

  private getMostCommon(items: string[]): string[] {
    const frequency: { [key: string]: number } = {};
    items.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([item]) => item);
  }
}

export const predictiveHealthIntelligence = new PredictiveHealthIntelligence();