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




//payslip



export const getPayslipData = async (employeeId) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('employeeId', sql.Int, employeeId)
      .query(`
        SELECT 
          -- Employee Details
          e.name,
          e.employee_id,
          e.dob,
          d.name as department,
          des.name as designation,
          e.status,
          e.joining_date,
          e.tenure,
          e.last_working_day,
          
          -- Bank Details
          b.bank_name,
          b.account_number,
          b.ifsc_code,
          b.account_type,
          
          -- Payroll Details
          p.pay_period_start,
          p.pay_period_end,
          p.pay_date,
          p.salary_mode,
          p.salary_credit_method as salary_credit,
          p.working_days,
          p.lop_days,
          p.paid_days,
          p.basic_salary as basic,
          p.hra,
          p.other_allowances,
          p.income_tax,
          p.provident_fund,
          p.total_deductions,
          p.gross_earnings,
          p.net_pay,
          
          -- Leave Summary
          ls.annual_leave_entitlement as annual_days,
          ls.casual_leave_taken as casual_leave
          
        FROM Employees e
        LEFT JOIN Departments d ON e.department_id = d.id
        LEFT JOIN Designations des ON e.designation_id = des.id
        LEFT JOIN BankDetails b ON e.id = b.employee_id
        LEFT JOIN Payroll p ON e.id = p.employee_id
        LEFT JOIN LeaveSummary ls ON e.id = ls.employee_id
        WHERE e.id = @employeeId
        AND e.deleted_on IS NULL
        AND p.deleted_on IS NULL
        AND p.approval_status = 'Approved'
        ORDER BY p.pay_period_end DESC
        OFFSET 0 ROWS
        FETCH NEXT 1 ROW ONLY;
      `);

    if (!result.recordset[0]) {
      throw new Error('No payslip data found');
    }

    return formatPayslipData(result.recordset[0]);
  }
  catch (error) {
    console.error('Error getting payslip data:', error);
    throw new Error('Error getting payslip data');
  }
};



const formatPayslipData = (data) => {
    // Format dates
    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    // Format currency
    const formatCurrency = (amount) => {
      return parseFloat(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
      }).replace('₹', '');
    };
  
    // Number to words conversion for net pay
    const numberToWords = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount).replace('₹', '') + ' Only';
    };
  
    // Calculate pay period string
    const payPeriod = `${formatDate(data.pay_period_start)} - ${formatDate(data.pay_period_end)}`;
  
    return {
      // Employee Details
      name: data.name,
      id: data.employee_id,
      dob: formatDate(data.dob),
      department: data.department,
      designation: data.designation,
      status: data.status,
      joiningDate: formatDate(data.joining_date),
      tenure: `${data.tenure} months`,
      lastWorkingDay: formatDate(data.last_working_day),
  
      // Working Summary
      workingDays: data.working_days,
      lopDays: data.lop_days,
      paidDays: data.paid_days,
      annualDays: data.annual_days,
      casualLeave: data.casual_leave,
  
      // Pay Period Details
      payPeriod: payPeriod,
      payDate: formatDate(data.pay_date),
      salaryMode: data.salary_mode,
      salaryCredit: data.salary_credit,
  
      // Bank Details
      bankName: data.bank_name,
      accountNumber: data.account_number,
      ifscCode: data.ifsc_code,
      accountType: data.account_type,
  
      // Earnings
      basic: formatCurrency(data.basic),
      hra: formatCurrency(data.hra),
      otherAllowance: formatCurrency(data.other_allowances),
      grossEarnings: formatCurrency(data.gross_earnings),
  
      // Deductions
      incomeTax: formatCurrency(data.income_tax),
      providentFund: formatCurrency(data.provident_fund),
      totalDeductions: formatCurrency(data.total_deductions),
  
      // Net Pay
      netPay: formatCurrency(data.net_pay),
      netPayWords: numberToWords(data.net_pay)
    };
  };