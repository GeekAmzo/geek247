declare global {
  interface Window {
    PaystackPop: {
      setup(options: PaystackOptions): { openIframe(): void };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in kobo/cents
  currency: 'ZAR' | 'USD';
  plan?: string; // plan code for subscriptions
  ref?: string;
  metadata?: Record<string, any>;
  onClose: () => void;
  callback: (response: PaystackResponse) => void;
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export const paystackService = {
  isConfigured(): boolean {
    return !!PAYSTACK_PUBLIC_KEY && typeof window.PaystackPop !== 'undefined';
  },

  initializePayment(options: {
    email: string;
    amountCents: number;
    currency: 'ZAR' | 'USD';
    planCode?: string;
    reference?: string;
    metadata?: Record<string, any>;
    onSuccess: (response: PaystackResponse) => void;
    onClose: () => void;
  }): void {
    if (!this.isConfigured()) {
      console.error('Paystack is not configured. Check VITE_PAYSTACK_PUBLIC_KEY and script tag.');
      options.onClose();
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: options.email,
      amount: options.amountCents,
      currency: options.currency,
      plan: options.planCode,
      ref: options.reference || `ref-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      metadata: options.metadata,
      callback: options.onSuccess,
      onClose: options.onClose,
    });

    handler.openIframe();
  },
};
