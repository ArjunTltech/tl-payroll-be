import { createPayrollRecord, getAllPayrollRecords, getPayrollDetailsByEmployeeId, updatePayrollRecord, deletePayrollRecord, checkPayrollOverlap } from '../models/payroll.model.js';

// Create new payroll record
export const createPayroll = async (req, res) => {
    const {
        employee_id,
        pay_period_start,  // updated field name
        pay_period_end,    // updated field name
        pay_date,
        salary_mode,
        salary_credit_method,
        working_days,
        lop_days,
        basic_salary,
        hra,
        other_allowances,
        income_tax,
        provident_fund,
        created_by
    } = req.body;

    try {

        const existingPayroll = await checkPayrollOverlap(employee_id, pay_period_start, pay_period_end);
        if (existingPayroll.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Payroll already exists for this employee within the specified period'
            });
        }

        const result = await createPayrollRecord({
            employee_id,
            pay_period_start,  
            pay_period_end,    
            pay_date,
            salary_mode,
            salary_credit_method,
            working_days,
            lop_days,
            basic_salary,
            hra,
            other_allowances,
            income_tax,
            provident_fund,
            created_by
        });

        res.status(201).json({
            success: true,
            message: 'Payroll record created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error creating payroll:', error);
        res.status(500).json({ message: 'Error creating payroll record' });
    }
};

// Get all payroll records
export const getAllPayrolls = async (req, res) => {
    try {
        const result = await getAllPayrollRecords();
        res.status(200).json({
            success: true,
            message: 'Payroll records fetched successfully',
            data: result
        });
    } catch (error) {
        console.error('Error fetching payroll records:', error);
        res.status(500).json({ message: 'Error fetching payroll records' });
    }
};

// Get payroll details by employee id
export const getPayrollByEmployee = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const result = await getPayrollDetailsByEmployeeId(employeeId);
        
        if (!result.length) {
            return res.status(404).json({ message: 'Payroll not found for this employee' });
        }

        res.status(200).json({
            success: true,
            message: 'Payroll details fetched successfully',
            data: result
        });
    } catch (error) {
        console.error('Error fetching payroll by employee:', error);
        res.status(500).json({ message: 'Error fetching payroll details' });
    }
};

// Update payroll record
export const updatePayroll = async (req, res) => {
    const { id } = req.params;
    const {
        pay_period_start,  // updated field name
        pay_period_end,    // updated field name
        pay_date,
        salary_mode,
        salary_credit_method,
        working_days,
        lop_days,
        basic_salary,
        hra,
        other_allowances,
        income_tax,
        provident_fund,
        updated_by
    } = req.body;

    try {
        const result = await updatePayrollRecord(id, {
            pay_period_start,  // pass the new field
            pay_period_end,    // pass the new field
            pay_date,
            salary_mode,
            salary_credit_method,
            working_days,
            lop_days,
            basic_salary,
            hra,
            other_allowances,
            income_tax,
            provident_fund,
            updated_by
        });

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Payroll updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Error updating payroll:', error);
        res.status(500).json({ message: 'Error updating payroll record' });
    }
};

export const deletePayroll = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deletePayrollRecord(id);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Payroll record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting payroll:', error);
        res.status(500).json({ message: 'Error deleting payroll record' });
    }
};
