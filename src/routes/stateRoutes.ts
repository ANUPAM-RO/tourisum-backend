import express from 'express';
import {
  getAllStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState,
} from '../controllers/stateController';
import { protect, admin } from '../middleware/auth';
import { cacheMiddleware } from '../config/redis';

const router = express.Router();

router.get('/', cacheMiddleware, getAllStates);
router.get('/:slug', cacheMiddleware, getStateBySlug);
router.post('/', protect, admin, createState);
router.put('/:id', protect, admin, updateState);
router.delete('/:id', protect, admin, deleteState);

export default router;
