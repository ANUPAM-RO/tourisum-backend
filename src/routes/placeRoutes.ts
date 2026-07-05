import express from 'express';
import {
  getAllPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
  addReview,
  getSimilarPlaces,
  getCategoryStats,
} from '../controllers/placeController';
import { protect, admin } from '../middleware/auth';
import { cacheMiddleware } from '../config/redis';
import { placeValidator, reviewValidator } from '../validators/placeValidator';

const router = express.Router();

router.get('/', cacheMiddleware, getAllPlaces);
router.get('/categories', cacheMiddleware, getCategoryStats);
router.get('/similar/:id', cacheMiddleware, getSimilarPlaces);
router.get('/:slug', cacheMiddleware, getPlaceBySlug);
router.post('/:id/reviews', protect, reviewValidator, addReview);
router.post('/', protect, admin, placeValidator, createPlace);
router.put('/:id', protect, admin, placeValidator, updatePlace);
router.delete('/:id', protect, admin, deletePlace);

export default router;
