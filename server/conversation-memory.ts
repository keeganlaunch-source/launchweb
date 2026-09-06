interface ConversationEntry {
  sessionId: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  category: string;
  userFeedback?: 'helpful' | 'not_helpful';
  userResults?: string;
  knowledgeExtracted?: string;
}

interface LearningPattern {
  topic: string;
  successfulAdvice: string[];
  commonQuestions: string[];
  userPreferences: string[];
  improvementAreas: string[];
  newTermsEncountered: string[];
  knowledgeGaps: string[];
  emergingTrends: string[];
  researchFindings: string[];
  clinicalApplications: string[];
  lastUpdated: Date;
}

interface KnowledgeGap {
  term: string;
  context: string;
  userQuestion: string;
  frequency: number;
  needsResearch: boolean;
  relatedTerms: string[];
  discoveredAt: Date;
}

class ConversationMemory {
  private conversations: ConversationEntry[] = [];
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private knowledgeGaps: Map<string, KnowledgeGap> = new Map();

  addConversation(entry: ConversationEntry) {
    this.conversations.push(entry);
    this.extractLearningPatterns(entry);
  }

  private extractLearningPatterns(entry: ConversationEntry) {
    const pattern = this.learningPatterns.get(entry.category) || {
      topic: entry.category,
      successfulAdvice: [],
      commonQuestions: [],
      userPreferences: [],
      improvementAreas: [],
      newTermsEncountered: [],
      knowledgeGaps: [],
      emergingTrends: [],
      researchFindings: [],
      clinicalApplications: [],
      lastUpdated: new Date()
    };

    // Add common question patterns
    if (!pattern.commonQuestions.some(q => this.isSimilarQuestion(q, entry.userMessage))) {
      pattern.commonQuestions.push(entry.userMessage);
    }

    // Track successful advice if user provided positive feedback
    if (entry.userFeedback === 'helpful' && !pattern.successfulAdvice.includes(entry.aiResponse)) {
      pattern.successfulAdvice.push(entry.aiResponse);
    }

    // Track improvement areas if user provided negative feedback
    if (entry.userFeedback === 'not_helpful') {
      pattern.improvementAreas.push(`User found this unhelpful: ${entry.aiResponse.substring(0, 100)}...`);
    }

    // Extract user preferences and results
    if (entry.userResults) {
      pattern.userPreferences.push(entry.userResults);
    }

    // Detect and store new terms or concepts
    this.detectNewTerms(entry, pattern);

    // Identify potential knowledge gaps
    this.identifyKnowledgeGaps(entry);

    // Extract research findings and clinical applications
    this.extractResearchFindings(entry, pattern);

    pattern.lastUpdated = new Date();
    this.learningPatterns.set(entry.category, pattern);
  }

  private detectNewTerms(entry: ConversationEntry, pattern: LearningPattern) {
    const medicalTerms = this.extractMedicalTerms(entry.userMessage + ' ' + entry.aiResponse);
    const newTerms = medicalTerms.filter(term => !pattern.newTermsEncountered.includes(term));
    pattern.newTermsEncountered.push(...newTerms);
  }

