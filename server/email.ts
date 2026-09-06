import { MailService } from '@sendgrid/mail';

// Make SendGrid optional - use environment variable or disable if not available
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const isEmailEnabled = !!sendgridApiKey;

let mailService: MailService | null = null;

if (isEmailEnabled) {
  mailService = new MailService();
  mailService.setApiKey(sendgridApiKey);
  console.log('📧 SendGrid email service initialized');
} else {
  console.log('⚠️ SendGrid API key not found - email functionality disabled');
}

export interface EmailParams {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  categories?: string[];
  customArgs?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string; // base64 content
    type: string;
  }>;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // If email is disabled, log the attempt but don't fail
  if (!isEmailEnabled || !mailService) {
    console.log('📧 Email disabled - would have sent:', {
      to: params.to,
      from: params.from,
      subject: params.subject
    });
    return true; // Return true to prevent application crashes
  }

  try {
    console.log('📧 Sending email:', {
      to: params.to,
      from: params.from,
      subject: params.subject
    });
    
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      content: [
        {
          type: params.html ? 'text/html' : 'text/plain',
          value: params.html || params.text || 'Welcome to Launch Lifestyle!'
        }
      ],
      // Anti-spam headers
      headers: {
        'List-Unsubscribe': '<mailto:noreply@launchfit.app?subject=unsubscribe>',
        'X-Mailer': 'Launch Lifestyle'
      },
      replyTo: 'keegan.launch@gmail.com',
      // Tracking and categorization
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false },
        subscriptionTracking: { enable: false }
      }
    };

    // Add optional fields
    if (params.replyTo) emailData.replyTo = params.replyTo;
    if (params.categories) emailData.categories = params.categories;
    if (params.customArgs) emailData.customArgs = params.customArgs;
    if (params.attachments) emailData.attachments = params.attachments;
    
    const response = await mailService.send(emailData);
    console.log('✅ Email delivered successfully to:', params.to);
    console.log('📊 SendGrid response:', response[0]?.statusCode);
    return true;
    
  } catch (sendGridError: any) {
    console.error('❌ SendGrid delivery error:', {
      error: sendGridError.message,
      code: sendGridError.code,
      statusCode: sendGridError.code,
      response: sendGridError.response?.body,
      fullError: sendGridError
    });
    
    // Check if this is an authentication issue
    if (sendGridError.code === 401 || sendGridError.code === 403) {
      console.error('🔑 Authentication error - API key issue detected');
      return false;
    }
    
    // For other errors, log but don't crash the application
    console.log('⚠️ Email delivery failed but application continues');
    return false;
  }
}

export async function sendContactFormEmail(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const emailParams: EmailParams = {
    to: 'keegan.launch@gmail.com',
    from: 'keegan.launch@gmail.com',
    subject: `Launch Lifestyle Contact: ${formData.subject}`,
    text: `
New contact form submission from Launch Lifestyle website:

Contact Details:
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Date: ${new Date().toLocaleDateString()}

Message:
${formData.message}

You can reply directly to this email or contact them at: ${formData.email}

Best regards,
Launch Lifestyle Website
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Launch Lifestyle - New Contact Form Submission
        </h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Someone has contacted you through your Launch Lifestyle website:
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Name:</strong> ${formData.name}</p>
          <p style="margin: 10px 0 0 0;"><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p style="margin: 10px 0 0 0;"><strong>Subject:</strong> ${formData.subject}</p>
          <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="background-color: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Message:</h3>
          <p style="margin: 0; line-height: 1.6;">${formData.message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          You can reply directly to this email or contact them at: <a href="mailto:${formData.email}">${formData.email}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Launch Lifestyle Website Notification
        </p>
      </div>
    `
  };

  return await sendEmail(emailParams);
}

export async function sendNewsletterSignupEmail(email: string): Promise<boolean> {
  const emailParams: EmailParams = {
    to: 'keegan.launch@gmail.com',
    from: 'keegan.launch@gmail.com',
    subject: 'Launch Lifestyle - New Newsletter Subscriber',
    text: `
A new subscriber has joined your Launch Lifestyle newsletter!

Subscriber Email: ${email}
Date: ${new Date().toLocaleDateString()}

This subscriber will receive your weekly fitness tips, nutrition advice, and exclusive content.

Best regards,
Launch Lifestyle Website
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Launch Lifestyle - New Newsletter Subscriber
        </h2>
        <p style="font-size: 16px; line-height: 1.5;">
          A new subscriber has joined your Launch Lifestyle newsletter!
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Subscriber Email:</strong> ${email}</p>
          <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="font-size: 14px; color: #666;">
          This subscriber will receive your weekly fitness tips, nutrition advice, and exclusive content.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Launch Lifestyle Website Notification
        </p>
      </div>
    `
  };

  return await sendEmail(emailParams);
}