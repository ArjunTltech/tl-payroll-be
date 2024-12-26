import { body } from 'express-validator';

export const validateRegistration = [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    body('email')
      .isEmail().withMessage('Valid email is required')
      .isLength({ max: 100 }).withMessage('Email must be less than 100 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .notEmpty().withMessage('Confirm Password is required')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Password confirmation does not match password')
  ];

export const validateLogin = [
    body('email')
      .isEmail().withMessage('Valid email is required'),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ];