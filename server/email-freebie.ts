import { sendEmail, EmailParams } from './email';

export async function sendFreebieRequestEmail(email: string): Promise<boolean> {
  const emailParams: EmailParams = {
    to: 'keegan.launch@gmail.com',
    from: 'keegan.launch@gmail.com',
    subject: '🎯 NEW FREEBIE REQUEST - Top 5 Consistency Hacks',
    text: `New freebie request from Launch AI chat!

Email: ${email}
Requested: Coach Keegs' Top 5 Consistency Hacks PDF
Date: ${new Date().toLocaleString()}

This person engaged with Launch AI and requested your free consistency guide. Please send them the PDF directly.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #ffd700; padding-bottom: 10px;">
          🎯 NEW FREEBIE REQUEST - Launch AI
        </h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Someone requested your <strong>Top 5 Consistency Hacks</strong> guide through Launch AI:
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin: 10px 0 0 0;"><strong>Requested:</strong> Top 5 Consistency Hacks PDF</p>
          <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 10px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>
        <div style="background-color: #fff3cd; border-left: 4px solid #ffd700; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Action Required:</h3>
          <p style="margin: 0; line-height: 1.6;">Please send the <strong>Top 5 Consistency Hacks PDF</strong> directly to this email address.</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          This lead came through your Launch AI chat system. They were engaged enough to provide their email for your free guide!
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Launch Lifestyle AI Lead Generation
        </p>
      </div>
    `
  };

  return await sendEmail(emailParams);
}