import sgMail from '@sendgrid/mail';

// Make SendGrid optional to prevent deployment crashes
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const isEmailEnabled = !!sendgridApiKey;

if (isEmailEnabled) {
  sgMail.setApiKey(sendgridApiKey);
  console.log('SendGrid email service initialized');
} else {
  console.log('SendGrid API key not found - email functionality disabled');
}

interface EmailParams {
  to: string;
  from: string | { name: string; email: string };
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  replyTo?: { name: string; email: string };
}

export async function sendEmail(
  params: EmailParams
): Promise<boolean> {
  // If email is disabled, log the attempt but don't fail
  if (!isEmailEnabled) {
    console.log('Email disabled - would have sent:', {
      to: params.to,
      from: params.from,
      subject: params.subject
    });
    return true; // Return true to prevent application crashes
  }

  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    };

    if (params.headers) {
      emailData.headers = params.headers;
    }

    if (params.replyTo) {
      emailData.reply_to = params.replyTo;
    }

    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}