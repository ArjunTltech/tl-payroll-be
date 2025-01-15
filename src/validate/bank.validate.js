import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';

export const validateAddBankDetails = [
    body('bank_name')
        .notEmpty().withMessage('Bank name is required')
        .isLength({ max: 100 }).withMessage('Bank name must be less than 100 characters'),
    body('account_number')
        .notEmpty().withMessage('Account number is required')
        .isNumeric().withMessage('Account number must be numeric')
        .isLength({ min: 10, max: 20 }).withMessage('Account number must be between 10 and 20 digits'),
    body('ifsc_code')
        .notEmpty().withMessage('IFSC code is required')
        .isLength({ min: 11, max: 11 }).withMessage('IFSC code must be exactly 11 characters long'),
    body('account_type')
        .notEmpty().withMessage('Account type is required')
        .isIn(['Savings', 'Current']).withMessage('Account type must be either "Savings" or "Current"'),
    handleValidationErrors,  // Middleware to handle validation errors
];

export const validateUpdateBankDetails = [
    body('bank_name')
        .optional()
        .isLength({ max: 100 }).withMessage('Bank name must be less than 100 characters'),
    body('account_number')
        .optional()
        .isNumeric().withMessage('Account number must be numeric')
        .isLength({ min: 10, max: 20 }).withMessage('Account number must be between 10 and 20 digits'),
    body('ifsc_code')
        .optional()
        .isLength({ min: 11, max: 11 }).withMessage('IFSC code must be exactly 11 characters long'),
    body('account_type')
        .optional()
        .isIn(['Savings', 'Current']).withMessage('Account type must be either "Savings" or "Current"'),
    handleValidationErrors, 
];