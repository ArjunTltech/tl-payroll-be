import { sql, getPool } from "../config/db.js";

// Create Payroll Record
export const createPayrollRecord = async (payrollData) => {
    try {
        const pool = await getPool();

        const {
            employee_id,
            pay_period_start, // updated field name
            pay_period_end,   // updated field name
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
        } = payrollData;

        const result = await pool.request()
            .input('employee_id', sql.Int, employee_id)
            .input('pay_period_start', sql.Date, pay_period_start) // use SQL Date
            .input('pay_period_end', sql.Date, pay_period_end)     // use SQL Date
            .input('pay_date', sql.Date, pay_date)
            .input('salary_mode', sql.NVarChar, salary_mode)
            .input('salary_credit_method', sql.NVarChar, salary_credit_method)
            .input('working_days', sql.Int, working_days)
            .input('lop_days', sql.Int, lop_days)
            .input('basic_salary', sql.Float, basic_salary)
            .input('hra', sql.Float, hra)
            .input('other_allowances', sql.Float, other_allowances)
            .input('income_tax', sql.Float, income_tax)
            .input('provident_fund', sql.Float, provident_fund)
            .input('created_by', sql.Int, created_by)
            .query(`
                INSERT INTO Payroll (
                    employee_id, pay_period_start, pay_period_end, pay_date, salary_mode, salary_credit_method, 
                    working_days, lop_days, basic_salary, hra, other_allowances, 
                    income_tax, provident_fund, created_by
                ) VALUES (
                    @employee_id, @pay_period_start, @pay_period_end, @pay_date, @salary_mode, @salary_credit_method, 
                    @working_days, @lop_days, @basic_salary, @hra, @other_allowances, 
                    @income_tax, @provident_fund, @created_by
                )
            `);

        return result;
    } catch (error) {
        console.error('Error adding payroll:', error);
        throw new Error('Error adding payroll record');
    }
};

// Get all payroll records
export const getAllPayrollRecords = async () => {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Payroll WHERE deleted_on IS NULL');
        return result.recordset;
    } catch (error) {
        console.error('Error fetching payroll records:', error);
        throw new Error('Error fetching payroll records');
    }
};

// Get payroll details by employee id
export const getPayrollDetailsByEmployeeId = async (employeeId) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .query('SELECT * FROM Payroll WHERE employee_id = @employee_id AND deleted_on IS NULL');
        return result.recordset;
    } catch (error) {
        console.error('Error fetching payroll by employee:', error);
        throw new Error('Error fetching payroll details');
    }
};

// Update payroll record
export const updatePayrollRecord = async (id, payrollData) => {
    try {
        const pool = await getPool();
        const {
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
            updated_by
        } = payrollData;

        const result = await pool.request()
    .input('id', sql.Int, id)
    .input('pay_period_start', sql.Date, pay_period_start)
    .input('pay_period_end', sql.Date, pay_period_end)
    .input('pay_date', sql.Date, pay_date)
    .input('salary_mode', sql.NVarChar, salary_mode)
    .input('salary_credit_method', sql.NVarChar, salary_credit_method)
    .input('working_days', sql.Int, working_days)
    .input('lop_days', sql.Int, lop_days)
    .input('basic_salary', sql.Float, basic_salary)
    .input('hra', sql.Float, hra)
    .input('other_allowances', sql.Float, other_allowances)
    .input('income_tax', sql.Float, income_tax)
    .input('provident_fund', sql.Float, provident_fund)
    .query(`
        UPDATE Payroll SET 
            pay_period_start = @pay_period_start, 
            pay_period_end = @pay_period_end, 
            pay_date = @pay_date, 
            salary_mode = @salary_mode,
            salary_credit_method = @salary_credit_method,
            working_days = @working_days, 
            lop_days = @lop_days, 
            basic_salary = @basic_salary, 
            hra = @hra, 
            other_allowances = @other_allowances, 
            income_tax = @income_tax, 
            provident_fund = @provident_fund
        WHERE id = @id
    `);
        return result;
    } catch (error) {
        console.error('Error updating payroll record:', error);
        throw new Error('Error updating payroll record');
    }
};

// Delete payroll record
export const deletePayrollRecord = async (id) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Payroll WHERE id = @id');
        return result;
    } catch (error) {
        console.error('Error deleting payroll record:', error);
        throw new Error('Error deleting payroll record');
    }
};


export const checkPayrollOverlap = async (employeeId, startDate, endDate) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .input('pay_period_start', sql.Date, startDate)
            .input('pay_period_end', sql.Date, endDate)
            .query(`
                SELECT * FROM Payroll
                WHERE employee_id = @employee_id
                  AND deleted_on IS NULL
                  AND (
                      (pay_period_start <= @pay_period_end AND pay_period_end >= @pay_period_start)
                  )
            `); // Checks for overlapping periods
        return result.recordset;
    } catch (error) {
        console.error('Error checking payroll overlap:', error);
        throw new Error('Error checking payroll overlap');
    }
};
