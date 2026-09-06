import { Resend } from 'resend';

// Resend email service - more reliable than SendGrid and Gmail SMTP
// Better deliverability and developer experience

export interface EmailParams {
  to: string;
  from: { name: string; email: string } | string;
  replyTo?: { name: string; email: string };
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
}

class ResendEmailService {
  private resend: Resend | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.log('📧 Resend API key not found - email functionality will be limited');
        this.initialized = false;
        return;
      }

      this.resend = new Resend(apiKey);
      this.initialized = true;
      console.log('📧 Resend email service initialized successfully');
    } catch (error) {
      console.error('❌ Resend initialization failed:', error);
      this.initialized = false;
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.initialized || !this.resend) {
      console.log('📧 Resend not initialized - logging email:', {
        to: params.to,
        subject: params.subject
      });
      return false;
    }

    try {
      const fromAddress = typeof params.from === 'string' 
        ? params.from 
        : `${params.from.name} <${params.from.email}>`;

      const { data, error } = await this.resend.emails.send({
        from: fromAddress,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        reply_to: params.replyTo ? `${params.replyTo.name} <${params.replyTo.email}>` : undefined,
        headers: params.headers
      });

      if (error) {
        console.error('❌ Resend email error:', error);
        return false;
      }

      console.log('✅ Email sent successfully via Resend:', data?.id);
      return true;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const resendEmailService = new ResendEmailService();

// Export the sendEmail function for compatibility
export const sendEmail = (params: EmailParams) => resendEmailService.sendEmail(params);