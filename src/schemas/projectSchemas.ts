import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budgetCents: z.number().optional(),
  budgetCurrency: z.string().optional(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;

export const milestoneFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'missed']),
  targetDate: z.string().optional(),
});

export type MilestoneFormInput = z.infer<typeof milestoneFormSchema>;

export const goalFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['not_started', 'on_track', 'at_risk', 'achieved', 'missed']),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().optional(),
});

export type GoalFormInput = z.infer<typeof goalFormSchema>;

export const deliverableFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'in_review', 'approved', 'rejected']),
  milestoneId: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  dueDate: z.string().optional(),
});

export type DeliverableFormInput = z.infer<typeof deliverableFormSchema>;

export const communicationFormSchema = z.object({
  type: z.enum(['email', 'call', 'note', 'message', 'meeting']),
  direction: z.enum(['inbound', 'outbound', 'internal']),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

export type CommunicationFormInput = z.infer<typeof communicationFormSchema>;

export const taskCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required'),
});

export type TaskCommentInput = z.infer<typeof taskCommentSchema>;
