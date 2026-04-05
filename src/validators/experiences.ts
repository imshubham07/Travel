import { z } from 'zod';

export const createExperienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  startTime: z.string().datetime('Invalid datetime format'),
});

export const queryExperiencesSchema = z.object({
  location: z.string().optional(),
  from: z.string().datetime('Invalid from datetime').optional(),
  to: z.string().datetime('Invalid to datetime').optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort: z.enum(['asc', 'desc']).default('asc'),
});
