import express from 'express';
import {
  getAllCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllCities);
router.get('/:slug', getCityBySlug);
router.post('/', protect, admin, createCity);
router.put('/:id', protect, admin, updateCity);
router.delete('/:id', protect, admin, deleteCity);

export default router;
