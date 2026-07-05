import express from 'express';
import {
  getAllHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { protect, admin } from '../middleware/auth';
import { cacheMiddleware } from '../config/redis';

const router = express.Router();

router.get('/', cacheMiddleware, getAllHotels);
router.get('/:slug', cacheMiddleware, getHotelBySlug);
router.post('/', protect, admin, createHotel);
router.put('/:id', protect, admin, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

export default router;
