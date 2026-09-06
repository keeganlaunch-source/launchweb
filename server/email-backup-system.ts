import { MailService } from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Multi-provider email system with automatic failover
interface EmailProvider {
  name: string;
  send: (params: EmailParams) => Promise<boolean>;
  isHealthy: () => Promise<boolean>;
}

export interface EmailParams {
  to: string;
  from: { name: string; email: string } | string;
  replyTo?: { name: string; email: string };
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
}

class SendGridProvider implements EmailProvider {
  name = 'SendGrid';
  private mailService: MailService | null = null;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      this.mailService = new MailService();
      this.mailService.setApiKey(apiKey);
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.mailService) return false;
    
    try {
      // Test API key with a simple request
      await this.mailService.send({
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Test',
        text: 'Test',
      }, false); // Don't actually send
      return true;
    } catch (error: any) {
      console.log(`SendGrid health check failed: ${error?.response?.body?.errors?.[0]?.message || error.message}`);
      return false;
    }
  }

  async send(params: EmailParams): Promise<boolean> {
    if (!this.mailService) return false;

    try {
      const emailData: any = {
        to: params.to,
        from: params.from,
        subject: params.subject,
        content: []
      };

      if (params.text) {
        emailData.content.push({
          type: 'text/plain',
          value: params.text
        });
      }

      if (params.html) {
        emailData.content.push({
          type: 'text/html',
          value: params.html
        });
      }

      if (params.replyTo) {
        emailData.replyTo = params.replyTo;
      }

      if (params.headers) {
        emailData.headers = params.headers;
      }

      await this.mailService.send(emailData);
      return true;
    } catch (error) {
      console.error('SendGrid send failed:', error);
      return false;
    }
  }
}

class GmailProvider implements EmailProvider {
  name = 'Gmail SMTP';
  private transporter: any = null;

  constructor() {
    // Gmail SMTP using app-specific password
    const gmailUser = process.env.GMAIL_USER || 'keegan.launch@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      });
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.transporter) return false;
    
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.log(`Gmail health check failed: ${error}`);
      return false;
    }
  }

  async send(params: EmailParams): Promise<boolean> {
    if (!this.transporter) return false;

    try {
      const mailOptions = {
        from: typeof params.from === 'string' ? params.from : `${params.from.name} <${params.from.email}>`,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        replyTo: params.replyTo ? `${params.replyTo.name} <${params.replyTo.email}>` : undefined
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Gmail send failed:', error);
      return false;
    }
  }
}

class RobustEmailSystem {
  private providers: EmailProvider[] = [];
  private currentProvider: EmailProvider | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.providers = [
      new SendGridProvider(),
      new GmailProvider()
    ];
    
    this.initializeHealthyProvider();
    this.startHealthMonitoring();
  }

  private async initializeHealthyProvider() {
    for (const provider of this.providers) {
      if (await provider.isHealthy()) {
        this.currentProvider = provider;
        console.log(`📧 Email system initialized with ${provider.name}`);
        return;
      }
    }
    
    console.log('⚠️ No healthy email providers found - emails will be logged only');
  }

  private startHealthMonitoring() {
    // Check provider health every 30 minutes
    this.healthCheckInterval = setInterval(async () => {
      if (this.currentProvider && !(await this.currentProvider.isHealthy())) {
        console.log(`❌ Current provider ${this.currentProvider.name} unhealthy, switching...`);
        await this.switchToHealthyProvider();
      }
    }, 30 * 60 * 1000);
  }

  private async switchToHealthyProvider() {
    for (const provider of this.providers) {
      if (provider !== this.currentProvider && await provider.isHealthy()) {
        this.currentProvider = provider;
        console.log(`✅ Switched to ${provider.name}`);
        return;
      }
    }
    
    console.log('❌ No healthy email providers available');
    this.currentProvider = null;
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    // If no provider available, attempt to find one
    if (!this.currentProvider) {
      await this.initializeHealthyProvider();
    }

    // If still no provider, log and return
    if (!this.currentProvider) {
      console.log('📧 Email system disabled - would have sent:', {
        to: params.to,
        subject: params.subject,
        provider: 'none available'
      });
      return false;
    }

    console.log('📧 Sending email via', this.currentProvider.name, ':', {
      to: params.to,
      subject: params.subject
    });

    const success = await this.currentProvider.send(params);
    
    if (!success) {
      console.log(`❌ Email failed via ${this.currentProvider.name}, trying failover...`);
      await this.switchToHealthyProvider();
      
      if (this.currentProvider) {
        return await this.currentProvider.send(params);
      }
    }

    return success;
  }

  async getSystemStatus() {
    const status = [];
    
    for (const provider of this.providers) {
      const healthy = await provider.isHealthy();
      status.push({
        name: provider.name,
        healthy,
        active: provider === this.currentProvider
      });
    }
    
    return {
      providers: status,
      currentProvider: this.currentProvider?.name || 'none'
    };
  }

  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// Create singleton instance
export const robustEmailSystem = new RobustEmailSystem();

// Export convenience function that matches existing interface
export async function sendEmail(params: EmailParams): Promise<boolean> {
  return robustEmailSystem.sendEmail(params);
}

export async function getEmailSystemStatus() {
  return robustEmailSystem.getSystemStatus();
}