import express from 'express';
import {
  getAllHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllHotels);
router.get('/:slug', getHotelBySlug);
router.post('/', protect, admin, createHotel);
router.put('/:id', protect, admin, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

export default router;
