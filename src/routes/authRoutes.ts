import express from 'express';
import { register, login, getProfile, updateProfile, toggleFavorite, getFavorites } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/favorites/toggle', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
