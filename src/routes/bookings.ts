import { Router, Request, Response } from 'express';
import * as bookingsService from '../services/bookingsService.js';
import * as experiencesService from '../services/experiencesService.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validation.js';
import { createBookingSchema } from '../validators/bookings.js';

const router = Router();

router.post(
  '/:id/book',
  requireAuth,
  requireRole('user', 'admin'),
  validateRequest(createBookingSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { seats } = req.body;
      const userId = req.user!.userId;

      const experience = await experiencesService.getExperienceById(Number(id));
      if (!experience) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Experience not found' },
        });
      }

      if (experience.status !== 'published') {
        return res.status(400).json({
          error: { code: 'INVALID_STATUS', message: 'Experience is not available for booking' },
        });
      }

      if (experience.createdBy === userId) {
        return res.status(400).json({
          error: { code: 'CANNOT_BOOK_OWN', message: 'Cannot book your own experience' },
        });
      }

      const existingBooking = await bookingsService.getExistingBooking(Number(id), userId);
      if (existingBooking) {
        return res.status(409).json({
          error: { code: 'DUPLICATE_BOOKING', message: 'Already booked this experience' },
        });
      }

      const booking = await bookingsService.createBooking(Number(id), userId, seats);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({
        error: { code: 'BOOKING_ERROR', message: 'Failed to create booking' },
      });
    }
  }
);

export default router;
