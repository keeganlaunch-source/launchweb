import https from 'https';
import { URL } from 'url';

interface PaystackConfig {
  secretKey: string;
  publicKey: string;
}

interface PaystackPayment {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  currency: string;
  reference: string;
  callback_url?: string;
  metadata?: any;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

export class PaystackService {
  private config: PaystackConfig;

  constructor(config: PaystackConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<PaystackResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, 'https://api.paystack.co');
      
      console.log('Paystack API call:', {
        endpoint,
        method,
        data,
        secretKey: this.config.secretKey ? 'Present' : 'Missing',
        actualKey: this.config.secretKey?.substring(0, 10) + '...'
      });
      
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            if (!parsedData.status && parsedData.message) {
              reject(new Error(parsedData.message));
            } else {
              resolve(parsedData);
            }
          } catch (error) {
            console.error('Paystack response parsing error:', responseData);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async initializePayment(payment: PaystackPayment): Promise<PaystackResponse> {
    return this.makeRequest('/transaction/initialize', 'POST', payment);
  }

  async verifyPayment(reference: string): Promise<PaystackResponse> {
    return this.makeRequest(`/transaction/verify/${reference}`);
  }

  generateReference(): string {
    return `PDF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  convertUsdToZar(amountUsd: number): number {
    // Approximate conversion rate (should be updated with real-time rates)
    const usdToZarRate = 18.5;
    // Convert USD to ZAR 
    const zarAmount = amountUsd * usdToZarRate; // $10 → R185
    
    // Paystack expects amounts in kobo (cents) for API
    // Customer should see R185, but API needs 18500 kobo
    const koboAmount = zarAmount * 100;
    
    console.log(`Payment setup: $${amountUsd} → R${zarAmount} (customer sees) → ${koboAmount} kobo (API)`);
    
    return Math.round(koboAmount);
  }

  getDisplayAmount(amountUsd: number): number {
    const usdToZarRate = 18.5;
    return Math.round(amountUsd * usdToZarRate); // Returns R185 for display
  }
}

// Initialize Paystack service - lazy loading to ensure env vars are available
let paystackInstance: PaystackService | null = null;

export const paystack = {
  get instance() {
    if (!paystackInstance) {
      paystackInstance = new PaystackService({
        secretKey: process.env.PAYSTACK_SECRET_KEY_LIVE || process.env.PAYSTACK_SECRET_KEY || '',
        publicKey: process.env.PAYSTACK_PUBLIC_KEY_LIVE || process.env.PAYSTACK_PUBLIC_KEY || '',
      });
    }
    return paystackInstance;
  },
  
  initializePayment: (payment: PaystackPayment) => paystack.instance.initializePayment(payment),
  verifyPayment: (reference: string) => paystack.instance.verifyPayment(reference),
  generateReference: () => paystack.instance.generateReference(),
  convertUsdToZar: (amount: number) => paystack.instance.convertUsdToZar(amount),
  getDisplayAmount: (amount: number) => paystack.instance.getDisplayAmount(amount),
};