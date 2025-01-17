
import express from 'express';
import { createPayroll, deletePayroll, getAllPayrolls, getPayrollByEmployee, updatePayroll } from '../controllers/payroll.controller.js';

const router = express.Router();

router.post('/add',createPayroll );
router.get('/view', getAllPayrolls);
router.get('/view/:employeeId', getPayrollByEmployee);
router.put('/update/:id',updatePayroll);
router.delete('/delete/:id',deletePayroll)


export default router;