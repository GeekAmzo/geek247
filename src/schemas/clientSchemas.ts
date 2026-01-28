import { z } from 'zod';

export const clientFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  status: z.enum(['active', 'inactive', 'churned', 'prospect']),
  notes: z.string().optional(),
});

export type ClientFormInput = z.infer<typeof clientFormSchema>;
