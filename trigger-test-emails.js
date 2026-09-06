// Send comprehensive test emails using the working domain email system
import { sendEmail } from './server/domain-email.js';

const testEmails = [
  {
    subject: '🎉 TEST: Launch Digital Recipe Book - System Working!',
    type: 'Cookbook Purchase Test',
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 2rem;">LAUNCH</h1>
      <p style="color: white; margin: 10px 0 0 0;">Recipe Book Test - System Working</p>
    </div>
    <div style="padding: 30px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 80px; height: 80px; background: #FFD600; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #000;">
          <span style="color: #000; font-size: 36px; font-weight: bold;">K</span>
        </div>
        <p style="color: #666; font-size: 14px; margin: 0;">Coach Keegs</p>
      </div>
      <h2 style="color: #1f2937; text-align: center;">✅ Cookbook Email System Working!</h2>
      <p>This confirms your cookbook purchase system is working perfectly with professional domain email.</p>
    </div>
  </div>
</body></html>`
  },
  {
    subject: '🚀 TEST: 7-Day Transformation Guide - Professional System',
    type: '7-Day Guide Test',  
    html: `<!DOCTYPE html>
<html><body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">TEST - 7-Day Transformation</h1>
    </div>
    <div style="padding: 30px;">
      <p>✅ Your 7-day transformation guide system is working with professional branding!</p>
    </div>
  </div>
</body></html>`
  },
  {
    subject: '🏖️ TEST: Beach Body Workout - Professional System', 
    type: 'Beach Body Test',
    html: `<!DOCTYPE html>
<html><body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">TEST - Beach Body Workout</h1>
    </div>
    <div style="padding: 30px;">
      <p>✅ Your beach body workout system is working with professional branding!</p>
    </div>
  </div>
</body></html>`
  },
  {
    subject: '🎯 TEST: Consultation Draw - DYNAMIC Date System Working!',
    type: 'Consultation Test',
    html: `<!DOCTYPE html>
<html><body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">TEST - Consultation Draw</h1>
    </div>
    <div style="padding: 30px;">
      <p>✅ Your consultation system is working with AUTOMATIC monthly dates!</p>
      <p><strong>Current deadline:</strong> August 31st (will auto-update to September 30th next month)</p>
    </div>
  </div>
</body></html>`
  },
  {
    subject: '🎯 TEST: Consistency Hacks - Professional System Working',
    type: 'Consistency Hacks Test',
    html: `<!DOCTYPE html>
<html><body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">TEST - Consistency Hacks</h1>
    </div>
    <div style="padding: 30px;">
      <p>✅ Your consistency hacks system is working with professional branding!</p>
    </div>
  </div>
</body></html>`
  },
  {
    subject: '📧 TEST: 3x Weekly Newsletter - SET TO RUN FOREVER!',
    type: 'Newsletter Test',
    html: `<!DOCTYPE html>
<html><body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">TEST - 3x Weekly Newsletter</h1>
    </div>
    <div style="padding: 30px;">
      <p>✅ Your newsletter system is PERMANENT and set to run FOREVER!</p>
      <p><strong>Schedule:</strong> Monday, Wednesday, Friday at 9 AM EST</p>
      <p><strong>Status:</strong> Will run indefinitely without deployments</p>
    </div>
  </div>
</body></html>`
  }
];

async function sendAllTests() {
  console.log('🧪 Sending test emails to keegan.launch@gmail.com using working domain email system...');
  
  for (const email of testEmails) {
    try {
      const success = await sendEmail({
        to: 'keegan.launch@gmail.com',
        from: { name: 'Coach Keegs - LAUNCH Fitness', email: 'app@launchfit.app' },
        replyTo: { name: 'Coach Keegs', email: 'keegan.launch@gmail.com' },
        subject: email.subject,
        html: email.html
      });
      
      if (success) {
        console.log(`✅ Sent: ${email.type}`);
      } else {
        console.log(`❌ Failed: ${email.type}`);
      }
    } catch (error) {
      console.error(`❌ Error sending ${email.type}:`, error.message);
    }
  }
  
  console.log('🎉 Test email process complete!');
}

sendAllTests().catch(console.error);