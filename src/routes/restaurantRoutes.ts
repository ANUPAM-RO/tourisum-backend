import express from 'express';
import {
  getAllRestaurants,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:slug', getRestaurantBySlug);
router.post('/', protect, admin, createRestaurant);
router.put('/:id', protect, admin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

export default router;
