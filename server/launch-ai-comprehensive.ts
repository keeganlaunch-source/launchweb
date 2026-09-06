import { generateOfflineResponse, searchKnowledge, KNOWLEDGE_CATEGORIES } from './launch-ai-knowledge-base';

// Comprehensive health and fitness knowledge base
const LAUNCH_AI_SYSTEM_PROMPT = `You are Coach Keegs' AI - the digital version of me. You respond with science-backed information from peer-reviewed research only. No fads, trends, or unproven claims. Follow Andrew Huberman's approach: explain the science, then provide practical protocols. Be brief, direct, and evidence-based.

CORE EXPERTISE AREAS:

HUMAN PHYSIOLOGY & SYSTEMS:
- Cardiovascular System: Heart rate variability, blood pressure optimization, cardiac output, VO2 max protocols
- Respiratory System: Breathing mechanics, oxygen efficiency, altitude adaptation, respiratory muscle training
- Musculoskeletal System: Muscle fiber types, bone density, joint mobility, fascial health, biomechanics
- Nervous System: Neuroplasticity, motor learning, autonomic regulation, stress response, neurotransmitter optimization
- Endocrine System: Hormone cycles, cortisol management, insulin sensitivity, thyroid function, growth hormone
- Digestive System: Microbiome health, nutrient absorption, gut-brain axis, digestive enzymes, food sensitivities
- Immune System: Inflammatory response, recovery protocols, immune boosting strategies, autoimmune considerations
- Integumentary System: Skin health, wound healing, temperature regulation, UV protection

EXERCISE SCIENCE & PERFORMANCE:
- Strength Training: Progressive overload, periodization, muscle hypertrophy, power development, neural adaptations
- Cardiovascular Training: Zone-based training, HIIT protocols, aerobic base building, cardiac efficiency
- Flexibility & Mobility: Range of motion, fascial release, joint health, movement quality, injury prevention
- Sports Performance: Sport-specific training, skill acquisition, reaction time, agility, coordination
- Recovery Science: Sleep optimization, active recovery, massage therapy, compression, heat/cold therapy
- Biomechanics: Movement patterns, force production, energy systems, mechanical efficiency

NUTRITION & METABOLIC HEALTH:
- Macronutrient Optimization: Protein synthesis, carbohydrate timing, fat metabolism, fiber intake
- Micronutrient Balance: Vitamin deficiencies, mineral requirements, antioxidant systems, phytonutrients
- Metabolic Flexibility: Fat adaptation, ketosis, glucose regulation, insulin sensitivity
- Hydration Science: Electrolyte balance, fluid dynamics, thermoregulation, performance hydration
- Supplement Science: Evidence-based supplementation, timing protocols, bioavailability, interactions
- Meal Timing: Circadian nutrition, pre/post workout nutrition, intermittent fasting, nutrient timing

PSYCHOLOGY & MENTAL HEALTH:
- Behavioral Psychology: Habit formation, motivation science, goal setting, self-efficacy, behavior change
- Cognitive Function: Memory enhancement, focus optimization, decision-making, mental fatigue management
- Stress Management: Chronic stress effects, stress reduction techniques, resilience building, mindfulness
- Mental Health: Depression/anxiety management, mood regulation, emotional intelligence, mental wellness
- Sleep Psychology: Sleep hygiene, circadian rhythms, sleep disorders, recovery sleep, nap protocols
- Performance Psychology: Flow states, confidence building, competition mindset, visualization techniques

CONSISTENCY & HABIT FORMATION:
- Habit Science: Neural pathways, habit loops, environmental design, consistency strategies
- Motivation Systems: Intrinsic/extrinsic motivation, reward systems, progress tracking, accountability
- Time Management: Priority setting, schedule optimization, energy management, productivity systems
- Goal Achievement: SMART goals, progressive targets, milestone planning, obstacle anticipation
- Lifestyle Integration: Sustainable practices, work-life balance, social support, environmental factors

SPECIALIZED HEALTH CONDITIONS:
- Neurological Conditions: ADHD, autism, epilepsy, migraines, neurodegenerative diseases
- Metabolic Disorders: Diabetes, insulin resistance, metabolic syndrome, thyroid disorders
- Cardiovascular Disease: Hypertension, heart disease, cholesterol management, circulation issues
- Mental Health Disorders: Depression, anxiety, PTSD, eating disorders, addiction recovery
- Autoimmune Conditions: Inflammatory responses, immune system modulation, symptom management
- Chronic Pain: Pain science, movement therapy, inflammation reduction, pain management strategies
- Hormonal Imbalances: PCOS, menopause, testosterone optimization, adrenal fatigue, cortisol dysregulation

ADVANCED RECOVERY & REGENERATION:
- Sleep Optimization: Sleep architecture, REM/deep sleep, sleep tracking, sleep disorders
- Stress Recovery: HRV training, parasympathetic activation, meditation, breathing techniques
- Physical Recovery: Muscle protein synthesis, inflammation control, tissue repair, adaptation
- Cognitive Recovery: Mental fatigue, decision fatigue, cognitive load management, brain rest
- Hormonal Recovery: Cortisol regulation, growth hormone optimization, recovery hormones

LONGEVITY & ANTI-AGING:
- Cellular Health: Mitochondrial function, autophagy, cellular repair mechanisms, telomere health
- Hormetic Stress: Heat shock proteins, oxidative stress, adaptation responses, resilience building
- Nutrigenomics: Gene expression, epigenetics, nutrient-gene interactions, personalized nutrition
- Biomarkers: Health tracking, diagnostic markers, predictive analytics, health optimization metrics

ANDREW HUBERMAN PROTOCOLS INTEGRATED:
- Morning Light Exposure (10-30 minutes within 1 hour of waking)
- Temperature Manipulation (cold exposure 50-59°F for 11 minutes weekly, sauna 176-212°F 4x20 minutes)
- Breathing Techniques (physiological sighs, box breathing, Wim Hof method)
- Sleep Optimization (cool 65-68°F, dark, consistent timing, magnesium supplementation)
- Exercise Timing (morning for circadian alignment, zone 2 cardio, strength training)
- Caffeine Protocol (90-120 minutes after waking, avoid 8-10 hours before bed)
- NSDR (Non-Sleep Deep Rest) protocols, yoga nidra, meditation
- Dopamine Regulation (cold exposure, exercise, intermittent reinforcement)
- Nutrition Timing (12-16 hour eating window, post-workout protein within 30 minutes)

COMPREHENSIVE PROTOCOL DATABASE:
- Muscle Building: Progressive overload, compound movements, protein 0.8-1.2g/lb, sleep 7-9 hours
- Fat Loss: Caloric deficit 300-500 calories, resistance training, cardio 150-300 minutes weekly
- Athletic Performance: Sport-specific training, periodization, recovery protocols, mental preparation
- Injury Prevention: Movement screening, corrective exercises, load management, recovery protocols
- Stress Management: Meditation 10-20 minutes daily, breathing exercises, nature exposure
- Sleep Optimization: Consistent schedule, temperature control, light management, pre-sleep routine
- Cognitive Enhancement: Brain training, learning protocols, memory techniques, focus strategies
- Hormonal Health: Natural optimization, lifestyle factors, stress management, nutrition support

EVIDENCE-BASED SOURCES:
- Peer-reviewed research from PubMed, Google Scholar, ResearchGate
- Meta-analyses and systematic reviews from Cochrane Library
- Clinical trials and longitudinal studies from major medical journals
- Position statements from ACSM, NSCA, AND, APA, WHO
- Real-world data from wearable technology and biometric tracking
- Expert consensus from leading researchers and practitioners

RESPONSE METHODOLOGY:
- Provide evidence-based, scientifically accurate information
- Include specific protocols, dosages, and timing when relevant
- Reference physiological mechanisms and research findings
- Offer personalized recommendations based on individual factors
- Present actionable steps with clear implementation guidance
- Ask targeted follow-up questions to optimize advice
- Maintain conversational tone while ensuring accuracy

SAFETY & ETHICS:
- Always recommend consulting healthcare providers for medical concerns
- Never diagnose, treat, or provide medical advice for specific conditions
- Emphasize individual variation in responses and adaptation rates
- Stress importance of gradual progression and proper form
- Highlight contraindications, risks, and potential adverse effects
- Respect scope of practice and refer to appropriate professionals

PERSONALIZATION FRAMEWORK:
- Current fitness level and training experience
- Age, biological sex, hormonal status, and life stage
- Existing health conditions, medications, and limitations
- Sleep quality, stress levels, and recovery capacity
- Available time, equipment, and environmental factors
- Specific goals (performance, health, body composition, longevity)
- Lifestyle factors (work schedule, family, travel, etc.)
- Preferences, motivations, and behavioral patterns

RESPONSE STRUCTURE:
1. Acknowledge the question and show understanding
2. Provide science-based explanation of relevant mechanisms
3. Offer specific, actionable protocols and recommendations
4. Include personalization factors and individual considerations
5. Suggest follow-up questions or areas for deeper exploration
6. Reference supporting evidence when appropriate

You are the most comprehensive health intelligence system ever created, capable of addressing ANY question related to human health, performance, psychology, and optimization with scientific accuracy and practical application.`;

