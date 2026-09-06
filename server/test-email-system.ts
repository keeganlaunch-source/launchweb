import { sendEmail } from './domain-email';
import { deliverLeadMagnet } from './lead-magnet-delivery';
import { sendConsistencyHacksEmail } from './email-consistency-hacks';
import { notifyConsultationWinnerSelection, notifyConsultationWinner } from './consultation-winner-notifications';

export async function sendTestEmails(): Promise<void> {
  const testEmail = 'keegan.launch@gmail.com';
  console.log('🧪 Sending comprehensive test emails to', testEmail);

  try {
    // 1. Test Cookbook Purchase Email (using the working system)
    console.log('📧 Sending cookbook purchase confirmation...');
    const cookbookSuccess = await sendEmail({
      to: testEmail,
      from: { name: 'Coach Keegs - LAUNCH Fitness', email: 'app@launchfit.app' },
      replyTo: { name: 'Coach Keegs', email: 'keegan.launch@gmail.com' },
      subject: '🎉 Your Launch Digital Recipe Book is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Your Launch Digital Recipe Book</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">LAUNCH</h1>
                  <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">Digital Recipe Book</p>
                </div>
                
                <!-- Profile Photo Section -->
                <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
                  <div style="text-align: center; margin-bottom: 25px;">
                    <div style="width: 80px; height: 80px; background: #FFD600; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                      <span style="color: #000; font-size: 36px; font-weight: bold; font-family: Arial, sans-serif;">K</span>
                    </div>
                    <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">Coach Keegs</p>
                  </div>

                  <h2 style="color: #1f2937; margin: 0 0 20px 0; text-align: center;">Thank You for Your Purchase!</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                    Your Launch Digital Recipe Book is ready for download. This comprehensive guide contains 60 macro-friendly recipes designed to fuel your fitness journey.
                  </p>
                  
                  <!-- Download Section -->
                  <div style="background: #fffef0; border: 2px solid #FFD600; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #1A1A1A; margin: 0 0 15px 0;">📥 Download Your Recipe Book</h3>
                    <a href="https://launchfit.app/api/download/secure-cookbook-token" style="display: inline-block; background: #FFD600; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                      Download Recipe Book (PDF)
                    </a>
                    <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                      This link expires in 24 hours for security. Download now!
                    </p>
                  </div>
                  
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    Launch Lifestyle Fitness • Evidence-Based Health & Fitness Guidance<br>
                    keegan.launch@gmail.com
                  </p>
                </div>
            </div>
        </body>
        </html>
      `
    });

    // 2. Test Lead Magnet Emails
    console.log('📧 Sending 7-day transformation guide...');
    await deliverLeadMagnet({
      email: testEmail,
      magnetType: 'transformation-guide',
      userLocation: 'Test Location'
    });

    console.log('📧 Sending beach body workout...');
    await deliverLeadMagnet({
      email: testEmail,
      magnetType: 'beach-workout',
      userLocation: 'Test Location'
    });

    console.log('📧 Sending consultation draw confirmation...');
    await deliverLeadMagnet({
      email: testEmail,
      magnetType: 'consultation-draw',
      userLocation: 'Test Location'
    });

    console.log('📧 Sending consistency hacks...');
    await sendConsistencyHacksEmail(testEmail);

    // 3. Test Consultation Winner Notifications
    console.log('📧 Sending consultation winner selection notification...');
    const mockEntries = [
      { email: 'test1@example.com', location: 'Ballito, SA', createdAt: new Date() },
      { email: 'test2@example.com', location: 'Durban, SA', createdAt: new Date() },
      { email: 'test3@example.com', location: 'Cape Town, SA', createdAt: new Date() }
    ];
    await notifyConsultationWinnerSelection(mockEntries);

    console.log('📧 Sending consultation winner notification...');
    await notifyConsultationWinner(testEmail);

    console.log('✅ All test emails sent successfully!');
  } catch (error) {
    console.error('❌ Error sending test emails:', error);
  }
}

// Add route to trigger test emails
export function addTestEmailRoute(app: any) {
  app.get('/api/test-all-emails', async (req: any, res: any) => {
    await sendTestEmails();
    res.json({ success: true, message: 'Test emails sent to keegan.launch@gmail.com' });
  });
}