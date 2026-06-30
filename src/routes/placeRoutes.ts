import express from 'express';
import {
  getAllPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
  addReview,
  getSimilarPlaces,
} from '../controllers/placeController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPlaces);
router.get('/similar/:id', getSimilarPlaces);
router.get('/:slug', getPlaceBySlug);
router.post('/:id/reviews', protect, addReview);
router.post('/', protect, admin, createPlace);
router.put('/:id', protect, admin, updatePlace);
router.delete('/:id', protect, admin, deletePlace);

export default router;
