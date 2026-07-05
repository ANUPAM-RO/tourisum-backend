import express from 'express';
import {
  getAllCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController';
import { protect, admin } from '../middleware/auth';
import { cacheMiddleware } from '../config/redis';

const router = express.Router();

router.get('/', cacheMiddleware, getAllCities);
router.get('/:slug', cacheMiddleware, getCityBySlug);
router.post('/', protect, admin, createCity);
router.put('/:id', protect, admin, updateCity);
router.delete('/:id', protect, admin, deleteCity);

export default router;
