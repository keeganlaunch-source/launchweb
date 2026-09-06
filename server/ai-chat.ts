import type { Request, Response } from 'express';
import { storage } from './storage';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ChatRequest {
  message: string;
  category?: string;
  sessionId?: string;
}

interface ChatResponse {
  response: string;
  category: string;
  sessionId: string;
  responseTime: number;
}

// Coach Keegs' fitness knowledge base with comprehensive responses
const fitnessKnowledgeBase = {
  workout_plans: {
    beginner: "Start with 3 days per week: Day 1 - Upper body (push-ups, rows, overhead press), Day 2 - Lower body (squats, lunges, glute bridges), Day 3 - Full body circuit. Begin with bodyweight exercises, 2-3 sets of 8-12 reps. Focus on proper form over heavy weight.",
    intermediate: "4-5 days per week split: Day 1 - Push (chest, shoulders, triceps), Day 2 - Pull (back, biceps), Day 3 - Legs, Day 4 - Upper power, Day 5 - Lower power. Progressive overload is key - increase weight by 5-10% when you can complete all sets with perfect form.",
    advanced: "5-6 day periodized program with strength blocks (3-5 reps, 85-95% 1RM), hypertrophy blocks (6-12 reps, 65-85% 1RM), and power blocks (1-5 reps, explosive). Include compound movements like deadlifts, squats, bench press, and Olympic lifts."
  },
  nutrition: {
    weight_loss: "Create a moderate caloric deficit of 300-500 calories below maintenance. Prioritize protein (0.8-1g per lb bodyweight), include healthy fats (20-35% of calories), and time carbs around workouts. Eat whole foods 80% of the time.",
    muscle_gain: "Eat in a slight surplus of 200-300 calories above maintenance. Protein intake of 1-1.2g per lb bodyweight, spread across 4-5 meals. Post-workout nutrition within 2 hours: protein + carbs. Stay hydrated with 0.5-1oz water per lb bodyweight daily.",
    performance: "Fuel performance with strategic carb timing: 1-2 hours pre-workout (30-60g carbs), during long sessions (30g/hour), and post-workout (1.5-2g carbs per kg bodyweight). Include creatine (3-5g daily) and adequate sleep (7-9 hours)."
  },
  motivation: {
    consistency: "Build habits, not motivation. Start with 15-20 minute sessions if that's all you can manage. Schedule workouts like important appointments. Track small wins daily. Remember: showing up is 80% of success. Progress isn't always linear - trust the process.",
    plateau: "Plateaus are normal and often mean you need a change. Options: Increase training volume, change exercise selection, adjust rest periods, or take a deload week. Sometimes your body needs recovery to adapt and grow stronger.",
    mindset: "Embrace the discomfort - that's where growth happens. Set process goals (I'll workout 4x this week) vs outcome goals (I'll lose 10 lbs). Celebrate small victories. Your only competition is who you were yesterday."
  },
  specific_exercises: {
    squats: "Feet shoulder-width apart, toes slightly out. Initiate with hips back, knees track over toes. Descend until hip crease below knee cap. Drive through heels to stand. Keep chest up and core tight throughout.",
    deadlifts: "Bar over mid-foot, shins touching bar. Hinge at hips, keep back neutral. Grip just outside legs. Drive through heels, squeeze glutes at top. Lower with control, bar stays close to body.",
    push_ups: "Hands under shoulders, body in straight line from head to heels. Lower chest to floor, press up explosively. Modify on knees if needed. Progress to decline, diamond, or single-arm variations."
  }
};

