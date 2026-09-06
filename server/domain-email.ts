import nodemailer from 'nodemailer';

// Professional email system using your own domain's SMTP server
// This provides better deliverability and professional appearance

export interface EmailParams {
  to: string;
  from: { name: string; email: string } | string;
  replyTo?: { name: string; email: string };
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

class DomainEmailService {
  private transporter: any = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Use your domain's mail server
      this.transporter = nodemailer.createTransport({
        host: 'smtp.launchfit.app',
        port: 587,
        secure: false,
        auth: {
          user: 'app@launchfit.app',
          pass: '@JACKattack123'
        },
        // Additional reliability settings
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 10, // messages per second
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false
        }
      });

      this.initialized = true;
      console.log('📧 Domain email system initialized with app@launchfit.app');
    } catch (error) {
      console.error('❌ Domain email system initialization failed:', error);
      this.initialized = false;
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.initialized || !this.transporter) {
      console.log('📧 Domain email system not initialized - logging email:', {
        to: params.to,
        subject: params.subject
      });
      return false;
    }

    try {
      // Use your domain email as the sender
      const fromAddress = 'Coach Keegs - LAUNCH Fitness <app@launchfit.app>';
      
      const mailOptions = {
        from: fromAddress,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        replyTo: params.replyTo 
          ? `${params.replyTo.name} <${params.replyTo.email}>` 
          : 'keegan.launch@gmail.com', // Reply to personal email
        attachments: params.attachments || [],
        headers: {
          ...params.headers,
          'X-Mailer': 'Launch Lifestyle Platform',
          'List-Unsubscribe': '<https://launchfit.app/unsubscribe>'
        }
      };

      console.log('📧 Sending email via Gmail server:', {
        to: params.to,
        from: fromAddress,
        subject: params.subject
      });

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error: any) {
      console.error('❌ Domain email send failed:', error.message);
      
      // Try to reinitialize on certain errors
      if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        console.log('🔄 Reinitializing domain email system...');
        this.initialize();
      }
      
      return false;
    }
  }

  // Test connection method
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;
    
    try {
      await this.transporter.verify();
      console.log('✅ Domain email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Domain email server connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const domainEmailService = new DomainEmailService();

// Export the sendEmail function for compatibility
export const sendEmail = (params: EmailParams) => domainEmailService.sendEmail(params);