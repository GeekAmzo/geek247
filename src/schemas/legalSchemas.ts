import { z } from 'zod';

export const legalDocumentFormSchema = z.object({
  type: z.enum(['tos', 'sla']),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  version: z.string().min(1, 'Version is required'),
  serviceId: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
});

export type LegalDocumentFormInput = z.infer<typeof legalDocumentFormSchema>;