function generateMuscleBuilding4WeekPlan(): string {
  return `**4-WEEK HOME MUSCLE BUILDING PLAN**

**SCIENCE**: Progressive overload + adequate protein (1.8-2.6g/kg bodyweight) + 7-9 hours sleep = muscle growth. Studies show bodyweight training can build muscle effectively when performed to near failure.

**WEEK 1-2: FOUNDATION**
*Monday/Thursday - Upper Body:*
• Push-ups: 3 sets x 8-12 reps
• Pike push-ups: 3 sets x 6-10 reps  
• Tricep dips (chair): 3 sets x 8-12 reps
• Pull-ups/inverted rows: 3 sets x 5-8 reps
• Plank: 3 sets x 30-45 seconds

*Tuesday/Friday - Lower Body:*
• Squats: 3 sets x 12-15 reps
• Lunges: 3 sets x 10 each leg
• Single-leg glute bridges: 3 sets x 12 each leg
• Calf raises: 3 sets x 15-20 reps
• Wall sit: 3 sets x 30-45 seconds

*Wednesday - Full Body Circuit:*
• Burpees: 3 sets x 5-8 reps
• Mountain climbers: 3 sets x 20 reps
• Jump squats: 3 sets x 8-12 reps
• Push-up to T: 3 sets x 6-10 reps

**WEEK 3-4: PROGRESSION**
*Same exercises, increased intensity:*
• Add 2-3 reps per set
• Increase hold times by 10-15 seconds
• Add single-arm/single-leg variations
• Decrease rest periods by 10-15 seconds

**PROTOCOLS:**
• Rest 48-72 hours between muscle groups
• Progressive overload: increase reps/time weekly
• Post-workout protein within 2 hours
• Track workouts in Launch Lifestyle app

**RESULTS**: Expect 1-2 kg muscle gain with proper nutrition and consistency.`;
}

function generateWeightLoss4WeekPlan(): string {
  return `**4-WEEK FAT LOSS WORKOUT PLAN**

**SCIENCE**: Create a 300-500 calorie deficit through exercise + diet. HIIT burns 25-30% more calories than steady cardio and elevates metabolism for 24 hours post-workout.

**WEEK 1-2: METABOLIC FOUNDATION**
*Monday/Wednesday/Friday - HIIT Circuit:*
• Jumping jacks: 30 seconds on, 30 seconds rest
• Burpees: 20 seconds on, 40 seconds rest
• High knees: 30 seconds on, 30 seconds rest
• Squat jumps: 20 seconds on, 40 seconds rest
• Complete 4 rounds

*Tuesday/Thursday - Strength Circuit:*
• Push-ups: 45 seconds work, 15 seconds rest
• Squats: 45 seconds work, 15 seconds rest
• Plank: 45 seconds work, 15 seconds rest
• Lunges: 45 seconds work, 15 seconds rest
• Complete 3 rounds

*Saturday - Active Recovery:*
• 30-45 minute walk
• Stretching/yoga

**WEEK 3-4: INTENSIFICATION**
• Increase work periods by 10 seconds
• Decrease rest periods by 5 seconds
• Add resistance band variations
• Include plyometric movements

**NUTRITION PROTOCOL:**
• Eat in 300-500 calorie deficit
• Protein: 2.2g per kg bodyweight
• Time carbs around workouts
• Stay hydrated: 35-40ml per kg bodyweight

**RESULTS**: Expect 0.5-1 kg fat loss per week with proper nutrition adherence.`;
}

function generateStrength4WeekPlan(): string {
  return `**4-WEEK STRENGTH BUILDING PLAN**

**SCIENCE**: Strength gains occur through neuromuscular adaptations (weeks 1-4) and muscle fiber recruitment. Focus on 3-6 reps at 85-95% effort for maximum strength development.

**WEEK 1-2: NEURAL ADAPTATION**
*Monday - Push Focus:*
• Archer push-ups: 4 sets x 3-5 each arm
• Handstand progressions: 4 sets x 30-60 seconds
• Diamond push-ups: 3 sets x 6-8 reps
• Pike push-ups: 3 sets x 5-8 reps

*Wednesday - Pull Focus:*
• One-arm push-up progression: 4 sets x 3-5 reps
• Pull-up variations: 4 sets x 3-6 reps
• Inverted rows: 3 sets x 8-10 reps
• Hollow body hold: 3 sets x 30-45 seconds

*Friday - Lower Power:*
• Jump squats: 4 sets x 5-8 reps
• Single-leg squats (pistol progression): 4 sets x 3-5 each leg
• Bulgarian split squats: 3 sets x 6-8 each leg
• Single-leg calf raises: 3 sets x 8-12 each leg

**WEEK 3-4: STRENGTH CONSOLIDATION**
• Progress to harder variations
• Increase hold times for isometrics
• Add explosive movements
• Focus on perfect form

**PROTOCOLS:**
• Rest 2-3 minutes between sets
• Train every other day for full recovery
• Focus on progressive difficulty, not reps
• Track strength milestones weekly

**RESULTS**: Expect 15-25% strength increases in first 4 weeks through improved motor unit recruitment.`;
}

