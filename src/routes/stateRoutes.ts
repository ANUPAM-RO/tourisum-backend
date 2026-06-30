import express from 'express';
import {
  getAllStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState,
} from '../controllers/stateController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllStates);
router.get('/:slug', getStateBySlug);
router.post('/', protect, admin, createState);
router.put('/:id', protect, admin, updateState);
router.delete('/:id', protect, admin, deleteState);

export default router;
