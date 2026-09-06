import { searchKnowledge } from './launch-ai-knowledge-base';

interface ChatRequest {
  message: string;
  sessionId: string;
  category?: string;
  userContext?: any;
}

interface ChatResponse {
  response: string;
  category: string;
  sessionId: string;
  responseTime: number;
  followUpQuestions?: string[];
}

export class LaunchAIEngine {
  async generateResponse(input: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    
    try {
      const category = this.categorizeMessage(input.message);
      const messageLower = input.message.toLowerCase();
      let response: string;
      
      // Direct motivation and accountability handling
      if ((messageLower.includes('motivat') && messageLower.includes('accountab')) || 
          (messageLower.includes('stay motivated') && messageLower.includes('fitness goals'))) {
        
        response = `**MOTIVATION & ACCOUNTABILITY MASTERY**

**THE SCIENCE:** Sustained motivation comes from intrinsic factors: progress tracking, goal achievement, and social support. Research shows accountability increases adherence by 65%. Key strategies include habit stacking, progress visualization, and external accountability partners.

**ACTION STEPS:**
1. Set specific, measurable goals with deadlines
2. Track daily progress using Launch Lifestyle app
3. Share goals with accountability partner or coach
4. Celebrate small wins to maintain momentum
5. Use habit stacking to build consistency

**THE SCIENCE:** Intrinsic motivation theory. Social accountability.

The Launch Lifestyle app provides built-in accountability through progress tracking, streak counters, and community features.

What specific aspect of motivation would you like me to dive deeper into?`;
        
      } else {
        // Search the comprehensive knowledge base for other topics
        const relevantEntries = searchKnowledge(input.message);
        
        console.log(`Query: "${input.message}" | Found ${relevantEntries.length} relevant entries`);
        
        if (relevantEntries.length > 0) {
          const topEntry = relevantEntries[0];
          console.log(`Using knowledge entry: ${topEntry.topic} (Category: ${topEntry.category})`);
          
          response = topEntry.content;
          
          if (topEntry.protocols && topEntry.protocols.length > 0) {
            response += `\n\n**ACTION STEPS:**`;
            topEntry.protocols.slice(0, 5).forEach((protocol, index) => {
              response += `\n${index + 1}. ${protocol}`;
            });
          }
          
          if (topEntry.mechanisms && topEntry.mechanisms.length > 0) {
            response += `\n\n**THE SCIENCE:** ${topEntry.mechanisms.slice(0, 2).join('. ')}.`;
          }
          
          response += `\n\nWhat specific aspect would you like me to dive deeper into?`;
          
        } else {
          if (messageLower.includes('motivat') || messageLower.includes('accountab') || 
              messageLower.includes('consist') || messageLower.includes('stick')) {
            
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
            
          } else {
            response = `I specialize in science-backed health and fitness guidance. I can help you with:

**Fitness & Training:**
- Muscle building and strength protocols
- Workout programming and periodization
- Exercise technique and form optimization

**Nutrition & Metabolism:**
- Evidence-based supplement recommendations
- Macronutrient timing and optimization
- Weight management strategies

**Recovery & Performance:**
- Sleep optimization protocols
- Stress management techniques
- Recovery and regeneration strategies

**Psychology & Habits:**
- Consistency and motivation systems
- Habit formation science
- Mental performance optimization

What specific area would you like to explore? I'll provide detailed, research-backed protocols.`;
          }
        }
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        response,
        category,
        sessionId: input.sessionId,
        responseTime
      };
      
    } catch (error) {
      console.error('Launch AI Error:', error);
      const responseTime = Date.now() - startTime;
      
      return {
        response: "I'm experiencing technical difficulties. Let me help you with a focused answer - what specific aspect of fitness or health would you like to explore?",
        category: 'general',
        sessionId: input.sessionId,
        responseTime
      };
    }
  }
  
  private categorizeMessage(message: string): string {
    const categories = {
      'fitness': ['workout', 'exercise', 'training', 'strength', 'cardio', 'muscle', 'lift', 'gym'],
      'nutrition': ['diet', 'food', 'eating', 'nutrition', 'calories', 'protein', 'carbs', 'supplement'],
      'sleep': ['sleep', 'rest', 'recovery', 'tired', 'insomnia', 'bedtime'],
      'motivation': ['motivation', 'goals', 'mindset', 'consistency', 'habits', 'accountab', 'disciplin'],
      'health': ['health', 'wellness', 'medical', 'symptoms', 'pain'],
      'psychology': ['psychology', 'mental', 'stress', 'anxiety', 'focus', 'confidence']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }
}