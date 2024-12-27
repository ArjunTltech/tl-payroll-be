import express from 'express';
import { addEmployeeValidator, deleteEmployeeValidator, getEmployeeByIdValidator, updateEmployeeValidator } from '../middlewares/validate/employee.validate.js';
import { addEmployee, deleteEmployee, getEmployee, listEmployees, updateEmployeeDetails } from '../controllers/employee.controller.js';
const router = express.Router();

router.post('/add', addEmployeeValidator, addEmployee);
router.get('/view', listEmployees);
router.get('/view/:id',getEmployeeByIdValidator, getEmployee);
router.put('/update/:id',updateEmployeeValidator, updateEmployeeDetails);
router.delete('/delete/:id',deleteEmployeeValidator, deleteEmployee);

// // Employee bank details routes
// router.post('/bank/add/:id', );
// router.get('/bank/view/:id', );

// // Employee leave routes
// router.post('/leaves/add/:id', );
// router.get('/leaves/view/:id', );




export default router;