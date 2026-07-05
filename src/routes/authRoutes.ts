import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getProfile, updateProfile, toggleFavorite, getFavorites } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/authValidator';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, updateProfile);
router.post('/favorites/toggle', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
