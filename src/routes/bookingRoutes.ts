import express from 'express';
import rateLimit from 'express-rate-limit';
import { createBooking, getMyBookings, getBookings, updateBooking, deleteBooking } from '../controllers/bookingController';
import { protect, admin, optionalAuth } from '../middleware/auth';
import { bookingValidator, bookingUpdateValidator } from '../validators/tourValidator';

const router = express.Router();

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many booking attempts. Please try again in a few minutes.' },
});

router.post('/', bookingLimiter, optionalAuth, bookingValidator, createBooking);
router.get('/mine', protect, getMyBookings);
router.get('/', protect, admin, getBookings);
router.put('/:id', protect, admin, bookingUpdateValidator, updateBooking);
router.delete('/:id', protect, admin, deleteBooking);

export default router;
