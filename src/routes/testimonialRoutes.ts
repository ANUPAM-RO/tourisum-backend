import express from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { protect, admin } from '../middleware/auth';
import { validateRequest } from '../validators/authValidator';

const router = express.Router();

const testimonialValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('text').trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be 10–1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1 to 5'),
  body('photo').optional({ values: 'falsy' }).isURL().withMessage('Photo must be a valid URL'),
  body('order').optional().isInt().withMessage('Order must be a number'),
  validateRequest,
];

router.get('/', getTestimonials);
router.get('/admin/all', protect, admin, getAllTestimonialsAdmin);
router.post('/', protect, admin, testimonialValidator, createTestimonial);
router.put('/:id', protect, admin, testimonialValidator, updateTestimonial);
router.delete('/:id', protect, admin, deleteTestimonial);

export default router;
