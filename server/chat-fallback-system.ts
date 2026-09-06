// Advanced chat fallback system with cost management and rate limiting
import OpenAI from "openai";

interface ChatConfig {
  maxTokensPerDay: number;
  maxTokensPerUser: number;
  rateLimitWindow: number; // milliseconds
  fallbackToIntelligent: boolean;
}

const CHAT_CONFIG: ChatConfig = {
  maxTokensPerDay: 1000000, // Unlimited - very high limit
  maxTokensPerUser: 100000, // Unlimited - very high limit per user
  rateLimitWindow: 0, // No rate limiting
  fallbackToIntelligent: true
};

// Token usage tracking
const dailyTokenUsage = new Map<string, number>(); // date -> tokens
const userTokenUsage = new Map<string, number>(); // userId -> tokens
const userRateLimit = new Map<string, number>(); // userId -> last request time

export class SmartChatManager {
  private openai: OpenAI | null;
  
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  }

  private matchesPattern(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private canUseOpenAI(userId: string): { canUse: boolean; reason?: string } {
    // Check if OpenAI is available
    if (!this.openai) {
      return { canUse: false, reason: 'OpenAI not configured' };
    }

    // No limits - always allow OpenAI usage
    return { canUse: true };
  }

  private trackTokenUsage(userId: string, tokens: number): void {
    // Track usage for analytics only - no limits enforced
    const today = this.getTodayKey();
    const dailyUsage = dailyTokenUsage.get(today) || 0;
    dailyTokenUsage.set(today, dailyUsage + tokens);
    
    const userUsage = userTokenUsage.get(userId) || 0;
    userTokenUsage.set(userId, userUsage + tokens);
    
    console.log(`Token usage tracked - Daily: ${dailyUsage + tokens}, User ${userId}: ${userUsage + tokens}`);
  }

  async getChatResponse(message: string, conversationHistory: any[], userId: string): Promise<{
    response: string;
    source: 'openai' | 'intelligent' | 'basic';
    tokensUsed?: number;
  }> {
    // Priority 1: Try OpenAI with cost controls
    const canUse = this.canUseOpenAI(userId);
    
    if (canUse.canUse) {
      try {
        const messages = [
          { 
            role: "system", 
            content: `You are LaunchAI, Coach Keegs' fitness companion. Be conversational, motivational, and helpful with fitness, nutrition, and health questions. Keep responses under 200 words to manage costs. Always prioritize user safety - recommend consulting healthcare providers for medical concerns.` 
          },
          ...conversationHistory.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ];

        const response = await this.openai!.chat.completions.create({
          model: "gpt-4o-mini", // More cost-effective model
          messages: messages as any,
          max_tokens: 200, // Controlled token usage
          temperature: 0.8,
        });

        const aiResponse = response.choices[0].message.content || "";
        const tokensUsed = response.usage?.total_tokens || 0;
        
        this.trackTokenUsage(userId, tokensUsed);
        
        return {
          response: aiResponse,
          source: 'openai',
          tokensUsed
        };
        
      } catch (error: any) {
        console.error('OpenAI error:', error.message);
        
        // If quota exceeded, disable OpenAI for today
        if (error.code === 'insufficient_quota') {
          const today = this.getTodayKey();
          dailyTokenUsage.set(today, CHAT_CONFIG.maxTokensPerDay);
        }
      }
    } else {
      console.log(`OpenAI skipped: ${canUse.reason}`);
    }

    // Priority 2: Intelligent fallback system
    const intelligentResponse = this.getIntelligentResponse(message, conversationHistory, userId);
    if (intelligentResponse) {
      return {
        response: intelligentResponse,
        source: 'intelligent'
      };
    }

    // Priority 3: Basic fallback
    return {
      response: "I'm here to help with fitness, nutrition, and health questions! Ask me about workouts, meal planning, or building healthy habits. For complex questions, I recommend reaching out to Coach Keegs directly at keegan.launch@gmail.com",
      source: 'basic'
    };
  }

  private getIntelligentResponse(message: string, history: any[], userId: string): string | null {
    const lowercaseMessage = message.toLowerCase();
    
    // PRIORITY: Core fitness questions first - most specific matches
    
    // Nutrition questions - exact fitness context
    if (this.matchesPattern(lowercaseMessage, ['what should i eat', 'nutrition', 'diet', 'food', 'meal', 'macro', 'protein', 'carb', 'fat'])) {
      return "Great nutrition question! For your fitness goals, focus on eating adequate protein (0.8-1g per lb bodyweight), plenty of vegetables, and whole foods. Timing your carbs around workouts can boost performance. What are your specific fitness goals - muscle building, fat loss, or performance?";
    }
    
    // Workout plans
    if (this.matchesPattern(lowercaseMessage, ['workout plan', 'exercise plan', 'training plan', 'program', 'routine'])) {
      return "I'd love to help create a workout plan for you! To give you the best program, I need to know: What's your experience level, what equipment do you have access to, and what are your main goals (strength, muscle, endurance, fat loss)?";
    }
    
    // Consistency and motivation
    if (this.matchesPattern(lowercaseMessage, ['consistent', 'motivation', 'struggling', 'stay motivated', 'stick to'])) {
      return "Consistency is the biggest game-changer! Start small - even 15 minutes counts. Set your workout clothes out the night before, schedule workouts like appointments, and focus on showing up rather than perfect performance. What's been your biggest obstacle to staying consistent?";
    }
    
    // Progress tracking
    if (this.matchesPattern(lowercaseMessage, ['track progress', 'measure progress', 'how to track', 'progress'])) {
      return "Smart progress tracking keeps you motivated! Take weekly photos, body measurements, and track performance (reps, weights, endurance). The scale alone doesn't tell the whole story - muscle weighs more than fat. What type of progress matters most to you?";
    }
    
    // Muscle building and strength
    if (this.matchesPattern(lowercaseMessage, ['muscle', 'build muscle', 'gain muscle', 'strength', 'bulk', 'mass'])) {
      return "Building muscle requires consistent strength training, adequate protein (0.8-1g per lb bodyweight), and progressive overload. Focus on compound movements like squats, deadlifts, and bench press. How many days per week can you commit to training?";
    }
    
    // Fat loss and weight management
    if (this.matchesPattern(lowercaseMessage, ['lose weight', 'fat loss', 'cut', 'lean', 'slim down'])) {
      return "Fat loss comes down to being in a caloric deficit while maintaining muscle through strength training and adequate protein. Aim for 1-2 lbs per week for sustainable results. What's your current activity level?";
    }
    
    // Home workouts
    if (this.matchesPattern(lowercaseMessage, ['home workout', 'home', 'no gym', 'bodyweight', 'equipment'])) {
      return "Home workouts can be incredibly effective! Bodyweight exercises, resistance bands, and dumbbells cover all your needs. Push-ups, squats, lunges, and planks are great starting points. What equipment do you have available?";
    }
    
    // Beginner guidance
    if (this.matchesPattern(lowercaseMessage, ['beginner', 'start', 'new', 'first time', 'never'])) {
      return "Welcome to your fitness journey! Start with 3 days per week, focus on basic movements, and prioritize consistency over intensity. Walking and bodyweight exercises are perfect starting points. What's your main goal?";
    }
    
    // Fat loss and body composition
    if (this.matchesPattern(lowercaseMessage, ['lose', 'fat', 'weight', 'body fat', 'slim', 'cut', 'shred'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['keep', 'maintain', 'permanent', 'long term', 'forever', 'sustain'])) {
        return `Congratulations on your progress! Keeping weight off requires a strategic approach that most people miss.

**The Metabolism Reset Protocol:**
After weight loss, your body's in "conservation mode." Here's how to restore balance:

1. **Reverse Diet (Weeks 1-8):** Add 50-100 calories weekly until you reach maintenance
2. **Metabolic Recovery:** Expect 2-4 weeks where weight stabilizes as hormones normalize
3. **New Maintenance:** Your new calorie needs will be 10-15% lower than before

**Long-term Success Strategies:**
• **Protein Floor:** Never go below 0.8g per lb - this prevents muscle loss and metabolic slowdown
• **Movement Consistency:** 8-10k steps daily + 3x strength training maintains muscle mass
• **Weight Buffer Zone:** Stay within 3-5 lbs of goal weight, adjust when you hit the upper limit
• **Weekly Check-ins:** Weigh same day/time, track trends not daily fluctuations

The secret? You're not "maintaining" - you're living a sustainable lifestyle that naturally keeps you lean.

What's your biggest concern about the maintenance phase?`;
      }
      
      if (this.matchesPattern(lowercaseMessage, ['stubborn', 'plateau', 'stuck', 'not losing', 'slow'])) {
        return `Hitting a plateau? This is your body being efficient - let's break through strategically.

**Plateau Diagnostic Checklist:**
Week 1-2 of no progress: Normal fluctuations, stay consistent
Week 3+ of no progress: Time for intervention

**Common Culprits & Solutions:**
• **Calorie Creep:** Re-weigh portions, track liquids/condiments/cooking oils
• **Adaptive Thermogenesis:** Your metabolism has slowed - need a diet break
• **Water Retention:** Stress, sleep, sodium, menstrual cycle can mask fat loss
• **Exercise Adaptation:** Your body burns fewer calories doing the same workouts

**Advanced Breakthrough Strategies:**
1. **Refeed Days:** 2-3 days at maintenance calories to reset hormones
2. **Carb Cycling:** Lower carbs 5 days, higher carbs 2 days
3. **Training Variation:** Add HIIT, change rep ranges, try new movements
4. **Stress Management:** High cortisol blocks fat loss - prioritize sleep/relaxation

Remember: Fat loss isn't linear. The scale might not move while you're losing inches and gaining muscle.

What does your current tracking look like? Food scale? Progress photos?`;
      }
      
      return `Let's create your personalized fat loss strategy. Sustainable results require precision, not perfection.

**The Launch Method - Phase 1 Assessment:**
Before we build your plan, I need to understand your starting point:

**Current Stats:**
• What's your experience with tracking food?
• How many days per week do you currently exercise?
• What's your biggest nutrition challenge right now?

**Evidence-Based Fat Loss Hierarchy:**
1. **Calorie Deficit (70%):** The non-negotiable foundation
2. **Protein Timing (20%):** Preserves muscle, increases metabolism
3. **Training Style (10%):** Strength training trumps cardio for body composition

**Your Starter Protocol:**
• **Week 1:** Track everything you currently eat (no changes yet)
• **Week 2:** Set protein target (0.8-1.2g per lb bodyweight)
• **Week 3:** Create 300-500 calorie deficit from baseline
• **Week 4:** Add 3x strength training sessions

This builds sustainable habits instead of shocking your system.

What's your main goal - lose fat while keeping muscle, or just see the scale drop?`;
    }

    // Comprehensive nutrition coaching
    if (this.matchesPattern(lowercaseMessage, ['nutrition', 'diet', 'eat', 'food', 'meal', 'calories', 'macros', 'protein', 'carbs', 'fats'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['macro', 'protein', 'carb', 'fat', 'calculate'])) {
        return `Let's dial in your macros for optimal results. Here's the science-based approach:

**Macro Calculator - The Launch Method:**

**Step 1: Calculate Your TDEE**
• Sedentary: Bodyweight × 12-13
• Lightly active: Bodyweight × 13-14  
• Moderately active: Bodyweight × 14-16
• Very active: Bodyweight × 16-18

**Step 2: Set Your Macros**
**Protein (1st Priority):** 0.8-1.2g per lb bodyweight
- Higher end if cutting or very active
- Preserves muscle, increases satiety, higher thermic effect

**Fats (2nd Priority):** 0.25-0.4g per lb bodyweight
- Essential for hormone production
- Don't go below 0.25g/lb or hormones suffer

**Carbs (Fill Remaining):** Whatever calories are left
- Primary fuel for training
- Higher on workout days, lower on rest days

**Example: 150lb person, moderately active**
- TDEE: 2,250 calories
- Protein: 135g (540 calories)
- Fat: 50g (450 calories)  
- Carbs: 325g (1,300 calories)

What's your current weight and activity level? I'll calculate your specific targets.`;
      }

      if (this.matchesPattern(lowercaseMessage, ['meal prep', 'plan', 'what to eat', 'ideas'])) {
        return `Meal planning is where consistency happens. Here's your systematic approach:

**The Launch Meal Framework:**

**Breakfast (High Protein Start):**
• Greek yogurt + berries + granola + protein powder
• Eggs + oatmeal + fruit
• Protein smoothie + toast + nut butter

**Lunch (Balanced & Portable):**
• Chicken + rice + vegetables + olive oil
• Salmon + sweet potato + greens
• Turkey wrap + side salad + avocado

**Dinner (Recovery & Satisfaction):**
• Lean beef + quinoa + roasted vegetables
• Fish + pasta + marinara + side salad
• Chicken stir-fry with mixed vegetables

**Prep Strategy:**
**Sunday Prep Session (2 hours):**
1. Cook 3-4 protein sources in bulk
2. Prepare 2-3 carb sources (rice, potatoes, pasta)
3. Wash and chop vegetables for the week
4. Portion into containers

**Daily Assembly (10 minutes):**
Mix and match components based on your macro targets and preferences.

**Smart Swaps for Variety:**
• Protein: Rotate chicken, fish, lean beef, eggs, Greek yogurt
• Carbs: Rice, potatoes, oats, pasta, fruits
• Fats: Nuts, olive oil, avocado, cheese

What's your biggest meal prep challenge - time, variety, or storage?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['restaurant', 'eating out', 'social', 'travel'])) {
        return `Staying on track while eating out requires strategy, not restriction:

**Restaurant Navigation System:**

**Before You Go:**
• Check the menu online and pick 2-3 options
• Eat a small protein snack if you're very hungry
• Set an intention: "I'll enjoy this meal and make smart choices"

**Ordering Strategies:**
• **Protein-First:** Start with grilled chicken, fish, or lean meat
• **Vegetable Power:** Ask for extra vegetables instead of bread/chips
• **Sauce Awareness:** Dressing/sauce on the side (can save 200-400 calories)
• **Portion Control:** Box half immediately or share an entree

**Cuisine-Specific Tips:**
**Italian:** Grilled protein + marinara, side salad, ask for vegetable sides
**Mexican:** Burrito bowl, extra lettuce, salsa instead of sour cream
**Asian:** Steamed dishes, brown rice, ask for sauce on side
**American:** Grilled options, substitute fries for vegetables or salad

**Social Situation Management:**
• **Focus on Connection:** The meal is about people, not just food
• **Plan Your Indulgence:** If you want dessert, eat lighter during the meal
• **Stay Hydrated:** Drink water between alcoholic beverages

**Travel Tactics:**
• Pack protein bars and nuts for flights/road trips
• Find grocery stores near your hotel for backup options
• Use hotel fitness centers or bodyweight workouts

Remember: One meal won't ruin your progress, but consistency matters more than perfection.

What type of social eating situation do you struggle with most?`;
      }

      return `Let's build your personalized nutrition strategy. Food is fuel, but it should also be enjoyable.

**The Launch Nutrition Philosophy:**
We focus on **Addition, not Subtraction**. Instead of restricting foods, we add nutrient-dense options that naturally crowd out less optimal choices.

**Your Nutrition Assessment:**
• How many meals do you typically eat per day?
• Do you currently track your food intake?
• What's your biggest nutrition challenge right now?
• Any foods you absolutely won't eat?

**Evidence-Based Nutrition Hierarchy:**
1. **Calorie Balance (60%):** Eat appropriate amount for your goals
2. **Protein Adequacy (25%):** 0.8-1.2g per lb bodyweight
3. **Nutrient Timing (10%):** Protein with meals, carbs around workouts
4. **Food Quality (5%):** 80% whole foods, 20% flexibility

**Foundation Foods for Every Goal:**
• **Proteins:** Chicken, fish, eggs, Greek yogurt, lean beef, protein powder
• **Carbohydrates:** Rice, oats, potatoes, fruits, vegetables
• **Fats:** Nuts, olive oil, avocado, fatty fish
• **Hydration:** Half your bodyweight in ounces of water daily

The key is finding an approach that fits your lifestyle, preferences, and goals.

What aspect of nutrition would you like to focus on first?`;
    }

    // Comprehensive workout and training coaching
    if (this.matchesPattern(lowercaseMessage, ['workout', 'exercise', 'training', 'gym', 'strength', 'cardio', 'routine', 'program'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['no injuries', 'all clear', 'healthy', 'good to go', 'ready'])) {
        return `Perfect! Safety cleared. Now let's build your optimal training program.

**The Launch Training Assessment:**

**1. Available Equipment:**
• Home gym (dumbbells, resistance bands, bodyweight)
• Full gym access (barbells, machines, cardio equipment)
• Limited equipment (what do you have?)

**2. Training Experience:**
• Beginner (0-6 months consistent training)
• Intermediate (6 months - 2 years)
• Advanced (2+ years with proper form)

**3. Time Availability:**
• 2-3 days per week (45-60 minutes)
• 4-5 days per week (30-45 minutes)
• 6+ days per week (flexible timing)

**4. Primary Goal:**
• Fat loss while maintaining muscle
• Muscle building (lean gains)
• Strength and performance
• General fitness and health

Based on your answers, I'll create a specific program with exercise selection, sets, reps, and progression plan.

What's your equipment situation and experience level?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['beginner', 'start', 'new', 'never'])) {
        return `Welcome to your fitness journey! Starting smart is more important than starting hard.

**Beginner Success Blueprint - First 8 Weeks:**

**Phase 1: Foundation (Weeks 1-2)**
**Movement Pattern Focus:**
• Squat pattern: Bodyweight squats, chair squats
• Push pattern: Wall pushups, knee pushups
• Pull pattern: Resistance band rows, inverted rows
• Hinge pattern: Glute bridges, hip hinges
• Core: Planks, dead bugs

**Schedule:** 2-3 days per week, 20-30 minutes
**Progression:** Master form before adding weight or reps

**Phase 2: Build (Weeks 3-4)**
Add resistance:
• Goblet squats with water jug/dumbbell
• Standard pushups or incline pushups
• Resistance band or dumbbell rows
• Romanian deadlifts with light weight
• Side planks, modified crunches

**Phase 3: Strengthen (Weeks 5-8)**
• Increase resistance and add complexity
• Introduce combination movements
• Add cardio intervals between exercises

**Key Beginner Principles:**
• **Consistency > Intensity:** Show up regularly, intensity comes later
• **Form > Weight:** Perfect movement patterns prevent injury
• **Progressive Overload:** Gradually increase difficulty each week
• **Recovery:** Rest days are when you actually get stronger

**Warning Signs to Stop:**
• Sharp pain (different from muscle fatigue)
• Dizziness or nausea
• Joint pain that persists after workout

What's your biggest concern about starting an exercise routine?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['home', 'no gym', 'equipment', 'bodyweight'])) {
        return `Home workouts can be incredibly effective! Here's your complete home training system:

**The Launch Home Gym Essentials:**

**Minimal Equipment Maximum Results:**
• Resistance bands (light, medium, heavy)
• Adjustable dumbbells or water jugs
• Yoga mat for floor exercises
• Sturdy chair or couch for elevation

**Complete Home Workout Program:**

**Upper Body Day:**
• Pushup variations (standard, incline, decline)
• Pike pushups for shoulders
• Tricep dips on chair
• Resistance band rows
• Band bicep curls
• Plank to pushup

**Lower Body Day:**
• Bodyweight squats
• Single-leg glute bridges
• Lunges (forward, reverse, lateral)
• Calf raises
• Wall sits
• Single-leg Romanian deadlifts

**Full Body Circuit:**
• Burpees
• Mountain climbers
• Squat to overhead press
• Renegade rows (if you have weights)
• Jump squats
• Russian twists

**Cardio Options:**
• HIIT: 30 seconds work, 30 seconds rest
• Stair climbing
• Dancing to music
• YouTube fitness videos
• Bodyweight circuits

**Progressive Overload at Home:**
• Increase reps each week
• Add pauses at challenging positions
• Increase time under tension
• Add resistance bands to bodyweight movements
• Progress to single-limb variations

The key is consistency and creativity. Your body doesn't know if you're in a gym or at home!

What space do you have available for workouts?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['strength', 'muscle', 'build', 'gain', 'bulk'])) {
        return `Building muscle requires precision and patience. Here's the science-based approach:

**Muscle Building Fundamentals:**

**Training Variables for Hypertrophy:**
• **Volume:** 10-20 sets per muscle group per week
• **Intensity:** 65-85% of 1RM (6-15 rep range optimal)
• **Frequency:** Each muscle group 2-3x per week
• **Rest:** 48-72 hours between training same muscles

**The Launch Muscle Building Program:**

**Day 1: Push (Chest, Shoulders, Triceps)**
• Barbell/Dumbbell Bench Press: 4 sets x 6-8 reps
• Overhead Press: 3 sets x 8-10 reps
• Incline Dumbbell Press: 3 sets x 10-12 reps
• Lateral Raises: 3 sets x 12-15 reps
• Tricep Dips: 3 sets x 10-15 reps
• Close-Grip Pushups: 2 sets x max reps

**Day 2: Pull (Back, Biceps)**
• Deadlifts: 4 sets x 5-6 reps
• Pull-ups/Lat Pulldowns: 4 sets x 6-10 reps
• Barbell/Dumbbell Rows: 3 sets x 8-10 reps
• Face Pulls: 3 sets x 12-15 reps
• Bicep Curls: 3 sets x 10-12 reps
• Hammer Curls: 2 sets x 12-15 reps

**Day 3: Legs (Quads, Hamstrings, Glutes, Calves)**
• Squats: 4 sets x 6-8 reps
• Romanian Deadlifts: 3 sets x 8-10 reps
• Bulgarian Split Squats: 3 sets x 10-12 each leg
• Leg Curls: 3 sets x 12-15 reps
• Calf Raises: 4 sets x 15-20 reps
• Walking Lunges: 2 sets x 20 steps

**Progressive Overload Strategy:**
Week 1-2: Focus on form, establish baseline
Week 3-4: Add 2.5-5 lbs to compound movements
Week 5-6: Add reps to isolation exercises
Week 7-8: Deload week (reduce weight 10-20%)

**Recovery and Growth:**
• 7-9 hours of sleep (when muscle growth happens)
• Protein: 1.6-2.2g per kg bodyweight
• Stay hydrated (muscle is 75% water)
• Manage stress (high cortisol blocks muscle growth)

What's your current experience with weight training?`;
      }

      // Safety-first approach for workout requests
      return `Safety first! Before creating any workout plan, I need to ensure you're ready to train safely.

**Pre-Exercise Safety Screening:**

Do you have any of the following:
• Current injuries or pain
• Heart conditions or high blood pressure
• Joint problems (knees, back, shoulders)
• Recent surgeries or medical procedures
• Pregnancy or postpartum considerations
• Any medications that affect exercise

**If you're completely healthy and ready to train, simply reply "NO INJURIES" and I'll create your personalized program.**

**If you have any health concerns, I recommend:**
• Consulting with your healthcare provider first
• Getting cleared for exercise
• Working with a qualified personal trainer initially

Your safety is the foundation of all progress. Once cleared, I'll design the perfect program for your goals, equipment, and experience level.

Are you ready to proceed, or do you need to check with a healthcare provider first?`;
    }

    // Motivation, consistency, and mindset coaching
    if (this.matchesPattern(lowercaseMessage, ['motivation', 'consistency', 'habit', 'stuck', 'mindset', 'mental', 'psychology', 'discipline'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['stuck', 'plateau', 'not seeing results', 'frustrated'])) {
        return `I get it - plateaus are the most frustrating part of any fitness journey. But here's what most people don't understand: plateaus are actually signs that your body is ADAPTING.

**The Science Behind Plateaus:**
Your body is incredibly efficient. When you do the same thing repeatedly, it becomes metabolically efficient and requires less energy. This isn't failure - it's biology.

**The Plateau Breakthrough Protocol:**

**Week 1: Metabolic Reset**
• Take a full diet break - eat at maintenance calories
• Reduce training volume by 50%
• Focus on sleep and stress management
• This restores hormones and resets adaptation

**Week 2: Strategic Shock**
• Change your training stimulus completely
• New rep ranges, new exercises, new timing
• Increase training frequency or decrease it dramatically
• Add or remove cardio entirely

**Week 3: Progressive Overload 2.0**
• Return to deficit but with new approach
• Track different metrics (strength, measurements, photos)
• Focus on ONE primary goal instead of multiple

**Mindset Shift That Changes Everything:**
Stop asking "Why isn't this working?" Start asking "How can I make this work better?"

Your plateau isn't permanent - it's temporary adaptation. The strongest people I know have broken through dozens of plateaus.

What specific area feels most stuck right now - weight loss, strength gains, or motivation?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['motivation', 'discipline', 'consistency', 'showing up'])) {
        return `Here's the truth about motivation: it's unreliable. Discipline isn't about feeling like it - it's about doing it ESPECIALLY when you don't feel like it.

**The Launch Consistency Framework:**

**Phase 1: Identity Shift (Weeks 1-2)**
Stop saying "I'm trying to get fit" and start saying "I'm someone who prioritizes their health." Your actions follow your identity.

**Phase 2: Minimum Viable Habits (Weeks 3-4)**
• 5-minute morning movement
• One healthy meal choice per day
• 10-minute evening walk
Success breeds success. Master the small things first.

**Phase 3: Systematic Expansion (Weeks 5-8)**
Gradually increase intensity and duration as habits solidify.

**The Motivation vs. Discipline Truth:**
• **Motivation** gets you started
• **Habit** keeps you going
• **Results** fuel your fire
• **Identity** makes it permanent

**Emergency Motivation Toolkit:**
When you don't feel like it:
1. **The 10-Minute Rule:** Commit to just 10 minutes
2. **Remember Your Why:** Write down WHY you started
3. **Future Self Visualization:** How will you feel after?
4. **Progress Review:** Look at how far you've come
5. **Accountability Partner:** Text someone who cares

**Advanced Psychology:**
Your brain resists change because it equates new with dangerous. Every time you show up when you don't feel like it, you're literally rewiring neural pathways.

The most successful people I work with aren't the most motivated - they're the most consistent.

What's the hardest time of day for you to stay consistent?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['habit', 'routine', 'schedule', 'time'])) {
        return `Habits are the compound interest of self-improvement. Small changes compounded daily create extraordinary results.

**The Launch Habit Architecture:**

**Morning Routine (Energy Creation):**
• 5 minutes: Hydrate (16-20oz water)
• 5 minutes: Movement (stretching or light exercise)
• 5 minutes: Mindset (gratitude or goal review)
Total: 15 minutes that sets your entire day

**Workout Habit Stack:**
• **Trigger:** After morning coffee
• **Routine:** Change into workout clothes
• **Reward:** Protein smoothie post-workout
• **Tracking:** Check off calendar

**Evening Routine (Recovery Setup):**
• Prep tomorrow's meals
• Lay out workout clothes
• 10 minutes of stretching or meditation
• Sleep optimization (cool, dark, quiet room)

**The 2-Minute Rule:**
Every habit should start in under 2 minutes:
• "Work out for 30 minutes" becomes "Put on workout clothes"
• "Eat healthy" becomes "Eat one piece of fruit"
• "Read fitness books" becomes "Read one page"

**Habit Stacking Formula:**
After [EXISTING HABIT], I will [NEW HABIT]

Examples:
• After I pour my morning coffee, I will do 10 squats
• After I brush my teeth, I will do a 1-minute plank
• After I eat lunch, I will take a 5-minute walk

**Environmental Design:**
• Gym clothes laid out = visual cue
• Protein powder on counter = nutrition cue
• Water bottle by bed = hydration cue
• Remove friction from good choices, add friction to bad ones

**Habit Tracking That Actually Works:**
Don't track everything. Track 2-3 keystone habits that create momentum for everything else.

The goal isn't perfection - it's consistency. Missing one day doesn't matter. Missing two days in a row is dangerous.

What existing habit could you stack a new health habit onto?`;
      }

      return `Consistency beats perfection every single time. Here's how to build unshakeable fitness habits:

**The Launch Mindset Framework:**

**1. Identity-Based Change:**
Don't focus on what you want to achieve, focus on who you want to become.
• "I want to lose weight" → "I'm someone who takes care of their body"
• "I should work out" → "I'm an active person"
• "I need to eat better" → "I fuel my body with quality nutrition"

**2. The Compound Effect:**
Small improvements compound exponentially:
• 1% better daily = 37x better in a year
• 1% worse daily = nearly zero in a year
• Consistency creates momentum

**3. Process Over Outcome:**
• Focus on showing up, not the scale
• Celebrate effort, not just results
• Trust the process when results lag

**4. Failure Recovery Protocol:**
When you miss a day (you will):
• Don't let perfect be the enemy of good
• Get back on track immediately
• Learn from the obstacle
• Adjust the system, don't abandon it

**5. The Long Game:**
• Month 1: Building habits
• Month 2: Seeing changes
• Month 3: Feeling stronger
• Month 6: Others notice
• Year 1: New identity locked in

Remember: The strongest people aren't those who never struggle - they're the ones who get back up every time they fall.

What's your biggest consistency challenge right now?`;
    }

    // Specific body composition questions
    if (lowercaseMessage.includes('belly fat') || lowercaseMessage.includes('abs') || 
        lowercaseMessage.includes('stomach')) {
      return `You can't spot-reduce belly fat, but here's what actually works:

**Fat Loss Hierarchy:**
1. Overall calorie deficit (most important)
2. Strength training (preserves muscle, boosts metabolism)
3. Adequate protein (prevents muscle loss)
4. Consistent sleep (regulates hunger hormones)

**Core Training:** Builds muscle underneath, but won't burn the fat covering it
**Cardio:** Helps with calorie deficit but isn't magic for belly fat

Focus on total body fat reduction through sustainable habits. Belly fat is typically the last to go, first to return - so patience and consistency are key.`;
    }

    // Sleep and recovery questions
    if (lowercaseMessage.includes('sleep') || lowercaseMessage.includes('recovery') || 
        lowercaseMessage.includes('tired') || lowercaseMessage.includes('rest')) {
      return `Sleep is when your body actually builds muscle and burns fat:

**Sleep Optimization:**
• 7-9 hours consistently
• Cool, dark room (65-68°F)
• No screens 1 hour before bed
• Same sleep/wake times daily

**Recovery Signs:**
• Energy levels stable
• Workouts feel strong
• Mood is good
• Not constantly sore

Poor sleep = increased hunger hormones + decreased willpower + slower recovery.

What's your current sleep schedule like? Any specific sleep challenges?`;
    }

    // Plateau and progress questions
    if (lowercaseMessage.includes('plateau') || lowercaseMessage.includes('not losing') || 
        lowercaseMessage.includes('stopped working') || lowercaseMessage.includes('not seeing results')) {
      return `Plateaus are normal and solvable. Here's your troubleshooting checklist:

**Week 1-2 No Progress:** Normal fluctuations, stay consistent
**Week 3-4 No Progress:** Check these factors:
• Are you tracking accurately? (food scales help)
• Has your activity decreased unconsciously?
• Are you eating back all exercise calories?
• Is stress/sleep affecting hormones?

**Plateau Breakers:**
• Refeed day (eat at maintenance 1-2 days)
• Change workout structure
• Reassess calorie needs (they decrease as you lose weight)

Remember: The scale doesn't tell the whole story. Are clothes fitting better? Strength improving?`;
    }

    // Human physiology and body science questions
    if (this.matchesPattern(lowercaseMessage, ['physiology', 'metabolism', 'metabolic', 'hormones', 'muscle', 'science', 'why', 'how does', 'what happens', 'tdee', 'bmr', 'calories', 'burn'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['metabolism', 'metabolic', 'burn calories', 'tdee', 'bmr'])) {
        return `Your metabolism is more complex than just "fast" or "slow." Here's the science:

**The 4 Components of Total Daily Energy Expenditure (TDEE):**

**1. Basal Metabolic Rate (BMR) - 60-70%**
• Energy needed for basic organ function
• Brain uses 20% of total calories at rest
• Heart, lungs, liver, kidneys are metabolic powerhouses
• Muscle tissue burns 3x more calories than fat tissue

**2. Thermic Effect of Food (TEF) - 8-15%**
• Energy cost of digesting, absorbing, metabolizing food
• Protein has highest TEF (20-30% of calories)
• Processed foods have lower TEF than whole foods
• This is why "calories in" isn't straightforward

**3. Exercise Activity Thermogenesis (EAT) - 15-30%**
• Calories burned during intentional exercise
• Most variable component based on your activity

**4. Non-Exercise Activity Thermogenesis (NEAT) - 15-50%**
• Fidgeting, posture maintenance, daily activities
• Can vary by 2000+ calories between individuals
• Often decreases unconsciously during dieting

**Metabolic Adaptation Reality:**
When you lose weight, your metabolism WILL slow down:
• Smaller body requires fewer calories
• Hormonal changes reduce energy expenditure
• NEAT often decreases unconsciously
• This is normal, not "broken metabolism"

**How to Optimize Metabolic Health:**
• Maintain muscle mass (strength training)
• Eat adequate protein (preserves muscle, higher TEF)
• Stay active outside the gym (walk, take stairs)
• Don't over-restrict calories (prevents extreme adaptation)
• Get quality sleep (regulates metabolic hormones)

Your metabolism isn't fixed - it adapts to your lifestyle choices.

What specific aspect of metabolism are you curious about?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['muscle', 'protein synthesis', 'hypertrophy', 'growth', 'building'])) {
        return `Muscle growth is one of the most fascinating biological processes. Here's how your body builds muscle:

**The Muscle Protein Synthesis Process:**

**Step 1: Mechanical Tension (Workout)**
• Resistance training creates microscopic tears in muscle fibers
• This signals your body that current muscle isn't adequate
• Progressive overload is the key signal for adaptation

**Step 2: Protein Synthesis Activation (0-48 hours post-workout)**
• mTOR pathway activates (master regulator of muscle growth)
• Satellite cells proliferate and donate nuclei to muscle fibers
• Protein synthesis rate increases 50-100% above baseline
• This is when actual muscle building occurs

**Step 3: Supercompensation (48-72 hours)**
• Muscle rebuilds stronger than before
• Additional protein added to muscle fibers
• Increased glycogen storage capacity
• Enhanced blood flow and neural connections

**Critical Variables for Optimal Growth:**

**Training:**
• Volume: 10-20 sets per muscle group per week
• Intensity: 65-85% 1RM (6-15 rep range optimal)
• Frequency: Each muscle 2-3x per week
• Progressive overload: Gradual increase in demands

**Nutrition:**
• Protein: 1.6-2.2g per kg bodyweight
• Leucine threshold: 2.5-3g per meal
• Timing: Protein within 2 hours post-workout optimizes synthesis
• Calories: Slight surplus (200-500 calories) for maximum growth

**Recovery:**
• Sleep: 7-9 hours (when 95% of growth hormone is released)
• Rest days: Allow 48-72 hours between training same muscles
• Stress management: Cortisol inhibits protein synthesis

**Age and Muscle Growth:**
• Peak muscle building: teens to early 30s
• Anabolic resistance increases with age
• Older adults need more protein and stimulus
• Muscle growth possible at any age with proper protocol

**Common Misconceptions:**
• "Muscle confusion" - Muscles adapt to progressive overload, not confusion
• "Toning" - This is just building muscle while losing fat
• "Bulky" - Extreme muscle growth requires years of dedicated effort

The human body is incredibly adaptable. Give it the right stimulus, fuel, and recovery, and it will respond.

What aspect of muscle growth interests you most?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['hormones', 'testosterone', 'growth hormone', 'insulin', 'cortisol'])) {
        return `Hormones are your body's chemical messengers that control nearly every aspect of body composition and performance:

**The Key Fitness Hormones:**

**Testosterone (The Muscle Builder):**
• Primary anabolic hormone for muscle protein synthesis
• Peak levels: early morning, post-workout
• Natural optimization: heavy compound lifts, adequate fat intake, quality sleep
• Normal decline: 1-2% per year after age 30
• Signs of low T: decreased muscle mass, fat gain, low energy, poor recovery

**Growth Hormone (The Repair Master):**
• Released primarily during deep sleep (stages 3-4)
• Stimulates protein synthesis and fat oxidation
• Natural boosters: intense exercise, fasting, deep sleep
• Declines significantly with age
• Peak release: 10 PM - 2 AM (why sleep timing matters)

**Insulin (The Storage Hormone):**
• Regulates blood sugar and nutrient storage
• Anabolic when controlled, fat-storing when chronically elevated
• Optimization: time carbs around workouts, choose complex carbs
• Insulin sensitivity improves with: exercise, muscle mass, proper sleep
• Poor insulin sensitivity = harder fat loss, easier fat gain

**Cortisol (The Stress Hormone):**
• Essential for life but problematic when chronically elevated
• Breaks down muscle tissue, promotes fat storage (especially belly)
• Spikes from: inadequate sleep, overtraining, chronic stress
• Management: stress reduction, adequate recovery, balanced training

**Thyroid Hormones (T3/T4 - The Metabolic Controllers):**
• Regulate metabolic rate and energy production
• Control body temperature, heart rate, cellular energy
• Affected by: extreme calorie restriction, excessive cardio, stress
• Signs of dysfunction: fatigue, cold intolerance, stubborn weight

**Leptin & Ghrelin (The Hunger Regulators):**
• Leptin: "satiety hormone" - tells brain you're full
• Ghrelin: "hunger hormone" - signals need to eat
• Sleep deprivation disrupts both (more ghrelin, less leptin)
• Fat loss decreases leptin (increased hunger is normal)

**Hormone Optimization Strategy:**

**Sleep (Most Important):**
• 7-9 hours consistently
• Cool, dark room
• Same bedtime/wake time daily
• No screens 1 hour before bed

**Training:**
• Heavy compound lifts boost testosterone
• Avoid overtraining (increases cortisol)
• Include rest days for hormone recovery

**Nutrition:**
• Adequate fats (20-35% of calories) for hormone production
• Don't over-restrict calories
• Time carbs around workouts for insulin optimization

**Stress Management:**
• Meditation, deep breathing
• Regular massage or relaxation
• Adequate downtime and hobbies

**Red Flags to Monitor:**
• Chronic fatigue despite adequate sleep
• Stubborn fat gain despite proper diet
• Decreased performance or motivation
• Poor recovery between workouts

Remember: You can't out-supplement poor lifestyle choices. Focus on the fundamentals first.

Which hormone aspect concerns you most?`;
      }

      if (this.matchesPattern(lowercaseMessage, ['fat loss', 'burn fat', 'lipolysis', 'adipose'])) {
        return `Fat loss is a complex biochemical process. Understanding the science helps you optimize the process:

**The Fat Loss Process (Lipolysis):**

**Step 1: Hormonal Signal**
• Adrenaline/noradrenaline released during caloric deficit
• These hormones bind to fat cell receptors
• Signals fat cells to release stored triglycerides

**Step 2: Fat Mobilization**
• Hormone-sensitive lipase breaks down triglycerides
• Free fatty acids + glycerol released into bloodstream
• This is "fat burning" - but fat isn't gone yet

**Step 3: Fat Oxidation**
• Fatty acids transported to muscles/organs
• Burned for energy in mitochondria
• CO2 exhaled, H2O excreted
• This is where fat actually leaves your body

**Why Fat Loss Isn't Linear:**

**Water Weight Fluctuations:**
• Glycogen stores fluctuate (each gram holds 3-4g water)
• Sodium intake affects water retention
• Menstrual cycle causes hormonal water retention
• Stress increases cortisol, promoting water retention

**The Fat Storage Hierarchy:**
1. Visceral fat (around organs) - first to go, most metabolically active
2. Subcutaneous fat (under skin) - slower to mobilize
3. Stubborn areas (lower belly, love handles, thighs) - last to go

**Why Stubborn Fat is Stubborn:**
• More alpha-2 receptors (inhibit fat release)
• Less blood flow (harder to mobilize fat)
• Higher insulin sensitivity (stores fat easier)
• Often the first place fat was stored

**The Set Point Theory:**
• Your body has a "preferred" weight range
• Hormones work to maintain this range
• Leptin decreases, ghrelin increases during fat loss
• This is why maintenance phases are important

**Optimizing Fat Loss Science:**

**Creating the Signal:**
• Caloric deficit is non-negotiable
• Strength training preserves muscle during deficit
• Cardio can increase deficit but isn't mandatory

**Enhancing Mobilization:**
• Caffeine improves fat mobilization
• Fasted cardio may slightly enhance fat oxidation
• Cold exposure can activate brown fat
• Adequate sleep optimizes hormone signaling

**Improving Oxidation:**
• Maintain muscle mass (muscles burn fat)
• Stay active throughout day (NEAT)
• Don't over-restrict calories (preserves metabolic rate)

**Practical Application:**
• Focus on weekly weight trends, not daily
• Take body measurements and photos
• Trust the process during stalls
• Plan diet breaks every 8-12 weeks

**The Reality Check:**
• Fat loss is 80% diet, 20% exercise
• You can't out-train a bad diet
• Patience is required - sustainable loss is 1-2 lbs per week
• The last 10 pounds are always the hardest

Your body is designed to store fat for survival. Work with biology, not against it.

What specific fat loss challenge are you facing?`;
      }
    }

    // Direct questions and help requests
    if (this.matchesPattern(lowercaseMessage, ['how do i', 'how to', 'what should', 'can you help', 'help me'])) {
      
      if (this.matchesPattern(lowercaseMessage, ['start', 'begin', 'getting started'])) {
        return `Starting your fitness journey? Here's your proven 3-step blueprint:

**Week 1-2: Foundation**
• Track current habits (food, activity, sleep)
• Add 10-minute daily walk
• Drink water before each meal

**Week 3-4: Build**
• Add 2 strength training sessions
• Focus on compound movements (squats, pushups, rows)
• Plan 3 meals ahead each day

**Week 5-6: Momentum**
• Increase workout frequency to 3-4x per week
• Add protein to every meal
• Set weekly check-ins with yourself

Small actions create lasting change. What's your biggest concern about getting started?`;
      }
      
      // General help response for unmatched questions
      return `I'm your science-backed fitness expert, ready to help with evidence-based guidance on:

**Exercise & Training:**
• Workout programming and exercise selection
• Strength training and muscle building
• Cardio optimization and conditioning

**Nutrition Science:**
• Macro tracking and meal planning
• Fat loss and muscle gain nutrition
• Supplement recommendations

**Human Physiology:**
• Metabolism and hormone optimization
• Muscle protein synthesis
• Fat loss biochemistry

**Mindset & Habits:**
• Consistency and motivation strategies
• Habit formation psychology
• Breaking through plateaus

The more specific your question, the more targeted my advice can be.

For personalized coaching and complex cases, reach out to Coach Keegs directly at keegan.launch@gmail.com`;
    }

    return null;
  }

  // Reset daily usage (call this from a daily cron job)
  resetDailyUsage(): void {
    const today = this.getTodayKey();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    dailyTokenUsage.delete(yesterday);
    userTokenUsage.clear(); // Reset all user limits daily
    
    console.log(`Token usage reset for ${today}`);
  }

  // Get usage statistics
  getUsageStats(): any {
    const today = this.getTodayKey();
    return {
      dailyUsage: dailyTokenUsage.get(today) || 0,
      dailyLimit: CHAT_CONFIG.maxTokensPerDay,
      activeUsers: userTokenUsage.size,
      rateLimitedUsers: Array.from(userRateLimit.entries()).filter(
        ([userId, lastRequest]) => Date.now() - lastRequest < CHAT_CONFIG.rateLimitWindow
      ).length
    };
  }
}

export const chatManager = new SmartChatManager();