function categorizeQuestion(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('training') || lowerMessage.includes('routine')) {
    return 'fitness';
  }
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('eat') || lowerMessage.includes('food') || lowerMessage.includes('meal')) {
    return 'nutrition';
  }
  if (lowerMessage.includes('motivat') || lowerMessage.includes('consistent') || lowerMessage.includes('struggle') || lowerMessage.includes('mindset')) {
    return 'motivation';
  }
  if (lowerMessage.includes('progress') || lowerMessage.includes('track') || lowerMessage.includes('measure') || lowerMessage.includes('result')) {
    return 'progress';
  }
  return 'general';
}

// Import the comprehensive knowledge base
import { generateOfflineResponse } from './launch-ai-knowledge-base.js';

// Comprehensive offline response generation using our knowledge base
export async function generateAIResponse(message: string): Promise<string> {
  // Use comprehensive offline knowledge base exclusively - no external API calls
  const offlineResponse = generateOfflineResponse(message);
  return offlineResponse.response;
}



function generatePatternResponse(message: string, category: string): string {
  const lowerMessage = message.toLowerCase();
  
  // INSTANT ANSWER QUESTIONS - EXACT MATCHES FOR CLICKABLE QUESTIONS
  
  // Fitness apps and tools question
  if (lowerMessage.includes('fitness apps') || (lowerMessage.includes('best') && lowerMessage.includes('fitness') && lowerMessage.includes('apps')) || (lowerMessage.includes('apps') && lowerMessage.includes('tracking') && lowerMessage.includes('workouts'))) {
    return `**SCIENCE**: Consistent tracking increases workout adherence by 40-60% and accelerates progress through data-driven adjustments.

**PROTOCOL**:
• **Launch Lifestyle App** - Your complete fitness ecosystem with personalized plans, progress tracking, and Coach Keegs integration
• **MyFitnessPal** - Comprehensive food tracking with macro counting
• **Strava** - Excellent for running/cycling with community features
• **Sleep Cycle** - Sleep optimization for recovery
• **Headspace** - Mindfulness for stress management

**ACTION STEPS**:
1. Start with Launch Lifestyle app for workout programming
2. Add nutrition tracking for complete picture
3. Monitor sleep quality for recovery optimization
4. Track key metrics: weight lifted, reps, body measurements

What specific fitness goal would you like app recommendations for?`;
  }
  
  // "Create a 4-week workout plan for building muscle at home"
  if (lowerMessage.includes('create') && lowerMessage.includes('4-week') && lowerMessage.includes('workout') && lowerMessage.includes('muscle') && lowerMessage.includes('home')) {
    return generateMuscleBuilding4WeekPlan();
  }
  
  // "What should I eat to support my fitness goals?"
  if (lowerMessage.includes('what should i eat') && lowerMessage.includes('support') && lowerMessage.includes('fitness goals')) {
    return `Nutrition is crucial for your fitness goals! Eat in a slight surplus of 300-500 calories above maintenance. Protein intake of 2.2-2.6g per kg bodyweight, spread across 4-5 meals. Post-workout nutrition within 2 hours: protein + carbs. Stay hydrated with 35-40ml water per kg bodyweight daily. Focus on whole foods: lean proteins, complex carbs, healthy fats, and plenty of vegetables. Meal prep on Sundays to set yourself up for success during the week.`;
  }
  
  // "I'm struggling to stay consistent with my workouts"
  if (lowerMessage.includes('struggling') && lowerMessage.includes('stay consistent') && lowerMessage.includes('workouts')) {
    return `Consistency is the secret sauce! ${fitnessKnowledgeBase.motivation.consistency} Here's my top tip: Lower the barrier to entry. Lay out your workout clothes the night before. Make it easier to do the right thing than the wrong thing.`;
  }
  
  // "How do I track my fitness progress effectively?"
  if (lowerMessage.includes('how do i track') && lowerMessage.includes('fitness progress') && lowerMessage.includes('effectively')) {
    return `Effective progress tracking involves multiple metrics beyond just weight! Track: 1) **Performance metrics** - reps, sets, weight lifted, endurance improvements. 2) **Body measurements** - waist, hips, chest, arms weekly. 3) **Energy levels** - rate 1-10 daily. 4) **Sleep quality** - hours and how rested you feel. 5) **Photos** - same time, lighting, poses monthly. 6) **How clothes fit** - often more accurate than scales. Remember: muscle weighs more than fat, so don't rely solely on the scale!`;
  }
  
  // Coaching and service questions - PRIORITY MATCHING
  if ((lowerMessage.includes('basic') || lowerMessage.includes('premium')) && (lowerMessage.includes('coaching') || lowerMessage.includes('coach'))) {
    return `Great question about coaching options! **BASIC COACHING** includes: structured workout plans, nutrition guidelines, progress tracking tools, and community support. **PREMIUM COACHING** adds: 1-on-1 personalized sessions, custom meal planning, real-time form corrections, priority support, advanced analytics, and direct access to Coach Keegs. Premium also includes weekly check-ins, goal adjustments, and accountability partnerships. The key difference: Basic gives you the roadmap, Premium gives you a personal guide walking beside you every step of the way.`;
  }
  
  // Handle variations with "difference" or "compare"
  if ((lowerMessage.includes('difference') || lowerMessage.includes('compare')) && 
      (lowerMessage.includes('basic') || lowerMessage.includes('premium')) && 
      (lowerMessage.includes('coaching') || lowerMessage.includes('fitness coaching'))) {
    return `Great question about coaching options! **BASIC COACHING** includes: structured workout plans, nutrition guidelines, progress tracking tools, and community support. **PREMIUM COACHING** adds: 1-on-1 personalized sessions, custom meal planning, real-time form corrections, priority support, advanced analytics, and direct access to Coach Keegs. Premium also includes weekly check-ins, goal adjustments, and accountability partnerships. The key difference: Basic gives you the roadmap, Premium gives you a personal guide walking beside you every step of the way.`;
  }
  
  if (lowerMessage.includes('coaching') || lowerMessage.includes('personal trainer') || lowerMessage.includes('coach')) {
    return `Coaching can transform your fitness journey! I provide science-backed guidance, personalized plans, and accountability to help you reach your goals faster. Whether you need workout programming, nutrition advice, or mindset coaching - I'm here to support you. My approach combines evidence-based methods with practical strategies that fit your lifestyle. What specific area would you like coaching support with?`;
  }
  
  // Comprehensive workout plan responses
  if (lowerMessage.includes('4-week') || lowerMessage.includes('4 week') || lowerMessage.includes('month')) {
    if (lowerMessage.includes('muscle') && (lowerMessage.includes('build') || lowerMessage.includes('gain') || lowerMessage.includes('home'))) {
      return generateMuscleBuilding4WeekPlan();
    }
    if (lowerMessage.includes('weight loss') || lowerMessage.includes('fat loss') || lowerMessage.includes('lean')) {
      return generateWeightLoss4WeekPlan();
    }
    if (lowerMessage.includes('strength')) {
      return generateStrength4WeekPlan();
    }
    // Default to muscle building if "4-week" and "workout" are mentioned
    if (lowerMessage.includes('workout') || lowerMessage.includes('plan') || lowerMessage.includes('routine')) {
      return generateMuscleBuilding4WeekPlan();
    }
  }
  
  // Specific exercise responses
  if (lowerMessage.includes('squat')) {
    return `Great question about squats! ${fitnessKnowledgeBase.specific_exercises.squats} Start with bodyweight squats and focus on mobility. Common mistakes: knees caving in, not going deep enough, weight on toes instead of heels.`;
  }
  
  if (lowerMessage.includes('deadlift')) {
    return `Deadlifts are the king of exercises! ${fitnessKnowledgeBase.specific_exercises.deadlifts} Start light and master the hip hinge pattern. Never sacrifice form for weight - your back will thank you later.`;
  }
  
  if (lowerMessage.includes('push') && lowerMessage.includes('up')) {
    return `Push-ups are a fantastic foundational exercise! ${fitnessKnowledgeBase.specific_exercises.push_ups} Remember: quality over quantity. 5 perfect push-ups beat 20 sloppy ones every time.`;
  }
  
  // Workout plan responses - order matters!
  // Check for specific 4-week plans first
  if (lowerMessage.includes('4-week') || lowerMessage.includes('4 week') || lowerMessage.includes('month')) {
    if (lowerMessage.includes('muscle') && (lowerMessage.includes('build') || lowerMessage.includes('gain') || lowerMessage.includes('home'))) {
      return generateMuscleBuilding4WeekPlan();
    }
    if (lowerMessage.includes('weight loss') || lowerMessage.includes('fat loss') || lowerMessage.includes('lean')) {
      return generateWeightLoss4WeekPlan();
    }
    if (lowerMessage.includes('strength')) {
      return generateStrength4WeekPlan();
    }
    // Default to muscle building if "4-week" and "workout" are mentioned
    if (lowerMessage.includes('workout') || lowerMessage.includes('plan') || lowerMessage.includes('routine')) {
      return generateMuscleBuilding4WeekPlan();
    }
  }
  
  if (lowerMessage.includes('beginner') || (lowerMessage.includes('start') && lowerMessage.includes('workout'))) {
    return `Welcome to your fitness journey! ${fitnessKnowledgeBase.workout_plans.beginner} Remember: consistency beats perfection. Start where you are, use what you have, do what you can. Your future self will thank you for starting today.`;
  }
  
  if (lowerMessage.includes('muscle') && (lowerMessage.includes('build') || lowerMessage.includes('gain'))) {
    return `**SCIENCE**: Muscle protein synthesis increases 2-4x for 24-48 hours post-exercise. Combining resistance training with adequate protein maximizes hypertrophy.

**PROTOCOL**: 
• Train each muscle group 2-3x per week
• 6-20 reps per set for hypertrophy
• 2.2-2.6g protein per kg bodyweight daily
• 7-9 hours sleep for recovery

**ACTION STEPS**:
1. Follow progressive overload: add weight/reps weekly
2. Eat protein within 2 hours post-workout
3. Track workouts in Launch Lifestyle app
4. Allow 48-72 hours between training same muscles

Consistency beats perfection - trust the process!`;
  }
  
  // Nutrition responses
  if (lowerMessage.includes('lose weight') || lowerMessage.includes('fat loss')) {
    return `Weight loss is absolutely achievable with the right strategy! ${fitnessKnowledgeBase.nutrition.weight_loss} Remember: sustainable changes beat extreme diets. Focus on creating healthy habits you can maintain long-term.`;
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('eat')) {
    return `**SCIENCE**: Protein synthesis requires consistent amino acid availability. Nutrient timing optimizes recovery and performance adaptations.

**PROTOCOL**: 
• 2.2-2.6g protein per kg bodyweight daily
• Eat protein every 3-4 hours
• Post-workout nutrition within 2 hours
• 35-40ml water per kg bodyweight daily

**ACTION STEPS**:
1. Plan protein source for each meal (chicken, fish, eggs, legumes)
2. Include vegetables with lunch and dinner
3. Time carbs around workouts for energy
4. Meal prep on Sundays for consistency

Focus on whole foods 80% of the time for optimal results.`;
  }
  
  // Motivation responses
  if (lowerMessage.includes('consistent') || lowerMessage.includes('motivation')) {
    return `Consistency is the secret sauce! ${fitnessKnowledgeBase.motivation.consistency} Here's my top tip: Lower the barrier to entry. Lay out your workout clothes the night before. Make it easier to do the right thing than the wrong thing.`;
  }
  
  if (lowerMessage.includes('plateau') || lowerMessage.includes('stuck')) {
    return `Plateaus are actually a sign of progress - your body has adapted! ${fitnessKnowledgeBase.motivation.plateau} This is where most people quit, but winners push through. Change your variables and keep going. Breakthrough is just around the corner.`;
  }
  
  // Category-based fallback responses with professional formatting
  switch (category) {
    case 'fitness':
      return `**SCIENCE**: Compound movements recruit multiple muscle groups simultaneously, maximizing training efficiency and hormonal response.

**PROTOCOL**: 
• Focus on the big 4: squats, deadlifts, push-ups, rows
• Train 3x per week with rest days between sessions
• Apply progressive overload weekly

**ACTION STEPS**:
1. Master bodyweight versions first
2. Add resistance/reps when you can complete all sets perfectly
3. Track workouts in Launch Lifestyle app
4. Allow 48-72 hours recovery between sessions

What specific movement would you like me to break down?`;
      
    case 'nutrition':
      return `**SCIENCE**: Protein synthesis peaks 1-3 hours post-meal and requires consistent amino acid availability throughout the day.

**PROTOCOL**: 
• 1.8-2.6g protein per kg bodyweight daily
• Include vegetables at every meal
• Follow 80/20 rule (whole foods 80% of time)
• Hydrate: 35ml per kg bodyweight daily

**ACTION STEPS**:
1. Plan protein with each meal (palm-sized portion)
2. Prep vegetables weekly
3. Track intake for 7 days to establish baseline
4. Adjust portions based on training intensity

What's your primary nutrition goal?`;
      
    case 'motivation':
      return `**SCIENCE**: Habit formation requires consistent neural pathway reinforcement - typically 21-66 days depending on complexity.

**PROTOCOL**: 
• Start small: 15-minute sessions build momentum
• Use habit stacking (link to existing routines)
• Focus on showing up, not perfection
• Celebrate micro-wins daily

**ACTION STEPS**:
1. Choose your smallest possible version (10 push-ups vs 60-min workout)
2. Link to existing habit (after coffee, before shower)
3. Track daily completion streaks
4. Reward consistency, not just outcomes

What's your biggest consistency challenge?`;
      
    case 'progress':
      return `**SCIENCE**: Multiple metrics provide comprehensive body composition and performance feedback beyond scale weight fluctuations.

**PROTOCOL**: 
• Weekly: body measurements, photos, strength benchmarks
• Daily: energy levels (1-10), sleep quality, mood
• Monthly: fitness assessments, goal reviews
• Never rely solely on scale weight

**ACTION STEPS**:
1. Take baseline measurements (waist, hips, chest, arms)
2. Same-time weekly photos (consistent lighting/poses)
3. Track key lifts or bodyweight exercise progression
4. Use Launch Lifestyle app for comprehensive tracking

Which metrics matter most for your goals?`;
      
    default:
      return `**WELCOME TO LAUNCH AI** 🚀

I'm your science-backed fitness coach here to help you achieve sustainable results through proven protocols.

**MY EXPERTISE**:
• Exercise science & program design
• Nutrition optimization & meal planning  
• Psychology of habit formation
• Recovery & performance enhancement

**HOW I HELP**:
• Personalized, actionable advice
• Science-based protocols that work
• Metric system measurements
• Integration with Launch Lifestyle app

**GET STARTED**: Ask me anything about fitness, nutrition, motivation, or progress tracking. I'll provide structured, professional guidance tailored to your goals.

What's your biggest health challenge right now?`;
  }
}