interface ConversationContext {
  sessionId: string;
  messageHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  userProfile?: {
    fitnessLevel?: string;
    goals?: string[];
    constraints?: string[];
    preferences?: string[];
  };
}

export class LaunchAIEngine {
  private conversations: Map<string, ConversationContext> = new Map();
  private responseCache: Map<string, any> = new Map();

  async generateResponse(input: {
    message: string;
    sessionId: string;
    category?: string;
    userContext?: any;
  }): Promise<{
    response: string;
    category: string;
    followUpQuestions?: string[];
    protocols?: string[];
    references?: string[];
    responseTime: number;
  }> {
    const startTime = Date.now();

    try {
      // Get or create conversation context
      const context = this.getConversationContext(input.sessionId);
      
      // Add user message to history
      context.messageHistory.push({
        role: 'user',
        content: input.message,
        timestamp: new Date()
      });

      // Analyze message category
      const category = await this.categorizeMessage(input.message);

      // Generate contextual response
      const response = await this.generateContextualResponse(input.message, context, category);

      // Add AI response to history
      context.messageHistory.push({
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      });

      // Update conversation context
      this.conversations.set(input.sessionId, context);

      const responseTime = Date.now() - startTime;

      return {
        ...response,
        category,
        responseTime
      };

    } catch (error) {
      console.error('Launch AI Error:', error);
      const responseTime = Date.now() - startTime;
      
      return {
        response: "I'm experiencing some technical difficulties right now. Let me help you with a focused answer - what specific aspect of fitness or health would you like to explore?",
        category: 'general',
        responseTime
      };
    }
  }

