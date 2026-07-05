import express from 'express';
import {
  getAllRestaurants,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController';
import { protect, admin } from '../middleware/auth';
import { cacheMiddleware } from '../config/redis';

const router = express.Router();

router.get('/', cacheMiddleware, getAllRestaurants);
router.get('/:slug', cacheMiddleware, getRestaurantBySlug);
router.post('/', protect, admin, createRestaurant);
router.put('/:id', protect, admin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

export default router;
