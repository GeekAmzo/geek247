import { z } from 'zod';

const featureSchema = z.object({
  text: z.string().min(1, 'Feature text is required'),
  included: z.boolean(),
});

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const serviceFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  longDescription: z.string().optional().default(''),
  featuresIncluded: z.array(featureSchema).default([]),
  featuresNotIncluded: z.array(featureSchema).default([]),
  faqs: z.array(faqSchema).default([]),
  pricingZarMinCents: z.number().min(0, 'Price must be non-negative'),
  pricingZarMaxCents: z.number().nullable().default(null),
  pricingUsdMinCents: z.number().min(0, 'Price must be non-negative'),
  pricingUsdMaxCents: z.number().nullable().default(null),
  billingInterval: z.enum(['monthly', 'once_off', 'custom']),
  paystackPlanCodeZar: z.string().nullable().default(null),
  paystackPlanCodeUsd: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
