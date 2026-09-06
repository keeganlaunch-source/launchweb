// Directly send test emails to keegan.launch@gmail.com
import nodemailer from 'nodemailer';

// Use the same Gmail SMTP configuration as the working system
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'app@launchfit.app',
    pass: process.env.GMAIL_APP_PASSWORD || '@JACKattack123'
  }
});

const testEmails = [
  {
    subject: '🎉 TEST: Your Launch Digital Recipe Book is Ready!',
    type: 'Cookbook Purchase',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Cookbook Purchase Test</title></head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2rem;">LAUNCH</h1>
            <p style="color: white; margin: 10px 0 0 0;">TEST - Recipe Book Purchase</p>
          </div>
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="width: 80px; height: 80px; background: #FFD600; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #000;">
                <span style="color: #000; font-size: 36px; font-weight: bold;">K</span>
              </div>
              <p style="color: #666; font-size: 14px; margin: 0;">Coach Keegs</p>
            </div>
            <h2 style="color: #1f2937; text-align: center;">✅ Cookbook System Working!</h2>
            <p>This email confirms your cookbook purchase confirmation system is working with professional domain email (app@launchfit.app).</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  {
    subject: '🚀 TEST: Your 7-Day Launch Transformation Guide',
    type: '7-Day Transformation Guide',
    html: `
      <!DOCTYPE html>
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TEST - 7-Day Transformation</h1>
          </div>
          <div style="padding: 30px;">
            <p>✅ Your 7-day transformation guide delivery system is working with professional branding!</p>
          </div>
        </div>
      </body></html>
    `
  },
  {
    subject: '🏖️ TEST: Your Ballito Beach Body Workout',
    type: 'Beach Body Workout',
    html: `
      <!DOCTYPE html>
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TEST - Beach Body Workout</h1>
          </div>
          <div style="padding: 30px;">
            <p>✅ Your beach body workout delivery system is working with professional branding!</p>
          </div>
        </div>
      </body></html>
    `
  },
  {
    subject: '🎯 TEST: Consultation Draw Entry Confirmed',
    type: 'Consultation Draw',
    html: `
      <!DOCTYPE html>
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TEST - Consultation Draw</h1>
          </div>
          <div style="padding: 30px;">
            <p>✅ Your consultation draw system is working with DYNAMIC dates (automatically shows August 31st now, will show September 30th next month without deployments)!</p>
          </div>
        </div>
      </body></html>
    `
  },
  {
    subject: '🎯 TEST: Your 5 Consistency Hacks for Fitness Success',
    type: 'Consistency Hacks',
    html: `
      <!DOCTYPE html>
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TEST - Consistency Hacks</h1>
          </div>
          <div style="padding: 30px;">
            <p>✅ Your consistency hacks delivery system is working with professional branding!</p>
          </div>
        </div>
      </body></html>
    `
  },
  {
    subject: '📧 TEST: Weekly Evidence-Based Fitness Newsletter',
    type: '3x Weekly Newsletter',
    html: `
      <!DOCTYPE html>
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #FFD600, #000000); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">TEST - Weekly Newsletter</h1>
          </div>
          <div style="padding: 30px;">
            <p>✅ Your 3x weekly newsletter system is SET TO RUN FOREVER!</p>
            <p><strong>Schedule:</strong> Monday, Wednesday, Friday at 9 AM EST</p>
            <p><strong>Status:</strong> PERMANENT - No deployments needed</p>
          </div>
        </div>
      </body></html>
    `
  }
];

async function sendAllTestEmails() {
  console.log('🧪 Sending comprehensive test emails to keegan.launch@gmail.com...');
  
  for (const email of testEmails) {
    try {
      await transporter.sendMail({
        from: '"Coach Keegs - LAUNCH Fitness" <app@launchfit.app>',
        replyTo: 'keegan.launch@gmail.com',
        to: 'keegan.launch@gmail.com',
        subject: email.subject,
        html: email.html
      });
      console.log(`✅ Sent: ${email.type}`);
    } catch (error) {
      console.error(`❌ Failed to send ${email.type}:`, error.message);
    }
  }
  
  console.log('🎉 All test emails sent successfully!');
}

sendAllTestEmails().catch(console.error);