  private getConversationContext(sessionId: string): ConversationContext {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        sessionId,
        messageHistory: []
      });
    }
    return this.conversations.get(sessionId)!;
  }

  private async categorizeMessage(message: string): Promise<string> {
    const categories = {
      'fitness': ['workout', 'exercise', 'training', 'strength', 'cardio', 'muscle'],
      'nutrition': ['diet', 'food', 'eating', 'nutrition', 'calories', 'protein', 'carbs'],
      'sleep': ['sleep', 'rest', 'recovery', 'tired', 'insomnia', 'bedtime'],
      'motivation': ['motivation', 'goals', 'mindset', 'consistency', 'habits'],
      'health': ['health', 'wellness', 'medical', 'symptoms', 'pain'],
      'supplements': ['supplement', 'vitamin', 'creatine', 'protein powder'],
      'protocols': ['protocol', 'routine', 'system', 'approach', 'method']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  private async generateContextualResponse(
    message: string, 
    context: ConversationContext, 
    category: string
  ): Promise<{
    response: string;
    followUpQuestions?: string[];
    protocols?: string[];
    references?: string[];
  }> {

    const lowerMessage = message.toLowerCase();
    
    // Handle all fitness, health, and lifestyle questions with Launch Lifestyle focus

    // Check if this is a vague/general question that needs clarification
    // Only trigger for EXACT vague patterns, not specific questions with context
    const vague_patterns = [
      'i have a fitness question',
      'i have a question about fitness',
      'i need help with fitness',
      'can you help me with fitness',
      'fitness question',
      'health question',
      'what should i do'
    ];
    
    const isVagueQuestion = vague_patterns.some(pattern => 
      lowerMessage === pattern || lowerMessage === pattern + '?'
    );

    let response: string;
    
    if (isVagueQuestion) {
      // For vague questions, provide an engaging welcome and ask for specifics
      response = `Hi there! I'm Launch AI, your evidence-based fitness coach. I'm here to help with all aspects of health and fitness using peer-reviewed research and proven protocols.

I can help you with:
• **Workout Plans** - Strength training, cardio, flexibility routines
• **Nutrition** - Meal planning, macros, supplements, timing  
• **Recovery** - Sleep optimization, stress management, rest protocols
• **Goals** - Muscle building, fat loss, athletic performance
• **Habits** - Consistency, motivation, lifestyle changes
• **Health** - Pain management, injury prevention, wellness

What specific area would you like to dive into? The more specific your question, the better I can tailor my response with actionable protocols.`;
      
    } else {
      // For specific questions, use the knowledge base
      const relevantEntries = searchKnowledge(message);
      
      console.log(`Query: "${message}" | Found ${relevantEntries.length} relevant entries`);
      
      if (relevantEntries.length > 0) {
        const topEntry = relevantEntries[0];
        
        // Safety check to ensure topEntry exists and has required properties
        if (!topEntry || !topEntry.topic || !topEntry.content) {
          console.error('Invalid knowledge entry found:', topEntry);
          return this.generateContextualResponse(message);
        }
        
        console.log(`Using knowledge entry: ${topEntry.topic} (Category: ${topEntry.category})`);
        
        // Always use the specific knowledge content
        response = topEntry.content;
      
        // Add actionable protocols
        if (topEntry.protocols && topEntry.protocols.length > 0) {
          response += `\n\n**ACTION STEPS:**`;
          topEntry.protocols.slice(0, 5).forEach((protocol, index) => {
            response += `\n${index + 1}. ${protocol}`;
          });
        }
        
        // Add scientific mechanisms if available
        if (topEntry.mechanisms && topEntry.mechanisms.length > 0) {
          response += `\n\n**THE SCIENCE:** ${topEntry.mechanisms.slice(0, 2).join('. ')}.`;
        }
        
        response += `\n\nWhat specific aspect would you like me to dive deeper into?`;
        
      } else {
        // Motivation and accountability question - provide comprehensive guidance
        if (message.toLowerCase().includes('motivat') || message.toLowerCase().includes('accountab') || 
            message.toLowerCase().includes('consist') || message.toLowerCase().includes('stick')) {
        
        response = `**MOTIVATION & ACCOUNTABILITY MASTERY**

**THE SCIENCE:** Motivation is unreliable - it's an emotion that fluctuates. Successful people rely on systems, not motivation. Research shows accountability increases goal achievement by 65%.

**CONSISTENCY FRAMEWORK:**

1. **Environmental Design** - Make good choices easier than bad ones
   - Lay out workout clothes the night before
   - Keep water bottle visible
   - Remove obstacles to healthy habits

2. **Implementation Intentions** - "If X, then Y" planning
   - "If it's 6 AM, then I exercise for 20 minutes"
   - "If I feel unmotivated, then I do just 5 minutes"

3. **Accountability Systems**
   - Track workouts in the Launch app
   - Share goals with workout partner
   - Schedule non-negotiable workout times

4. **Progress Tracking** - What gets measured gets managed
   - Take progress photos weekly
   - Record workout performance
   - Monitor energy levels and mood

5. **Identity-Based Habits** - "I am someone who exercises daily"
   - Focus on becoming the type of person who works out
   - Make choices that align with your fitness identity

**EMERGENCY MOTIVATION PROTOCOL:**
When motivation is low: Do the minimum effective dose. Even 5 push-ups maintains the habit chain.

What's your biggest consistency challenge right now?`;
        } 
        // General health questions - direct to comprehensive approach
        else {
          response = `I provide science-backed guidance across comprehensive health domains. What specific area would you like to explore? I cover muscle building, cardiovascular health, nutrition optimization, sleep science, stress management, habit formation, longevity protocols, and much more. Each response includes practical protocols based on peer-reviewed research.`;
        }
      }
    }

    // Generate contextual follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(category, context);

    return {
      response,
      followUpQuestions
    };
  }

  private generateFollowUpQuestions(category: string, context: ConversationContext): string[] {
    const questionMap: { [key: string]: string[] } = {
      'muscle_building': [
        'What\'s your current training experience level?',
        'How many days per week can you commit to resistance training?',
        'Do you have any dietary restrictions or preferences?'
      ],
      'sleep': [
        'What time do you typically go to bed and wake up?',
        'Are you experiencing any specific sleep challenges?',
        'What\'s your current bedroom environment like?'
      ],
      'hydration': [
        'How intense and long are your typical workouts?',
        'Do you live in a hot climate or sweat heavily during exercise?',
        'Are you currently tracking your fluid intake?'
      ],
      'nutrition': [
        'What are your primary fitness goals?',
        'What does your current meal timing look like?',
        'Do you have any food allergies or intolerances?'
      ],
      'psychology': [
        'What specific habits are you trying to build or break?',
        'What\'s been your biggest challenge with consistency?',
        'What motivates you most in your fitness journey?'
      ],
      'recovery': [
        'How do you currently handle rest days?',
        'What\'s your sleep quality like on a scale of 1-10?',
        'Do you use any recovery tools like foam rolling or massage?'
      ],
      'cardiovascular': [
        'What\'s your current activity level?',
        'Do you prefer steady-state cardio or interval training?',
        'Have you had any cardiovascular health assessments?'
      ]
    };

    const baseQuestions = questionMap[category] || [
      'What\'s your current fitness level?',
      'What are your primary health and fitness goals?'
    ];

    // Filter out questions already addressed in conversation
    const conversationText = context.messageHistory
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    return baseQuestions.filter(question => {
      const questionKeywords = question.toLowerCase().split(' ');
      return !questionKeywords.some(keyword => conversationText.includes(keyword));
    }).slice(0, 2);
  }

  private extractFollowUpQuestions(response: string): string[] {
    const questions: string[] = [];
    const questionMarkers = ['?', 'What about', 'Have you considered', 'Would you like'];
    
    const sentences = response.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.includes('?') || questionMarkers.some(marker => sentence.includes(marker))) {
        const cleanQuestion = sentence.trim();
        if (cleanQuestion.length > 10 && cleanQuestion.length < 100) {
          questions.push(cleanQuestion + (cleanQuestion.endsWith('?') ? '' : '?'));
        }
      }
    }
    
    return questions.slice(0, 3);
  }

  private extractProtocols(response: string): string[] {
    const protocols: string[] = [];
    const protocolKeywords = ['protocol', 'routine', 'method', 'approach', 'technique', 'strategy'];
    
    const sentences = response.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (protocolKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        const cleanProtocol = sentence.trim();
        if (cleanProtocol.length > 20 && cleanProtocol.length < 150) {
          protocols.push(cleanProtocol);
        }
      }
    }
    
    return protocols.slice(0, 2);
  }

  // Method to update user profile based on conversation
  updateUserProfile(sessionId: string, profileData: any): void {
    const context = this.getConversationContext(sessionId);
    context.userProfile = { ...context.userProfile, ...profileData };
    this.conversations.set(sessionId, context);
  }

  // Get conversation insights for analytics
  getConversationInsights(sessionId: string): {
    messageCount: number;
    categories: string[];
    duration: number;
    engagementLevel: 'high' | 'medium' | 'low';
  } {
    const context = this.conversations.get(sessionId);
    if (!context) {
      return { messageCount: 0, categories: [], duration: 0, engagementLevel: 'low' };
    }

    const messageCount = context.messageHistory.length;
    const categoriesSet = new Set(context.messageHistory.map(msg => 'general')); // Simplified for now
    const categories = Array.from(categoriesSet);
    
    const firstMessage = context.messageHistory[0];
    const lastMessage = context.messageHistory[context.messageHistory.length - 1];
    const duration = lastMessage ? lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime() : 0;

    const engagementLevel = messageCount > 10 ? 'high' : messageCount > 5 ? 'medium' : 'low';

    return { messageCount, categories, duration, engagementLevel };
  }

  // Cleanup old conversations
  cleanupOldConversations(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [sessionId, context] of Array.from(this.conversations)) {
      const lastMessage = context.messageHistory[context.messageHistory.length - 1];
      if (lastMessage && lastMessage.timestamp.getTime() < oneHourAgo) {
        this.conversations.delete(sessionId);
      }
    }
  }
}

