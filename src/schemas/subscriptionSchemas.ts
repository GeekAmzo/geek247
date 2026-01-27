import { z } from 'zod';

export const checkoutSchema = z.object({
  agreeTos: z.boolean().refine((val) => val, 'You must agree to the Terms of Service'),
  agreeSla: z.boolean().refine((val) => val, 'You must agree to the Service Level Agreement'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
