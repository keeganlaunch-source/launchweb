import nodemailer from 'nodemailer';

// Sustainable email system using Gmail SMTP with app-specific password
// This approach is more reliable than API keys that can expire

export interface EmailParams {
  to: string;
  from: { name: string; email: string } | string;
  replyTo?: { name: string; email: string };
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
}

class SustainableEmailSystem {
  private transporter: any = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Use Gmail SMTP with app-specific password - more stable than API keys
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'keegan.launch@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD || 'fallback-will-fail'
        },
        // Additional reliability settings
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 14 // messages per second
      });

      this.initialized = true;
      console.log('📧 Sustainable email system initialized with Gmail SMTP');
    } catch (error) {
      console.error('❌ Email system initialization failed:', error);
      this.initialized = false;
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.initialized || !this.transporter) {
      console.log('📧 Email system not initialized - logging email:', {
        to: params.to,
        subject: params.subject
      });
      return false;
    }

    try {
      const mailOptions = {
        from: typeof params.from === 'string' 
          ? params.from 
          : `${params.from.name} <${params.from.email}>`,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        replyTo: params.replyTo 
          ? `${params.replyTo.name} <${params.replyTo.email}>` 
          : undefined,
        headers: params.headers
      };

      console.log('📧 Sending email:', {
        to: params.to,
        from: mailOptions.from,
        subject: params.subject
      });

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully:', result.messageId);
      return true;

    } catch (error: any) {
      console.error('❌ Email send failed:', error.message);
      
      // Try to reinitialize on auth errors
      if (error.code === 'EAUTH' || error.responseCode === 535) {
        console.log('🔄 Reinitializing email system...');
        this.initialize();
      }
      
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;
    
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection verification failed:', error);
      return false;
    }
  }

  async getStatus() {
    return {
      initialized: this.initialized,
      connected: await this.verifyConnection(),
      provider: 'Gmail SMTP'
    };
  }
}

// Create singleton instance
export const sustainableEmailSystem = new SustainableEmailSystem();

// Export convenience function
export async function sendEmail(params: EmailParams): Promise<boolean> {
  return sustainableEmailSystem.sendEmail(params);
}

export async function getEmailStatus() {
  return sustainableEmailSystem.getStatus();
}