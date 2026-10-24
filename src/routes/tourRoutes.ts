import express from 'express';
import { getTours, getTourBySlug, getAllToursAdmin, createTour, updateTour, deleteTour } from '../controllers/tourController';
import { protect, admin } from '../middleware/auth';
import { tourValidator } from '../validators/tourValidator';

const router = express.Router();

// Not cached: seat availability changes with every booking.
router.get('/', getTours);
router.get('/admin/all', protect, admin, getAllToursAdmin);
router.get('/:slug', getTourBySlug);
router.post('/', protect, admin, tourValidator, createTour);
router.put('/:id', protect, admin, tourValidator, updateTour);
router.delete('/:id', protect, admin, deleteTour);

export default router;
