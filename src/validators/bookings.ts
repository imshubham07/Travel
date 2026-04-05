import { z } from 'zod';

export const createBookingSchema = z.object({
  seats: z.number().int().positive('Seats must be a positive integer'),
});
