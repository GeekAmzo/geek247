import { z } from 'zod';

export const userSignupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type UserSignupInput = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
