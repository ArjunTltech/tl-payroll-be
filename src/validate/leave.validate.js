import { body, param, } from 'express-validator';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';

// Validation for creating leave summary
export const validateCreateLeaveSummary = [
    param('employeeId')
    .isInt()
    .withMessage('Employee ID must be a valid integer'),
    body('annual_leave_entitlement')
        .isInt({ min: 1 })
        .withMessage('Annual leave entitlement must be a positive integer')
        .optional({ checkFalsy: true }),
    handleValidationErrors,
];

// Validation for updating leave summary
export const validateUpdateLeaveSummary = [
    body('annual_leave_entitlement')
        .isInt({ min: 1 })
        .withMessage('Annual leave entitlement must be a positive integer')
        .optional({ checkFalsy: true }),
    body('casual_leave_taken')
        .isInt({ min: 0 })
        .withMessage('Casual leave taken must be a non-negative integer')
        .optional({ checkFalsy: true }),
    handleValidationErrors,
];