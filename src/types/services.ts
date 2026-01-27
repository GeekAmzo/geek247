export type BillingInterval = 'monthly' | 'once_off' | 'custom';

export interface ServiceFeature {
  text: string;
  included: boolean;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  featuresIncluded: ServiceFeature[];
  featuresNotIncluded: ServiceFeature[];
  faqs: ServiceFaq[];
  pricingZarMinCents: number;
  pricingZarMaxCents: number | null;
  pricingUsdMinCents: number;
  pricingUsdMaxCents: number | null;
  billingInterval: BillingInterval;
  paystackPlanCodeZar: string | null;
  paystackPlanCodeUsd: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceInsert = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type ServiceUpdate = Partial<ServiceInsert>;
