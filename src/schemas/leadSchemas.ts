import { z } from 'zod';

// Basic lead capture form schema
export const leadCaptureBasicSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters'),
});

export type LeadCaptureBasicInput = z.infer<typeof leadCaptureBasicSchema>;

// Detailed lead capture form schema
export const leadCaptureDetailedSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  serviceInterest: z.array(z.string()).min(1, 'Please select at least one service'),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

export type LeadCaptureDetailedInput = z.infer<typeof leadCaptureDetailedSchema>;

// Activity form schema
export const activityFormSchema = z.object({
  type: z.enum(['note', 'email_sent', 'call', 'meeting']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type ActivityFormInput = z.infer<typeof activityFormSchema>;

// Admin login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
