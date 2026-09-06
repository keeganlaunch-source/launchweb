import { sendEmail } from './domain-email';

// Generate notification to Coach Keegs when winners need to be selected
export async function notifyConsultationWinnerSelection(entries: any[]): Promise<boolean> {
  if (entries.length === 0) return true;

  const currentDate = new Date();
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  const drawEndDate = `${monthNames[lastDay.getMonth()]} ${lastDay.getDate()}${getOrdinalSuffix(lastDay.getDate())}`;

  try {
    const success = await sendEmail({
      to: 'keegan.launch@gmail.com',
      from: { name: 'Launch Lifestyle System', email: 'app@launchfit.app' },
      subject: `🎯 Consultation Draw Winners - ${entries.length} entries for ${drawEndDate}`,
      html: createWinnerSelectionNotification(entries, drawEndDate)
    });

    console.log(`Winner selection notification sent: ${success}`);
    return success;
  } catch (error) {
    console.error('Failed to send winner selection notification:', error);
    return false;
  }
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

function createWinnerSelectionNotification(entries: any[], drawEndDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Consultation Draw Winner Selection</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Consultation Draw</h1>
                <p style="color: white; margin: 10px 0 0 0;">Winner Selection Required</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Draw Details</h2>
                <p style="color: #4b5563; margin-bottom: 20px;">
                    <strong>Draw End Date:</strong> ${drawEndDate}<br>
                    <strong>Total Entries:</strong> ${entries.length}<br>
                    <strong>Winners to Select:</strong> 3 people
                </p>

                <h3 style="color: #1f2937; margin: 20px 0 15px 0;">Entries</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                    ${entries.map((entry, index) => `
                        <div style="padding: 10px; border-bottom: 1px solid #e5e7eb; ${index === entries.length - 1 ? 'border-bottom: none;' : ''}">
                            <strong>${entry.email}</strong><br>
                            <span style="color: #6b7280; font-size: 14px;">
                                ${entry.location ? `${entry.location} • ` : ''}${new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    `).join('')}
                </div>

                <div style="background: #fffef0; border: 2px solid #FFD600; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #1A1A1A; margin: 0 0 10px 0;">Action Required</h4>
                    <p style="color: #374151; margin: 0;">
                        Please manually select 3 winners from the entries above and notify them via email. 
                        Each winner receives a free 15-minute consultation (R500 value).
                    </p>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                    This is an automated notification from the Launch Lifestyle system.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Send winner notification email to selected customers
export async function notifyConsultationWinner(winnerEmail: string): Promise<boolean> {
  try {
    const success = await sendEmail({
      to: winnerEmail,
      from: { name: 'Coach Keegs - LAUNCH Fitness', email: 'app@launchfit.app' },
      replyTo: { name: 'Coach Keegs', email: 'keegan.launch@gmail.com' },
      subject: '🎉 You Won! Free 15-Minute Consultation with Coach Keegs',
      html: createWinnerNotificationEmail(winnerEmail)
    });

    console.log(`Winner notification sent to ${winnerEmail}: ${success}`);
    return success;
  } catch (error) {
    console.error(`Failed to send winner notification to ${winnerEmail}:`, error);
    return false;
  }
}

function createWinnerNotificationEmail(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Congratulations - You Won!</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 2rem;">🎉 CONGRATULATIONS!</h1>
                <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You're a Winner!</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
                <!-- Profile Photo -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="width: 80px; height: 80px; background: #FFD600; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <span style="color: #000; font-size: 36px; font-weight: bold;">K</span>
                    </div>
                    <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">Coach Keegs</p>
                </div>

                <h2 style="color: #1f2937; margin: 0 0 20px 0; text-align: center;">You Won the Free Consultation!</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                    Amazing news! You've been selected as one of our 3 monthly winners for a free 15-minute consultation with Coach Keegs (R500 value).
                </p>

                <!-- Prize Details -->
                <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0;">🎁 Your Free Consultation Includes:</h3>
                    <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Personalized fitness assessment and goal setting</li>
                        <li>Custom nutrition recommendations for your lifestyle</li>
                        <li>Form checking and exercise modifications</li>
                        <li>Motivation strategies and habit building tips</li>
                        <li>Q&A session for all your fitness questions</li>
                    </ul>
                </div>

                <!-- Next Steps -->
                <div style="background: #fffef0; border: 2px solid #FFD600; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1A1A1A; margin: 0 0 15px 0;">📅 Next Steps</h3>
                    <p style="color: #374151; margin: 0 0 15px 0;">
                        <strong>Please reply to this email</strong> with your preferred time slots and let me know:
                    </p>
                    <ul style="color: #374151; margin: 0; padding-left: 20px;">
                        <li>Your available days and times (weekdays/weekends)</li>
                        <li>Preferred format: Video call or in-person (Ballito area)</li>
                        <li>Your main fitness goals and any current challenges</li>
                    </ul>
                    <p style="color: #374151; margin: 15px 0 0 0;">
                        I'll respond within 24 hours to confirm your consultation slot!
                    </p>
                </div>

                <!-- App Promotion -->
                <div style="background: #f0f9ff; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0;">💪 Get Started Before Our Call</h3>
                    <p style="color: #374151; margin: 0 0 15px 0;">
                        Download the Launch Lifestyle app to start your transformation today:
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
                </div>

                <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                    I'm looking forward to helping you achieve your fitness goals and creating a personalized plan that fits your lifestyle!
                </p>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                    Congratulations again, and speak soon!<br>
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