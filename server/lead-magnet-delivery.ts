import { sendEmail } from "./domain-email";

interface LeadMagnetDeliveryData {
  email: string;
  magnetType: string;
  userLocation?: string;
}

// Generate dynamic consultation deadline (last day of current month)
function getCurrentMonthEndDate(): string {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  return `${monthNames[lastDay.getMonth()]} ${lastDay.getDate()}${getOrdinalSuffix(lastDay.getDate())}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export async function deliverLeadMagnet(data: LeadMagnetDeliveryData): Promise<boolean> {
  try {
    let emailContent: string;
    let subject: string;

    switch (data.magnetType) {
      case 'transformation-guide':
        subject = '🚀 Your 7-Day Launch Transformation Guide is Here!';
        emailContent = createTransformationGuideEmail(data.email);
        break;
      
      case 'ballito-beach-workout':
      case 'beach-workout':
        subject = '🏖️ Your Ballito Beach Body Workout is Ready!';
        emailContent = createBeachWorkoutEmail(data.email);
        break;
      
      case 'consultation-draw':
        subject = '🎯 You\'re Entered! Free 15-Minute Consultation Draw';
        emailContent = createConsultationDrawEmail(data.email);
        break;
      
      case 'consistency-hacks':
        // Use the dedicated consistency hacks email system
        const { sendConsistencyHacksEmail } = await import('./email-consistency-hacks');
        return await sendConsistencyHacksEmail(data.email);
      
      default:
        console.log(`No email delivery configured for magnet type: ${data.magnetType}`);
        return false;
    }

    const success = await sendEmail({
      to: data.email,
      from: { name: 'Coach Keegs - LAUNCH Fitness', email: 'app@launchfit.app' },
      replyTo: { name: 'Coach Keegs', email: 'keegan.launch@gmail.com' },
      subject: subject,
      html: emailContent
    });

    if (success) {
      console.log(`Lead magnet delivered successfully: ${data.magnetType} to ${data.email}`);
    } else {
      console.error(`Failed to deliver lead magnet: ${data.magnetType} to ${data.email}`);
    }

    return success;
  } catch (error) {
    console.error('Lead magnet delivery error:', error);
    return false;
  }
}

function createTransformationGuideEmail(email: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your 7-Day Launch Transformation Guide</title>
        <style>
          /* Email client compatibility fixes */
          body, table, td, div, h1, h2, h3, p, a { margin: 0; padding: 0; }
          table { border-collapse: collapse; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          .container { width: 100% !important; max-width: 700px !important; margin: 0 auto !important; }
          .content { padding: 20px !important; }
          .header { padding: 30px 20px !important; }
          
          /* Force display for Gmail and other clients */
          .content-block { display: block !important; width: 100% !important; }
          .text-content { display: block !important; }
          
          @media only screen and (max-width: 600px) {
            .content { padding: 15px !important; }
            .header { padding: 25px 15px !important; }
            .container { max-width: 100% !important; }
          }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" style="background-color: #ffffff; max-width: 700px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td>
            
            <!-- Header -->
            <div class="header" style="background: linear-gradient(135deg, #FFD600 0%, #E6C100 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #000000; margin: 0; font-size: 32px; font-weight: bold;">LAUNCH</h1>
                <p style="color: #000000; margin: 8px 0 0 0; font-size: 18px;">Your 7-Day Transformation Guide</p>
            </div>

            <!-- Welcome Message -->
            <div class="content-block" style="padding: 40px 30px; display: block; width: 100%;">
                <h2 class="text-content" style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; display: block;">Welcome to Your Transformation Journey!</h2>
                
                <p class="text-content" style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px; display: block;">
                    Congratulations on taking the first step towards transforming your body and mindset! This comprehensive 7-day guide will kickstart your fitness journey with proven strategies that have helped over 1,000 clients achieve their goals.
                </p>

                <!-- Day-by-Day Breakdown -->
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 25px 0; font-size: 20px; text-align: center;">📅 Your 7-Day Transformation Plan</h3>
                    
                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 1 - FOUNDATION</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Morning Energizer (15 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>5 minutes dynamic warm-up (arm circles, leg swings, torso twists)</li>
                                <li>3 x 10 bodyweight squats</li>
                                <li>3 x 8 push-ups (modified on knees if needed)</li>
                                <li>2 x 30-second planks</li>
                                <li>5 minutes walking or light stretching</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Drink 2L water today, eat protein with every meal</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 2 - STRENGTH BUILDING</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Power Circuit (20 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>Warm-up: 5 minutes marching in place with arm swings</li>
                                <li>4 rounds of: 12 squats, 8 push-ups, 10 lunges per leg, 20-second plank</li>
                                <li>Rest 60 seconds between rounds</li>
                                <li>Cool down: 5 minutes stretching</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Add leafy greens to 2 meals, limit processed foods</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 3 - ACTIVE RECOVERY</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Movement Flow (15 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>10 minutes gentle walking (outdoor preferred)</li>
                                <li>5 minutes yoga-style stretching: cat-cow, child's pose, downward dog</li>
                                <li>Deep breathing: 4-7-8 technique (4 times)</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Prepare healthy snacks, plan tomorrow's meals</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 4 - HIIT POWER</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">High-Intensity Circuit (25 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>Warm-up: 5 minutes dynamic movement</li>
                                <li>6 rounds of: 30 seconds work, 30 seconds rest</li>
                                <li>Exercises: jumping jacks, squat pulses, mountain climbers, push-ups, high knees, burpees</li>
                                <li>Cool down: 5 minutes walking and stretching</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Post-workout protein within 30 minutes</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 5 - ENDURANCE</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Stamina Builder (30 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>20 minutes steady-state cardio (walking, jogging, cycling)</li>
                                <li>5 rounds of: 15 squats, 10 lunges per leg, 30-second wall sit</li>
                                <li>5 minutes full-body stretching</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Eat complex carbs for sustained energy</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 6 - STRENGTH & FLEXIBILITY</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Total Body Flow (25 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>Warm-up: 5 minutes joint mobility</li>
                                <li>Strength: 3 sets of squats, push-ups, lunges, planks (45 seconds each)</li>
                                <li>Flexibility: 10 minutes yoga flow or stretching routine</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Meal prep for sustainable habits</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 0;">
                        <h4 style="color: #FFD600; background: #000; padding: 12px; margin: 0 0 15px 0; font-size: 16px; text-align: center; border-radius: 5px;">DAY 7 - CELEBRATION & PLANNING</h4>
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                            <h5 style="color: #1f2937; margin: 0 0 10px 0;">Victory Lap (20 minutes)</h5>
                            <ul style="color: #374151; margin: 0; padding-left: 20px;">
                                <li>Light activity of your choice: walk, dance, gentle yoga</li>
                                <li>Reflection: Write down 3 things you achieved this week</li>
                                <li>Planning: Set 3 goals for next week</li>
                                <li>Celebration: Take progress photos, treat yourself to something healthy</li>
                            </ul>
                            <p style="color: #6b7280; font-style: italic; margin: 15px 0 0 0;">Nutrition Focus: Plan balanced meals for continued success</p>
                        </div>
                    </div>
                </div>

                <!-- Meal Prep Guide -->
                <div style="background: #e5f3ff; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🥗 Quick Meal Prep Guide</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #1f2937; margin: 0 0 15px 0;">Breakfast Options (Pick 2-3 for the week)</h4>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li><strong>Power Bowl:</strong> Greek yogurt + berries + nuts + honey</li>
                            <li><strong>Protein Smoothie:</strong> Banana + protein powder + spinach + almond milk</li>
                            <li><strong>Overnight Oats:</strong> Oats + milk + chia seeds + fruit</li>
                            <li><strong>Egg Scramble:</strong> 2 eggs + vegetables + whole grain toast</li>
                        </ul>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #1f2937; margin: 0 0 15px 0;">Lunch/Dinner Template</h4>
                        <p style="color: #374151; margin: 0 0 10px 0;"><strong>Build Your Plate:</strong></p>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li>1/2 plate: Vegetables (broccoli, spinach, peppers, carrots)</li>
                            <li>1/4 plate: Lean protein (chicken, fish, beans, tofu)</li>
                            <li>1/4 plate: Complex carbs (brown rice, quinoa, sweet potato)</li>
                            <li>Healthy fat: Avocado, nuts, olive oil (1-2 tbsp)</li>
                        </ul>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #1f2937; margin: 0 0 15px 0;">Snack Ideas</h4>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li>Apple slices with almond butter</li>
                            <li>Handful of mixed nuts and berries</li>
                            <li>Greek yogurt with cucumber</li>
                            <li>Hummus with vegetable sticks</li>
                        </ul>
                    </div>
                </div>

                <!-- Progress Tracking -->
                <div style="background: #fff7ed; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">📊 Track Your Progress</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #1f2937; margin: 0 0 15px 0;">Daily Check-In Questions</h4>
                        <ul style="color: #374151; margin: 0 0 20px 0; padding-left: 20px;">
                            <li>Did I complete today's workout? (Yes/No)</li>
                            <li>How did I feel during exercise? (1-10 scale)</li>
                            <li>Did I drink enough water? (Yes/No)</li>
                            <li>Did I eat protein with each meal? (Yes/No)</li>
                            <li>What's one thing I'm proud of today?</li>
                        </ul>
                        
                        <h4 style="color: #1f2937; margin: 0 0 15px 0;">Weekly Measurements</h4>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li>Energy levels (1-10)</li>
                            <li>Sleep quality (1-10)</li>
                            <li>Mood and motivation (1-10)</li>
                            <li>Physical changes you notice</li>
                            <li>Habits that are becoming easier</li>
                        </ul>
                    </div>
                </div>

                <!-- Motivation Tips -->
                <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">💪 Motivation & Mindset Tips</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li><strong>Start Small:</strong> Progress beats perfection. Even 10 minutes of movement counts.</li>
                            <li><strong>Focus on How You Feel:</strong> Notice increased energy, better sleep, improved mood.</li>
                            <li><strong>Celebrate Wins:</strong> Acknowledge every completed workout, healthy meal choice, and positive step.</li>
                            <li><strong>Prepare for Obstacles:</strong> Bad weather? Try indoor exercises. Busy day? Do a 10-minute routine.</li>
                            <li><strong>Build Community:</strong> Share your journey with friends, family, or join our Launch Lifestyle app community.</li>
                            <li><strong>Remember Your Why:</strong> Write down your main reason for starting this journey and read it when motivation is low.</li>
                        </ul>
                    </div>
                </div>

                <!-- Next Steps -->
                <div style="background: #fef2f2; border: 2px solid #fca5a5; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🚀 Ready for More?</h3>
                    <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 20px;">
                        This 7-day guide is just the beginning! To continue your transformation with personalized coaching, video demonstrations, and a supportive community:
                    </p>
                    
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
                    
                    <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                        <tr>
                            <td><a href="https://www.facebook.com/launch.lifestyle.fitness" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #1877f2; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Facebook</a></td>
                            <td><a href="https://www.instagram.com/launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #E4405F; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Instagram</a></td>
                            <td><a href="https://www.tiktok.com/@launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #000000; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">TikTok</a></td>
                        </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 15px;">
                        Join over 1,000 successful transformations with personalized coaching and video workouts
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                        Questions? Reply to this email - I personally read every message!
                    </p>
                    <p style="color: #6b7280; margin: 0; font-size: 12px;">
                        Coach Keegs - LAUNCH Fitness<br>
                        Ballito, South Africa<br>
                        <a href="mailto:keegan.launch@gmail.com" style="color: #FFD600;">keegan.launch@gmail.com</a>
                    </p>
                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}

function createBeachWorkoutEmail(email: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Ballito Beach Body Workout</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" style="background-color: #ffffff; max-width: 700px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td>
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🏖️ BALLITO BEACH BODY</h1>
                <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 18px;">Your 20-Minute HIIT Workout</p>
            </div>

            <!-- Welcome Message -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Get Beach Body Ready! 🌊</h2>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Welcome to the Ballito Beach Body Workout! This high-intensity routine is designed to get you fit, strong, and confident - no equipment needed. Perfect for home, the beach, or anywhere you have space to move.
                </p>

                <!-- Workout Overview -->
                <div style="background: #f0f9ff; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">⚡ Workout Overview</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li><strong>Duration:</strong> 20 minutes total</li>
                            <li><strong>Style:</strong> High-Intensity Interval Training (HIIT)</li>
                            <li><strong>Equipment:</strong> None required - bodyweight only</li>
                            <li><strong>Space Needed:</strong> 2m x 2m area</li>
                            <li><strong>Intensity:</strong> Beginner to Advanced (modifications included)</li>
                            <li><strong>Frequency:</strong> 3-4 times per week for best results</li>
                        </ul>
                    </div>
                </div>

                <!-- Warm-Up -->
                <div style="background: #fff7ed; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🔥 Warm-Up (3 minutes)</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <p style="color: #374151; margin: 0 0 15px 0; font-weight: bold;">Perform each movement for 30 seconds:</p>
                        <ol style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li><strong>Arm Circles:</strong> 15 seconds forward, 15 seconds backward</li>
                            <li><strong>Leg Swings:</strong> Forward and back, then side to side</li>
                            <li><strong>Torso Twists:</strong> Hands on hips, rotate left and right</li>
                            <li><strong>Knee Lifts:</strong> March in place, lifting knees high</li>
                            <li><strong>Ankle Rolls:</strong> Rotate each ankle 15 seconds each direction</li>
                            <li><strong>Light Bouncing:</strong> Gentle jumping on the spot</li>
                        </ol>
                    </div>
                </div>

                <!-- Main Workout -->
                <div style="background: #fef2f2; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">💪 Main Workout (15 minutes)</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0; text-align: center;">Format: 45 seconds work, 15 seconds rest</h4>
                        <p style="color: #374151; margin: 0; text-align: center; font-style: italic;">Complete 3 rounds of all 5 exercises</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Exercise 1: Burpee Beach Blast</h4>
                        <p style="color: #374151; margin: 0 0 10px 0; font-weight: bold;">How to perform:</p>
                        <ol style="color: #374151; margin: 0 0 15px 0; padding-left: 20px;">
                            <li>Start standing with feet hip-width apart</li>
                            <li>Squat down and place hands on ground</li>
                            <li>Jump feet back into plank position</li>
                            <li>Perform a push-up (optional)</li>
                            <li>Jump feet back to squat position</li>
                            <li>Explode up with arms overhead</li>
                        </ol>
                        <p style="color: #6b7280; margin: 0; font-style: italic;"><strong>Beginner:</strong> Step back instead of jumping, remove push-up</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Exercise 2: Squat Jump Waves</h4>
                        <p style="color: #374151; margin: 0 0 10px 0; font-weight: bold;">How to perform:</p>
                        <ol style="color: #374151; margin: 0 0 15px 0; padding-left: 20px;">
                            <li>Stand with feet slightly wider than hip-width</li>
                            <li>Lower into squat position (thighs parallel to ground)</li>
                            <li>Explode up into a jump</li>
                            <li>Land softly back into squat position</li>
                            <li>Repeat with powerful, controlled movements</li>
                        </ol>
                        <p style="color: #6b7280; margin: 0; font-style: italic;"><strong>Beginner:</strong> Remove the jump, focus on squatting up and down</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Exercise 3: Mountain Climber Madness</h4>
                        <p style="color: #374151; margin: 0 0 10px 0; font-weight: bold;">How to perform:</p>
                        <ol style="color: #374151; margin: 0 0 15px 0; padding-left: 20px;">
                            <li>Start in plank position (hands under shoulders)</li>
                            <li>Keep core tight and body in straight line</li>
                            <li>Alternate bringing knees toward chest rapidly</li>
                            <li>Maintain plank position throughout</li>
                            <li>Breathe steadily despite fast movement</li>
                        </ol>
                        <p style="color: #6b7280; margin: 0; font-style: italic;"><strong>Beginner:</strong> Slow down the pace, step instead of jumping</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Exercise 4: Surfboard Push-Ups</h4>
                        <p style="color: #374151; margin: 0 0 10px 0; font-weight: bold;">How to perform:</p>
                        <ol style="color: #374151; margin: 0 0 15px 0; padding-left: 20px;">
                            <li>Start in plank position</li>
                            <li>Lower body down in one controlled movement</li>
                            <li>Keep elbows close to body (not flared out)</li>
                            <li>Push back up to starting position</li>
                            <li>Imagine pushing up off a surfboard</li>
                        </ol>
                        <p style="color: #6b7280; margin: 0; font-style: italic;"><strong>Beginner:</strong> Perform on knees or against a wall</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #dc2626; margin: 0 0 15px 0;">Exercise 5: High Knee Beach Run</h4>
                        <p style="color: #374151; margin: 0 0 10px 0; font-weight: bold;">How to perform:</p>
                        <ol style="color: #374151; margin: 0 0 15px 0; padding-left: 20px;">
                            <li>Run in place lifting knees to hip height</li>
                            <li>Pump arms naturally with the movement</li>
                            <li>Stay on balls of feet</li>
                            <li>Maintain quick, light steps</li>
                            <li>Keep core engaged throughout</li>
                        </ol>
                        <p style="color: #6b7280; margin: 0; font-style: italic;"><strong>Beginner:</strong> March in place with high knees at slower pace</p>
                    </div>
                </div>

                <!-- Cool Down -->
                <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🧘 Cool Down (2 minutes)</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <p style="color: #374151; margin: 0 0 15px 0; font-weight: bold;">Hold each stretch for 20-30 seconds:</p>
                        <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li><strong>Forward Fold:</strong> Hang forward, let arms dangle</li>
                            <li><strong>Quad Stretch:</strong> Pull one foot to glutes, switch sides</li>
                            <li><strong>Calf Stretch:</strong> Step back, press heel down</li>
                            <li><strong>Shoulder Rolls:</strong> Backwards then forwards</li>
                            <li><strong>Deep Breathing:</strong> 4 counts in, 6 counts out (repeat 5 times)</li>
                        </ul>
                    </div>
                </div>

                <!-- Training Tips -->
                <div style="background: #fefce8; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🎯 Pro Training Tips</h3>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px;">
                        <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li><strong>Hydration:</strong> Drink water before, during, and after your workout</li>
                            <li><strong>Form First:</strong> Perfect technique beats speed every time</li>
                            <li><strong>Listen to Your Body:</strong> Push hard but know when to rest</li>
                            <li><strong>Consistency:</strong> Better to do this 3x/week than once perfectly</li>
                            <li><strong>Progress:</strong> Add 5 seconds to work intervals as you get stronger</li>
                            <li><strong>Recovery:</strong> Take at least one full rest day between sessions</li>
                            <li><strong>Nutrition:</strong> Eat protein within 30 minutes post-workout</li>
                        </ul>
                    </div>
                </div>

                <!-- App Promotion - CLEAN DESIGN -->
                <div style="background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); border: 2px solid #0ea5e9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h3 style="color: #0369a1; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🎥 Want Video Demonstrations?</h3>
                    <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 20px;">
                        This workout is just the beginning! Get video demonstrations, form tips, and daily workouts with the Launch Lifestyle app:
                    </p>
                    
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
                    
                    <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                        <tr>
                            <td><a href="https://www.facebook.com/launch.lifestyle.fitness" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #1877f2; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Facebook</a></td>
                            <td><a href="https://www.instagram.com/launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #E4405F; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Instagram</a></td>
                            <td><a href="https://www.tiktok.com/@launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #000000; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">TikTok</a></td>
                        </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 15px;">
                        Join over 1,000 people transforming their bodies with personalized coaching
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                        Questions about the workout? Reply to this email - I personally read every message!
                    </p>
                    <p style="color: #6b7280; margin: 0; font-size: 12px;">
                        Coach Keegs - LAUNCH Fitness<br>
                        Ballito, South Africa<br>
                        <a href="mailto:keegan.launch@gmail.com" style="color: #0ea5e9;">keegan.launch@gmail.com</a>
                    </p>
                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}

function createConsultationDrawEmail(email: string): string {
  const drawEndDate = getCurrentMonthEndDate();
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Draw Entry Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">LAUNCH</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">Lifestyle Fitness</p>
            </div>
            
            <!-- Profile Photo Section -->
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="width: 80px; height: 80px; background: #FFD600; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <span style="color: #000; font-size: 36px; font-weight: bold; font-family: Arial, sans-serif;">K</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">Coach Keegs</p>
              </div>

              <h2 style="color: #1f2937; margin: 0 0 20px 0; text-align: center;">🎯 You're In the Draw!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! You've been successfully entered into this month's free 15-minute consultation draw.
              </p>
              
              <!-- Draw Details -->
              <div style="background: #fffef0; border: 2px solid #FFD600; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1A1A1A; margin: 0 0 15px 0;">📅 Draw Details</h3>
                <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>Draw Ends:</strong> ${drawEndDate}</li>
                  <li><strong>Winners Selected:</strong> 3 people each month</li>
                  <li><strong>Consultation Value:</strong> R500 (Free for winners)</li>
                  <li><strong>Format:</strong> Video call or in-person (Ballito area)</li>
                </ul>
              </div>
              
              <!-- What You'll Get -->
              <div style="background: #f0f9ff; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">🎁 What Winners Receive</h3>
                <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Personalized fitness assessment</li>
                  <li>Custom nutrition recommendations</li>
                  <li>Goal-setting and action plan</li>
                  <li>Form checking and exercise modifications</li>
                  <li>Access to exclusive training tips</li>
                </ul>
              </div>
              
              <!-- App Promotion -->
              <div style="background: #fffef0; border: 2px solid #FFD600; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1A1A1A; margin: 0 0 15px 0;">💪 Get Started Today!</h3>
                <p style="color: #1A1A1A; margin: 0 0 15px 0;">
                  While you wait for the draw results, start your transformation with the <strong>Launch Lifestyle app</strong>!
                </p>
                <p style="color: #333333; margin: 0 0 15px 0; font-size: 14px;">
                  Get unlimited workouts, nutrition plans, and community support.
                </p>
                
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
                
                <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                  <tr>
                    <td><a href="https://www.facebook.com/launch.lifestyle.fitness" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #1877f2; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Facebook</a></td>
                    <td><a href="https://www.instagram.com/launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #E4405F; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Instagram</a></td>
                    <td><a href="https://www.tiktok.com/@launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #000000; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">TikTok</a></td>
                  </tr>
                </table>
                <p style="color: #333333; margin: 0; font-size: 12px; text-align: center;">
                  Or visit <strong>launchfit.app</strong> for the web version
                </p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                Winners will be randomly selected and notified by email. Good luck, and remember - whether you win or not, your fitness journey starts now!
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                Best regards,<br>
                <strong>Coach Keegs</strong><br>
                Launch Lifestyle Fitness
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                Launch Lifestyle Fitness • Evidence-Based Health & Fitness Guidance<br>
                keegan.launch@gmail.com
              </p>
            </div>
        </div>
    </body>
    </html>
  `;
}