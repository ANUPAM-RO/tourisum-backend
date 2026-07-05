import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err: any) => ({
        field: err.path,
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Provide a valid phone number'),
  validateRequest,
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

export const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Provide a valid phone number'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest,
];
