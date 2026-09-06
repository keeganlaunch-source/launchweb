import cron from 'node-cron';
import { sendEmail } from './domain-email';
import { storage } from './storage';

interface WeeklyContent {
  subject: string;
  title: string;
  tip: string;
  science: string;
  nutrition: string;
  motivation: string;
  cta: string;
}

// Evidence-based tri-weekly content with peer-reviewed research citations
// Monday: Fitness Science, Wednesday: Nutrition Research, Friday: Recovery & Mindset
const triWeeklyContent: WeeklyContent[] = [
  // WEEK 1 - Monday: Resistance Training Science
  {
    subject: "LAUNCH Monday: Resistance Training Frequency Science",
    title: "Optimal Training Frequency: What Research Shows",
    tip: "Train each muscle group 2-3x per week with 48-72 hour recovery for maximum hypertrophy. Volume per session matters less than weekly volume distribution.",
    science: "Meta-analysis of 34 studies (Schoenfeld et al., 2019) demonstrates 2-3 sessions per muscle group weekly optimizes muscle protein synthesis rates. Training frequency of 2x vs 1x per week showed 6.8% greater hypertrophy gains when volume was equated.",
    nutrition: "Post-workout: 20-40g whey protein within 2 hours maximizes muscle protein synthesis when daily protein targets (1.6-2.2g/kg) are met consistently.",
    motivation: "Consistency in frequency beats perfection in single sessions.",
    cta: "Get your evidence-based training program"
  },
  // WEEK 1 - Wednesday: Protein Timing Research
  {
    subject: "LAUNCH Wednesday: Protein Distribution Science",
    title: "Meal Timing: Maximizing Protein Synthesis",
    tip: "Distribute protein evenly across meals (20-30g per meal) rather than loading it all at dinner. Leucine threshold of 2.5g per meal maximally stimulates mTOR pathway.",
    science: "Research by Moore et al. (2014) shows 20g protein per meal stimulates muscle protein synthesis 25% more than uneven distribution. Leucine content drives the anabolic response, requiring 2.5-3g per meal.",
    nutrition: "Optimal sources: Eggs (2.5g leucine/2 eggs), Greek yogurt (2.7g/150g), lean beef (2.6g/100g), whey protein (2.5g/25g). Space meals 3-4 hours apart.",
    motivation: "Small consistent actions compound into extraordinary results.",
    cta: "Master evidence-based nutrition"
  },
  // WEEK 1 - Friday: Sleep & Recovery Science
  {
    subject: "LAUNCH Friday: Sleep Architecture & Performance",
    title: "Recovery Science: Why Sleep Drives Results",
    tip: "Prioritize 7-9 hours nightly with consistent sleep/wake times. Sleep debt accumulates and impairs performance, even if you 'feel fine'.",
    science: "Sleep restriction to 5.5 hours reduces muscle protein synthesis 18% and increases muscle protein breakdown 21% (Dattilo et al., 2011). Growth hormone release occurs primarily during deep sleep phases.",
    nutrition: "Avoid caffeine 8+ hours before bed. Consider 200-400mg magnesium glycinate 30 minutes before sleep to improve sleep quality and muscle recovery.",
    motivation: "Recovery is where adaptation happens - respect the process.",
    cta: "Optimize your recovery protocols"
  },

  // WEEK 2 - Monday: Cardiovascular Training
  {
    subject: "LAUNCH Monday: Cardio & Strength Training Integration",
    title: "Concurrent Training: Maximizing Both Adaptations",
    tip: "Perform strength training before cardio when possible. If separate sessions, allow 6+ hours between high-intensity cardio and strength training.",
    science: "Concurrent training research (Wilson et al., 2012) shows strength gains are compromised when cardio immediately follows resistance training. mTOR signaling is suppressed by AMPK activation from endurance exercise.",
    nutrition: "For concurrent training days: Increase carbohydrate intake to 3-5g/kg body weight to support glycogen replenishment and training quality.",
    motivation: "Strategic training order amplifies every rep and every step.",
    cta: "Get your personalized training plan"
  },
  // WEEK 2 - Wednesday: Micronutrient Timing
  {
    subject: "LAUNCH Wednesday: Micronutrient Absorption Science",
    title: "Nutrient Timing: When Vitamins Actually Work",
    tip: "Take fat-soluble vitamins (A,D,E,K) with meals containing healthy fats. Iron absorption increases 300% when taken with vitamin C.",
    science: "Vitamin D absorption increases 32% when taken with dietary fat vs fasting (Mulligan & Licata, 2010). Zinc competes with iron for absorption - separate by 2+ hours for optimal uptake.",
    nutrition: "Optimal timing: Vitamin D with breakfast (healthy fats), Iron with citrus (vitamin C), Magnesium before bed (relaxation), B-vitamins with morning meal (energy).",
    motivation: "Precision in small details creates outsized advantages.",
    cta: "Master nutrient optimization"
  },
  // WEEK 2 - Friday: Stress & Cortisol Management
  {
    subject: "LAUNCH Friday: Stress Biology & Body Composition",
    title: "Cortisol Research: How Stress Affects Results",
    tip: "Chronic stress elevates cortisol, promoting abdominal fat storage and muscle breakdown. Implement daily stress management for body composition goals.",
    science: "Chronic cortisol elevation increases visceral adiposity by 45% and reduces muscle protein synthesis by 20% (Kyrou & Tsigos, 2009). Stress management interventions show 15-20% improvement in body composition outcomes.",
    nutrition: "Adaptogenic support: Ashwagandha (300-600mg) reduces cortisol 23-30%. Omega-3 fatty acids (2-3g daily) modulate inflammatory stress response.",
    motivation: "Managing stress is managing your physiology - it's not optional.",
    cta: "Build your stress management toolkit"
  },

  // Continue with more weeks of content...
  {
    subject: "LAUNCH Monday: Protein Distribution Science",
    title: "Optimal Protein Intake: What Research Actually Shows",
    tip: "Consume 1.6-2.2g protein per kg body weight daily, distributed across 3-4 meals with 20-25g per meal for maximum muscle protein synthesis.",
    science: "Meta-analysis of 49 studies (Helms et al., 2014) shows 1.6-2.2g/kg optimizes lean mass retention during caloric restriction. Leucine threshold of 2.5g per meal maximally stimulates mTOR pathway (Phillips & Van Loon, 2011).",
    nutrition: "Evidence-based sources: Complete proteins contain all essential amino acids - eggs (6g/egg), Greek yogurt (15g/150g), lean meats (25g/100g), legumes (8g/100g cooked).",
    motivation: "Science-backed nutrition delivers predictable results.",
    cta: "Get evidence-based meal planning"
  },
  {
    subject: "LAUNCH Monday: Hydration and Performance",
    title: "Fluid Balance: Critical for Metabolic Function",
    tip: "Maintain hydration at 35-40ml per kg body weight daily. Monitor urine color - pale yellow indicates optimal hydration status.",
    science: "Dehydration of just 2% body weight reduces physical performance by 10-15% and cognitive function by 12% (Ganio et al., 2011, Journal of Nutrition). Plasma volume decreases affect cardiac output and thermoregulation.",
    nutrition: "Electrolyte balance: 2-3g sodium daily from whole foods. Pre-exercise: 400-600ml fluid 2-3 hours prior. Post-exercise: 150% of fluid losses within 6 hours.",
    motivation: "Optimal hydration is foundational to every physiological process.",
    cta: "Master the fundamentals of performance"
  },
  {
    subject: "LAUNCH Monday: Exercise Timing Research",
    title: "When Science Says to Train for Best Results",
    tip: "Resistance training 2-3x per week with 48-72 hour recovery between sessions targeting same muscle groups maximizes strength and hypertrophy adaptations.",
    science: "Systematic review (Schoenfeld et al., 2017) demonstrates 2-3 sessions per muscle group weekly optimizes muscle protein synthesis. Recovery period allows supercompensation and glycogen replenishment (MacDougall et al., 1995).",
    nutrition: "Post-exercise protein intake within 2-hour 'anabolic window' maximizes muscle protein synthesis when daily protein targets are met (Aragon & Schoenfeld, 2013).",
    motivation: "Consistent application of proven principles creates lasting change.",
    cta: "Get your evidence-based training program"
  },
  {
    subject: "LAUNCH Monday: Sleep and Body Composition",
    title: "Sleep Duration: Impact on Weight Management",
    tip: "Target 7-9 hours nightly sleep. Sleep duration <6 hours increases obesity risk by 30% and impairs glucose metabolism within 4 days.",
    science: "Large cohort study (Patel et al., 2006, American Journal of Epidemiology) shows sleep <5 hours increases obesity risk 32%. Sleep restriction decreases leptin 18% and increases ghrelin 28% (Spiegel et al., 2004, Annals of Internal Medicine).",
    nutrition: "Sleep affects food choice: Insufficient sleep increases preference for high-calorie, high-carbohydrate foods by 33% due to altered prefrontal cortex activity (Greer et al., 2013, Nature Communications).",
    motivation: "Recovery is when adaptation occurs - prioritize sleep quality.",
    cta: "Optimize your recovery protocols"
  }
];

