import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);

export default router;
