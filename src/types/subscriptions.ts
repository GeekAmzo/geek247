export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  userId: string;
  serviceId: string;
  status: SubscriptionStatus;
  paystackSubscriptionCode: string | null;
  paystackCustomerCode: string | null;
  priceAmountCents: number;
  priceCurrency: 'ZAR' | 'USD';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  service?: {
    title: string;
    slug: string;
    billingInterval: string;
  };
}

export interface PaymentRecord {
  id: string;
  subscriptionId: string;
  userId: string;
  paystackReference: string;
  amountCents: number;
  currency: 'ZAR' | 'USD';
  status: 'success' | 'failed' | 'pending';
  paidAt: string;
  createdAt: string;
}