  private extractMedicalTerms(text: string): string[] {
    const medicalPatterns = [
      /\b[A-Z][a-z]+osis\b/g, // conditions ending in -osis
      /\b[A-Z][a-z]+itis\b/g, // inflammation conditions
      /\b[A-Z][a-z]+pathy\b/g, // disease conditions
      /\b[A-Z][a-z]+plasty\b/g, // surgical procedures
      /\b[A-Z][a-z]+ectomy\b/g, // removal procedures
      /\b[A-Z][a-z]+therapy\b/g, // treatment types
      /\b[A-Z][a-z]+syndrome\b/g, // syndrome names
      /\b\d+\s?mg|\d+\s?g|\d+\s?ml\b/g, // dosage measurements
      /\b[A-Z]{2,}\b/g, // medical acronyms
    ];
    
    const terms = new Set<string>();
    medicalPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) matches.forEach(match => terms.add(match.trim()));
    });
    
    return Array.from(terms);
  }

  private identifyKnowledgeGaps(entry: ConversationEntry) {
    const uncertaintyIndicators = [
      'not sure', 'unclear', 'need more research', 'limited evidence',
      'conflicting studies', 'emerging research', 'preliminary findings'
    ];
    
    const hasUncertainty = uncertaintyIndicators.some(indicator => 
      entry.aiResponse.toLowerCase().includes(indicator)
    );
    
    if (hasUncertainty) {
      const key = entry.userMessage.toLowerCase();
      const existing = this.knowledgeGaps.get(key);
      
      if (existing) {
        existing.frequency++;
        existing.needsResearch = true;
      } else {
        this.knowledgeGaps.set(key, {
          term: this.extractKeyTerms(entry.userMessage)[0] || 'unknown',
          context: entry.category,
          userQuestion: entry.userMessage,
          frequency: 1,
          needsResearch: true,
          relatedTerms: this.extractKeyTerms(entry.userMessage),
          discoveredAt: new Date()
        });
      }
    }
  }

  private extractKeyTerms(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3);
    
    const healthTerms = words.filter(word => 
      ['exercise', 'nutrition', 'muscle', 'protein', 'training', 'recovery', 
       'sleep', 'stress', 'hormone', 'supplement', 'cardio', 'strength'].includes(word)
    );
    
    return healthTerms.length > 0 ? healthTerms : words.slice(0, 3);
  }

  private extractResearchFindings(entry: ConversationEntry, pattern: LearningPattern) {
    const researchIndicators = [
      'study shows', 'research indicates', 'according to', 'evidence suggests',
      'clinical trial', 'meta-analysis', 'systematic review', 'published in'
    ];
    
    researchIndicators.forEach(indicator => {
      if (entry.userMessage.toLowerCase().includes(indicator) || 
          entry.aiResponse.toLowerCase().includes(indicator)) {
        const finding = this.extractSentenceWithIndicator(entry.userMessage + ' ' + entry.aiResponse, indicator);
        if (finding && !pattern.researchFindings.includes(finding)) {
          pattern.researchFindings.push(finding);
        }
      }
    });
  }

  private extractSentenceWithIndicator(text: string, indicator: string): string | null {
    const sentences = text.split(/[.!?]/);
    const relevantSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(indicator)
    );
    return relevantSentence ? relevantSentence.trim() : null;
  }

  private isSimilarQuestion(existingQuestion: string, newQuestion: string): boolean {
    const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const existing = normalize(existingQuestion);
    const newQ = normalize(newQuestion);
    
    const commonWords = existing.split(' ').filter(word => newQ.includes(word));
    return commonWords.length >= Math.min(3, existing.split(' ').length * 0.5);
  }

  getRelevantContext(category: string, currentQuestion: string): string {
    const pattern = this.learningPatterns.get(category);
    if (!pattern) return '';

    let context = '';

    // Add successful advice patterns
    if (pattern.successfulAdvice.length > 0) {
      context += `\nPrevious successful advice for ${category}:\n`;
      context += pattern.successfulAdvice.slice(-3).join('\n');
    }

    // Add user preferences and results
    if (pattern.userPreferences.length > 0) {
      context += `\nUser preferences and results for ${category}:\n`;
      context += pattern.userPreferences.slice(-5).join('\n');
    }

    // Add improvement areas to avoid
    if (pattern.improvementAreas.length > 0) {
      context += `\nAvoid these approaches (marked as unhelpful):\n`;
      context += pattern.improvementAreas.slice(-3).join('\n');
    }

    // Add new terms encountered
    if (pattern.newTermsEncountered.length > 0) {
      context += `\nNew terms/concepts learned in ${category}:\n`;
      context += pattern.newTermsEncountered.slice(-10).join(', ');
    }

    // Add research findings
    if (pattern.researchFindings.length > 0) {
      context += `\nRecent research findings in ${category}:\n`;
      context += pattern.researchFindings.slice(-3).join('\n');
    }

    // Add knowledge gaps for this category
    const categoryGaps = Array.from(this.knowledgeGaps.values())
      .filter(gap => gap.context === category)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);

    if (categoryGaps.length > 0) {
      context += `\nKnowledge gaps to address in ${category}:\n`;
      context += categoryGaps.map(gap => `${gap.term}: ${gap.userQuestion}`).join('\n');
    }

    return context;
  }

  // Advanced analytics methods
  getKnowledgeGaps(): KnowledgeGap[] {
    return Array.from(this.knowledgeGaps.values())
      .sort((a, b) => b.frequency - a.frequency);
  }

  getEmergingTrends(): { [category: string]: string[] } {
    const trends: { [category: string]: string[] } = {};
    this.learningPatterns.forEach((pattern, category) => {
      if (pattern.emergingTrends.length > 0) {
        trends[category] = pattern.emergingTrends;
      }
    });
    return trends;
  }

  getResearchSummary(): { [category: string]: string[] } {
    const research: { [category: string]: string[] } = {};
    this.learningPatterns.forEach((pattern, category) => {
      if (pattern.researchFindings.length > 0) {
        research[category] = pattern.researchFindings;
      }
    });
    return research;
  }

  // Predictive analysis
  predictUserNeeds(sessionId: string): string[] {
    const userHistory = this.conversations.filter(conv => conv.sessionId === sessionId);
    if (userHistory.length < 2) return [];

    const categories = userHistory.map(conv => conv.category);
    const mostCommon = this.getMostFrequentCategory(categories);
    const pattern = this.learningPatterns.get(mostCommon);
    
    if (!pattern) return [];

    // Predict next likely questions based on patterns
    return pattern.commonQuestions.slice(0, 3);
  }

  private getMostFrequentCategory(categories: string[]): string {
    const frequency: { [key: string]: number } = {};
    categories.forEach(cat => frequency[cat] = (frequency[cat] || 0) + 1);
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  getConversationHistory(sessionId: string, limit: number = 5): ConversationEntry[] {
    if (sessionId === 'all') {
      return this.conversations.slice(-limit);
    }
    return this.conversations
      .filter(conv => conv.sessionId === sessionId)
      .slice(-limit);
  }

  addUserFeedback(sessionId: string, messageIndex: number, feedback: 'helpful' | 'not_helpful', results?: string) {
    const conversation = this.conversations.find((conv, index) => 
      conv.sessionId === sessionId && index === messageIndex
    );
    
    if (conversation) {
      conversation.userFeedback = feedback;
      if (results) {
        conversation.userResults = results;
      }
      // Re-extract learning patterns with new feedback
      this.extractLearningPatterns(conversation);
    }
  }

  getLearningInsights(): { [category: string]: LearningPattern } {
    const insights: { [category: string]: LearningPattern } = {};
    this.learningPatterns.forEach((pattern, category) => {
      insights[category] = pattern;
    });
    return insights;
  }

  // Export knowledge for backup or sharing
  exportKnowledge(): string {
    return JSON.stringify({
      totalConversations: this.conversations.length,
      learningPatterns: Array.from(this.learningPatterns.entries()),
      lastUpdated: new Date().toISOString()
    }, null, 2);
  }

  // Import knowledge from backup
  importKnowledge(knowledgeData: string) {
    try {
      const data = JSON.parse(knowledgeData);
      if (data.learningPatterns) {
        this.learningPatterns = new Map(data.learningPatterns);
      }
    } catch (error) {
      console.error('Failed to import knowledge:', error);
    }
  }
}

export const conversationMemory = new ConversationMemory();