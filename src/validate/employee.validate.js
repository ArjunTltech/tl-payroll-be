import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';

// Validator for adding an employee
export const addEmployeeValidator = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name is required'),

  body('employee_id')
    .isString().withMessage('Employee ID must be a string')
    .notEmpty().withMessage('Employee ID is required'),

  body('dob')
    .isDate().withMessage('Date of Birth must be a valid date')
    .notEmpty().withMessage('Date of Birth is required'),

  body('department_id')
    .isInt().withMessage('Department ID must be an integer')
    .notEmpty().withMessage('Department ID is required'),

  body('designation_id')
    .isInt().withMessage('Designation ID must be an integer')
    .notEmpty().withMessage('Designation ID is required'),

  body('joining_date')
    .isDate().withMessage('Joining Date must be a valid date')
    .notEmpty().withMessage('Joining Date is required'),

  body('status')
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive')
    .notEmpty().withMessage('Status is required'),
    handleValidationErrors,
];

// Validator for updating an employee
export const updateEmployeeValidator = [
  param('id')
    .isInt().withMessage('Employee ID must be an integer'),

  body('name')
    .optional().isString().withMessage('Name must be a string'),

  body('department_id')
    .optional().isInt().withMessage('Department ID must be an integer'),

  body('designation_id')
    .optional().isInt().withMessage('Designation ID must be an integer'),

  body('status')
    .optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
    handleValidationErrors
];

// Validator for getting an employee by ID
export const getEmployeeByIdValidator = [
  param('id')
    .isInt().withMessage('Employee ID must be an integer'),
    handleValidationErrors,
];

// Validator for deleting an employee
export const deleteEmployeeValidator = [
  param('id')
    .isInt().withMessage('Employee ID must be an integer'),
    handleValidationErrors,
];