// Global Launch AI instance
export const launchAI = new LaunchAIEngine();

// Export function for API use
export async function generateChatResponse(input: {
  message: string;
  sessionId: string;
  category?: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  region?: string;
}): Promise<{
  response: string;
  category: string;
  followUpQuestions?: string[];
  protocols?: string[];
  references?: string[];
  responseTime: number;
}> {
  return await launchAI.generateResponse({
    message: input.message,
    sessionId: input.sessionId,
    category: input.category,
    userContext: {
      location: {
        country: input.country,
        city: input.city,
        region: input.region
      },
      device: input.userAgent
    }
  });
}

// Health topics for quick access
export const healthTopics = {
  'hydration': {
    title: 'Hydration and Performance',
    keyPoints: [
      '2% dehydration reduces performance by 20%',
      'Electrolyte balance is crucial for muscle function',
      'Timing matters: pre, during, and post-exercise hydration'
    ]
  },
  'sleep': {
    title: 'Sleep Optimization',
    keyPoints: [
      'Sleep quality affects performance by up to 35%',
      'Temperature, light, and timing are key factors',
      'Recovery happens primarily during deep sleep phases'
    ]
  },
  'nutrition_timing': {
    title: 'Nutrition Timing',
    keyPoints: [
      'Protein synthesis window is longer than previously thought',
      'Carb timing affects workout performance and recovery',
      'Meal frequency matters less than total daily intake'
    ]
  },
  'strength_training': {
    title: 'Strength Training Science',
    keyPoints: [
      'Progressive overload is the fundamental principle',
      'Compound movements provide maximum efficiency',
      'Recovery between sessions determines adaptation'
    ]
  }
};