// Generate email HTML template
function generateEmailHTML(content: WeeklyContent, unsubscribeToken: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.subject}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #FFD600 0%, #FFA500 100%);
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            background: #000;
            color: #FFD600;
            padding: 2rem;
            text-align: center;
        }
        .header h1 {
            font-size: 2rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
        }
        .content {
            padding: 2rem;
        }
        .section {
            margin: 1.5rem 0;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #FFD600;
        }
        .tip-section {
            background: #fff3cd;
        }
        .science-section {
            background: #e8f5e8;
        }
        .nutrition-section {
            background: #e3f2fd;
        }
        .motivation-section {
            background: #f8f9fa;
            text-align: center;
            font-style: italic;
            font-weight: bold;
            font-size: 1.1rem;
            color: #333;
        }
        .section h3 {
            color: #000;
            margin-bottom: 1rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .cta-section {
            background: #FFD600;
            color: #000;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
            border-radius: 10px;
        }
        .cta-button {
            background: #000;
            color: #FFD600;
            padding: 1rem 2rem;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: none;
            display: inline-block;
            margin: 1rem 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 2rem;
            text-align: center;
            font-size: 0.9rem;
            color: #666;
        }
        .unsubscribe {
            margin-top: 1rem;
            font-size: 0.8rem;
        }
        .unsubscribe a {
            color: #666;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LAUNCH</h1>
            <p style="margin: 0.5rem 0 0 0; font-size: 1.1rem;">Weekly Transformation Insights</p>
        </div>
        
        <div class="content">
            <h2 style="color: #000; text-align: center; font-size: 1.8rem;">${content.title}</h2>
            
            <div class="section tip-section">
                <h3>💡 This Week's Power Tip</h3>
                <p>${content.tip}</p>
            </div>
            
            <div class="section science-section">
                <h3>🔬 The Science Behind It</h3>
                <p>${content.science}</p>
            </div>
            
            <div class="section nutrition-section">
                <h3>🍽️ Nutrition Implementation</h3>
                <p>${content.nutrition}</p>
            </div>
            
            <div class="section motivation-section">
                <p>"${content.motivation}"</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">- Coach Keegs</p>
            </div>
        </div>
        
        <div class="cta-section">
            <h3>${content.cta}</h3>
            <p>Get personalized guidance from Launch AI, trained on evidence-based fitness science.</p>
            <div style="margin: 20px 0;">
                <a href="https://launchfit.app/#launch-ai" class="cta-button" style="margin-bottom: 20px; display: inline-block;">${content.cta}</a>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 1.1rem; color: #000; margin-bottom: 15px; font-weight: bold;">📱 Download the Launch Lifestyle App</p>
                <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                    <tr>
                        <td><a href="https://apps.apple.com/za/app/launch-lifestyle/id6743004197" target="_blank" style="text-decoration: none; display: block; background: #000000; border-radius: 8px; padding: 8px 16px; color: white; font-family: Arial, sans-serif; text-align: center; width: 120px; height: 40px; border: 1px solid #000000;">
                            <div style="font-size: 10px; line-height: 12px; margin-bottom: 2px;">Download on the</div>
                            <div style="font-size: 16px; font-weight: bold; line-height: 18px;">App Store</div>
                        </a></td>
                        <td><a href="https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share" target="_blank" style="text-decoration: none; display: block; background: #000000; border-radius: 8px; padding: 8px 16px; color: white; font-family: Arial, sans-serif; text-align: center; width: 120px; height: 40px; border: 1px solid #000000;">
                            <div style="font-size: 10px; line-height: 12px; margin-bottom: 2px;">GET IT ON</div>
                            <div style="font-size: 16px; font-weight: bold; line-height: 18px;">Google Play</div>
                        </a></td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>LAUNCH Fitness Coaching</strong></p>
            <p>Helping you build the body and mindset for lasting transformation.</p>
            
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; font-size: 0.8rem; color: #666;">
                <p><strong>Contact Information:</strong><br>
                Coach Keegs - LAUNCH Fitness<br>
                Email: keegan.launch@gmail.com<br>
                Website: https://launchfit.app</p>
                
                <p style="margin-top: 15px;"><strong>You received this email because:</strong><br>
                You subscribed to our weekly Launch fitness newsletter. We send evidence-based fitness, nutrition, and motivation content every Monday.</p>
            </div>
            
            <div class="unsubscribe">
                <p><a href="https://launchfit.app/unsubscribe?token=${unsubscribeToken}" style="color: #666; text-decoration: underline;">Unsubscribe instantly</a> | 
                <a href="mailto:keegan.launch@gmail.com?subject=Email%20Preferences" style="color: #666; text-decoration: underline;">Update preferences</a></p>
                <p style="font-size: 0.7rem; margin-top: 10px;">This email was sent in accordance with CAN-SPAM regulations. We never sell or share your email address.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

// Send weekly email to all subscribers
async function sendWeeklyEmail() {
  // EMERGENCY KILL SWITCH - DISABLE ALL EMAILS
  if (process.env.DISABLE_ALL_EMAILS === 'true') {
    console.log('🚫 ALL EMAILS DISABLED BY KILL SWITCH - Set DISABLE_ALL_EMAILS=false to re-enable');
    return;
  }
  
  try {
    console.log('📧 Starting weekly Launch email send...');
    
    const subscribers = await storage.getAllSubscribers();
    if (!subscribers || subscribers.length === 0) {
      console.log('📭 No subscribers found for weekly email');
      return;
    }

    // Get current content based on day of week and content rotation
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, 3 = Wednesday, 5 = Friday
    
    // Calculate which content to send based on day
    let contentIndex = 0;
    if (dayOfWeek === 1) { // Monday
      contentIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000 * 3)) % Math.floor(triWeeklyContent.length / 3) * 3;
    } else if (dayOfWeek === 3) { // Wednesday  
      contentIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000 * 3)) % Math.floor(triWeeklyContent.length / 3) * 3 + 1;
    } else if (dayOfWeek === 5) { // Friday
      contentIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000 * 3)) % Math.floor(triWeeklyContent.length / 3) * 3 + 2;
    }
    
    const content = triWeeklyContent[contentIndex];

    console.log(`📬 Sending "${content.subject}" to ${subscribers.length} subscribers`);

    let successCount = 0;
    let failureCount = 0;

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        const emailHTML = generateEmailHTML(content, subscriber.email);
        
        const success = await sendEmail({
          to: subscriber.email,
          from: {
            name: 'Coach Keegs - LAUNCH Fitness',
            email: 'keegan.launch@gmail.com'
          },
          subject: content.subject,
          html: emailHTML,
          replyTo: {
            email: 'keegan.launch@gmail.com',
            name: 'Coach Keegs'
          },
          headers: {
            'List-Unsubscribe': `<https://launchfit.app/unsubscribe?token=${subscriber.email}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Entity-ID': 'launchfit-weekly-newsletter',
            'X-Campaign-Name': 'Launch Weekly Evidence-Based Fitness',
            'Precedence': 'bulk'
          }
        });

        if (success) {
          successCount++;
          // Track email open/click analytics
          await storage.trackEmailSent(subscriber.email, content.subject);
        } else {
          failureCount++;
          console.error(`Failed to send email to: ${subscriber.email}`);
        }

        // Intelligent delay to optimize deliverability and respect limits
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        failureCount++;
        console.error(`Error sending email to ${subscriber.email}:`, error);
      }
    }

    console.log(`✅ Weekly email complete: ${successCount} sent, ${failureCount} failed`);
    
    // Log weekly email metrics
    await storage.logWeeklyEmailMetrics({
      date: new Date(),
      subject: content.subject,
      totalSubscribers: subscribers.length,
      successCount,
      failureCount,
      contentWeek: contentIndex
    });

  } catch (error) {
    console.error('❌ Weekly email send failed:', error);
  }
}

// Global job references to prevent duplicates
let mondayJob: any = null;
let wednesdayJob: any = null;
let fridayJob: any = null;
let isInitialized = false; // Singleton flag

// Schedule tri-weekly emails for Monday, Wednesday, Friday at 9 AM EST - FOREVER
export function initializeWeeklyEmails() {
  // Check if emails should be disabled
  if (process.env.DISABLE_ALL_EMAILS === 'true') {
    console.log('🚫 EMAIL SCHEDULER DISABLED by environment variable DISABLE_ALL_EMAILS');
    console.log('📧 Set DISABLE_ALL_EMAILS=false to enable Mon/Wed/Fri emails');
    return;
  }
  
  // CRITICAL: Prevent multiple initializations
  if (isInitialized) {
    console.log('⚠️ Email scheduler already initialized, preventing duplicate');
    return;
  }
  
  // Stop any existing jobs before creating new ones
  if (mondayJob) {
    mondayJob.stop();
    mondayJob = null;
  }
  if (wednesdayJob) {
    wednesdayJob.stop();
    wednesdayJob = null;
  }
  if (fridayJob) {
    fridayJob.stop();
    fridayJob = null;
  }
  
  // Schedule for Monday, Wednesday, Friday at 9:00 AM EST (UTC-5)
  // Using UTC time: 9 AM EST = 2 PM UTC (14:00)
  // SINGLE EMAIL ONLY - NO DUPLICATES
  mondayJob = cron.schedule('0 14 * * 1', async () => {
    console.log('📅 Monday email scheduled - sending ONCE only');
    await sendWeeklyEmail();
  }, { 
    timezone: 'UTC',
    scheduled: true,
    runOnInit: false
  }); // Monday 9 AM EST
  
  wednesdayJob = cron.schedule('0 14 * * 3', async () => {
    console.log('📅 Wednesday email scheduled - sending ONCE only');
    await sendWeeklyEmail();
  }, { 
    timezone: 'UTC',
    scheduled: true,
    runOnInit: false
  }); // Wednesday 9 AM EST
  
  fridayJob = cron.schedule('0 14 * * 5', async () => {
    console.log('📅 Friday email scheduled - sending ONCE only');
    await sendWeeklyEmail();
  }, { 
    timezone: 'UTC',
    scheduled: true,
    runOnInit: false
  }); // Friday 9 AM EST
  
  isInitialized = true; // Mark as initialized to prevent duplicates

  console.log('📅 PERMANENT Tri-weekly email scheduler initialized - emails will be sent Monday/Wednesday/Friday at 9 AM EST FOREVER');
  console.log('📅 Using UTC timezone conversion: 14:00 UTC = 9:00 AM EST');
  console.log('📅 STATUS: AUTOMATIC DELIVERY SET TO RUN INDEFINITELY - NO DEPLOYMENTS NEEDED');
  
  // Calculate and show next scheduled send time
  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();
  
  let nextSendDay;
  let daysUntilNext;
  
  if (currentDay === 1 && currentHour < 14) {
    nextSendDay = 'Today (Monday)';
    daysUntilNext = 0;
  } else if (currentDay === 1 || currentDay === 2) {
    nextSendDay = 'Wednesday';
    daysUntilNext = 3 - currentDay;
  } else if (currentDay === 3 && currentHour < 14) {
    nextSendDay = 'Today (Wednesday)';
    daysUntilNext = 0;
  } else if (currentDay === 3 || currentDay === 4) {
    nextSendDay = 'Friday';
    daysUntilNext = 5 - currentDay;
  } else if (currentDay === 5 && currentHour < 14) {
    nextSendDay = 'Today (Friday)';
    daysUntilNext = 0;
  } else {
    nextSendDay = 'Monday';
    daysUntilNext = currentDay === 0 ? 1 : 8 - currentDay;
  }
  
  const hoursUntilNext = daysUntilNext === 0 ? 14 - currentHour : (daysUntilNext * 24) + (14 - currentHour);
  
  console.log(`⏰ Next automatic email: ${nextSendDay} at 9 AM EST (in approximately ${hoursUntilNext} hours)`);
  console.log(`📧 Current time: ${now.toUTCString()}`);
  
  // DISABLED: Recovery mechanism was causing duplicate sends on every restart
  // Emails will be sent ONLY on scheduled Mon/Wed/Fri at 9 AM EST
  // No manual triggers or recovery sends
  
  // Optional: Send test email immediately in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development mode: Use /api/test-weekly-email to send test email');
  }
}

// Export for manual testing
export { sendWeeklyEmail, generateEmailHTML, triWeeklyContent };