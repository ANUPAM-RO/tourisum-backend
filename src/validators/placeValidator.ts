import { body } from 'express-validator';
import { validateRequest } from './authValidator';

export const placeValidator = [
  body('name').trim().notEmpty().withMessage('Place name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('state').isMongoId().withMessage('State must be a valid MongoDB ObjectId'),
  body('city').isMongoId().withMessage('City must be a valid MongoDB ObjectId'),
  body('location.latitude').isNumeric().withMessage('Latitude must be a valid number'),
  body('location.longitude').isNumeric().withMessage('Longitude must be a valid number'),
  body('category').isArray({ min: 1 }).withMessage('At least one category is required'),
  body('category.*').isIn(['Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip']).withMessage('Invalid category specified'),
  validateRequest,
];

export const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
  body('photos').optional().isArray().withMessage('Photos must be an array of image URLs'),
  validateRequest,
];
