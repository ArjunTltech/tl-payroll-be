import express from 'express';
import { addEmployeeValidator, deleteEmployeeValidator, getEmployeeByIdValidator, updateEmployeeValidator } from '../validate/employee.validate.js';
import { addEmployee, deleteEmployee, getEmployee, listEmployees, updateEmployeeDetails } from '../controllers/employee.controller.js';
import { addBankDetailsController, deleteBankDetailsController, getBankDetailsController, updateBankDetailsController } from '../controllers/bank.controller.js';
import { validateAddBankDetails, validateUpdateBankDetails } from '../validate/bank.validate.js';
import { createLeaveSummary, deleteLeaveSummary, getAllLeaveSummaries, getLeaveSummaryByEmployee, updatedLeaveSummary } from '../controllers/leaveSummary.controller.js';
import { validateCreateLeaveSummary, validateUpdateLeaveSummary } from '../validate/leave.validate.js';
const router = express.Router();

router.post('/add', addEmployeeValidator, addEmployee);
router.get('/view', listEmployees);
router.get('/view/:id',getEmployeeByIdValidator, getEmployee);
router.put('/update/:id',updateEmployeeValidator, updateEmployeeDetails);
router.delete('/delete/:id',deleteEmployeeValidator, deleteEmployee);

// // Employee bank details routes
router.post('/bank/add/:employeeId',validateAddBankDetails, addBankDetailsController );
router.get('/bank/view/:employeeId', getBankDetailsController);
router.put('/bank/update/:employeeId', validateUpdateBankDetails, updateBankDetailsController);
router.delete('/bank/delete/:employeeId', deleteBankDetailsController);

// Employee leave routes
router.post('/leaves/add/:employeeId',validateCreateLeaveSummary, createLeaveSummary);
router.get('/leaves/view/:employeeId', getLeaveSummaryByEmployee);
router.put('/leaves/update/:employeeId', validateUpdateLeaveSummary,updatedLeaveSummary);
router.delete('/leaves/delete/:employeeId', deleteLeaveSummary);
router.get('/leaves/view', getAllLeaveSummaries);





export default router;