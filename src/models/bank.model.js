
import { sql, getPool } from "../config/db.js";
export const addBankDetails = async (employeeId, bankDetails) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .input('bank_name', sql.NVarChar, bankDetails.bank_name)
            .input('account_number', sql.NVarChar, bankDetails.account_number)
            .input('ifsc_code', sql.NVarChar, bankDetails.ifsc_code)
            .input('account_type', sql.NVarChar, bankDetails.account_type)
            .query(`
                INSERT INTO BankDetails (employee_id, bank_name, account_number, ifsc_code, account_type)
                VALUES (@employee_id, @bank_name, @account_number, @ifsc_code, @account_type)
            `);
        return result;
    } catch (error) {
        console.error('Error adding bank details:', error);
        throw new Error('Error adding bank details');
    }
};

// Get Bank Details for an Employee
export const getBankDetails = async (employeeId) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .query(`
                SELECT * FROM BankDetails WHERE employee_id = @employee_id
            `);
        return result.recordset;
    } catch (error) {
        console.error('Error fetching bank details:', error);
        throw new Error('Error fetching bank details');
    }
};

// Update Bank Details for an Employee
export const updateBankDetails = async (employeeId, bankDetails) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .input('bank_name', sql.NVarChar, bankDetails.bank_name)
            .input('account_number', sql.NVarChar, bankDetails.account_number)
            .input('ifsc_code', sql.NVarChar, bankDetails.ifsc_code)
            .input('account_type', sql.NVarChar, bankDetails.account_type)
            .query(`
                UPDATE BankDetails
                SET bank_name = @bank_name, account_number = @account_number, ifsc_code = @ifsc_code, account_type = @account_type
                WHERE employee_id = @employee_id
            `);
        return result;
    } catch (error) {
        console.error('Error updating bank details:', error);
        throw new Error('Error updating bank details');
    }
};

// Delete Bank Details for an Employee
export const deleteBankDetails = async (employeeId) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employeeId)
            .query(`
                DELETE FROM BankDetails WHERE employee_id = @employee_id
            `);
        return result;
    } catch (error) {
        console.error('Error deleting bank details:', error);
        throw new Error('Error deleting bank details');
    }
};