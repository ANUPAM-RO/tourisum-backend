import { body } from 'express-validator';
import { validateRequest } from './authValidator';

export const tourValidator = [
  body('title').trim().notEmpty().withMessage('Tour title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('durationDays').isInt({ min: 1 }).withMessage('Duration (days) must be at least 1'),
  body('durationNights').isInt({ min: 0 }).withMessage('Duration (nights) must be 0 or more'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional({ values: 'null' }).isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('difficulty').optional().isIn(['Easy', 'Moderate', 'Challenging']).withMessage('Invalid difficulty'),
  body('places').optional().isArray().withMessage('Places must be a list'),
  body('places.*').optional().isMongoId().withMessage('Invalid place'),
  body('departures').optional().isArray().withMessage('Departures must be a list'),
  body('departures.*.startDate').isISO8601().withMessage('Each departure needs a valid date'),
  body('departures.*.seatsTotal').isInt({ min: 1 }).withMessage('Each departure needs at least 1 seat'),
  body('itinerary').optional().isArray().withMessage('Itinerary must be a list'),
  body('itinerary.*.title').trim().notEmpty().withMessage('Every itinerary day needs a title'),
  validateRequest,
];

export const bookingValidator = [
  body('tourId').isMongoId().withMessage('Invalid tour'),
  body('departureId').isMongoId().withMessage('Please choose a departure date'),
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Please enter your name'),
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
  body('phone').trim().matches(/^[+\d][\d\s-]{7,15}$/).withMessage('Please enter a valid phone number'),
  body('adults').isInt({ min: 1, max: 20 }).withMessage('Adults must be between 1 and 20'),
  body('children').optional().isInt({ min: 0, max: 20 }).withMessage('Children must be between 0 and 20'),
  body('message').optional().isLength({ max: 1000 }).withMessage('Message is too long'),
  validateRequest,
];

export const bookingUpdateValidator = [
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status'),
  body('adminNote').optional().isString().isLength({ max: 1000 }),
  validateRequest,
];
