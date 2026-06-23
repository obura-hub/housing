// app/lib/mpesa/index.ts

export interface STKPushRequest {
  phone: string;
  amount: number;
  accountReference?: string;
  transactionDesc?: string;
}

export interface STKPushResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private passkey: string;
  private shortcode: string;
  private environment: string;
  private callbackUrl: string;

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
    this.passkey = process.env.MPESA_PASSKEY || '';
    this.shortcode = process.env.MPESA_SHORTCODE || '';
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.callbackUrl = process.env.MPESA_CALLBACK_URL || '';

    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('M-Pesa credentials not configured in environment variables');
    }

    if (!this.callbackUrl) {
      console.warn('⚠️ MPESA_CALLBACK_URL not set in environment variables');
    }
  }

  private getBaseUrl(): string {
    return this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  }

  async getAccessToken(): Promise<string> {
    const url = `${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
    
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('No access token in response');
      }

      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async sendSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();

      // Format phone number (remove 0 or +254)
      let phone = request.phone.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = '254' + phone.slice(1);
      } else if (phone.startsWith('+')) {
        phone = phone.slice(1);
      }

      // Generate timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, 14);

      // Generate password
      const password = Buffer.from(
        `${this.shortcode}${this.passkey}${timestamp}`
      ).toString('base64');

      // Prepare payload
      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount),
        PartyA: phone,
        PartyB: this.shortcode,
        PhoneNumber: phone,
        CallBackURL: this.callbackUrl,
        AccountReference: request.accountReference || 'NAIROBI CITY COUNTY',
        TransactionDesc: request.transactionDesc || 'Payment for Reservation',
      };

      // Send request to Safaricom
      const response = await fetch(
        `${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // Check response
      if (data.ResponseCode === '0') {
        return {
          success: true,
          message: 'STK Push sent successfully',
          data: data,
        };
      } else {
        // Log error for debugging
        console.error('STK Push failed:', data);
        return {
          success: false,
          message: data.errorMessage || 'STK push failed',
          data: data,
        };
      }
    } catch (error: any) {
      console.error('STK Push error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send STK push',
      };
    }
  }
}

export const mpesaService = new MpesaService();