export async function handleChatRequest(req: Request, res: Response) {
  const startTime = Date.now();
  
  try {
    const { message, category, sessionId } = req.body as ChatRequest;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Generate session ID if not provided
    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Categorize the question
    const questionCategory = category || categorizeQuestion(message);
    
    // Generate response using AI or pattern matching fallback
    const aiResponse = await generateAIResponse(message);
    
    const responseTime = Date.now() - startTime;
    
    // Store chat session (simplified for immediate functionality)
    try {
      // Note: This would normally use the storage interface once properly implemented
      console.log('Chat session:', {
        sessionId: chatSessionId,
        question: message,
        response: aiResponse,
        category: questionCategory,
        responseTime
      });
    } catch (storageError) {
      console.warn('Storage error (continuing without storage):', storageError);
    }
    
    const response: ChatResponse = {
      response: aiResponse,
      category: questionCategory,
      sessionId: chatSessionId,
      responseTime
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an issue. Please try again in a moment.',
      response: "I'm experiencing some technical difficulties right now, but I'm still here to help! Could you please rephrase your question? In the meantime, remember: consistency is key to any fitness journey. Keep showing up, and results will follow!",
      category: 'general',
      sessionId: `fallback_${Date.now()}`,
      responseTime: Date.now() - startTime
    });
  }
}

export async function getChatAnalytics(req: Request, res: Response) {
  try {
    // Mock analytics data for immediate functionality
    const analytics = {
      totalChats: 127,
      todayChats: 8,
      weeklyChats: 34,
      averageRating: 4.7,
      averageResponseTime: 850,
      topQuestions: [
        { question: "How to build muscle at home?", count: 23 },
        { question: "Best workout routine for beginners", count: 19 },
        { question: "What should I eat to lose weight?", count: 17 },
        { question: "How to stay motivated?", count: 15 }
      ],
      questionCategories: [
        { category: "fitness", count: 45 },
        { category: "nutrition", count: 32 },
        { category: "motivation", count: 28 },
        { category: "progress", count: 22 }
      ],
      recentChats: [
        {
          id: 1,
          userQuestion: "How do I build muscle at home?",
          aiResponse: "Building muscle at home is absolutely possible! Focus on bodyweight exercises...",
          category: "fitness",
          createdAt: new Date().toISOString(),
          userRating: 5
        }
      ]
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}