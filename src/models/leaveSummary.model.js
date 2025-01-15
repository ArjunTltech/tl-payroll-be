import { sql, getPool } from '../config/db.js';

// Function to create leave summary for an employee
export const createLeave = async (employee_id, annual_leave_entitlement) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employee_id)
            .input('annual_leave_entitlement', sql.Int, annual_leave_entitlement)
            .query(`
                INSERT INTO LeaveSummary (employee_id, annual_leave_entitlement)
                VALUES (@employee_id, @annual_leave_entitlement);
            `);
        return result;
    } catch (error) {
        console.error('Error creating leave summary:', error);
        throw new Error('Error creating leave summary');
    }
};

// Function to get leave summary by employee ID
export const getLeaveByEmployeeId = async (employee_id) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employee_id)
            .query(`
                SELECT * 
                FROM LeaveSummary 
                WHERE employee_id = @employee_id AND deleted_on IS NULL;
            `);
        return result.recordset[0];
    } catch (error) {
        console.error('Error retrieving leave summary:', error);
        throw new Error('Error retrieving leave summary');
    }
};

// Function to update leave summary for an employee
export const updateLeave= async (employee_id, annual_leave_entitlement, casual_leave_taken) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employee_id)
            .input('annual_leave_entitlement', sql.Int, annual_leave_entitlement)
            .input('casual_leave_taken', sql.Int, casual_leave_taken)
            .query(`
                UPDATE LeaveSummary
                SET annual_leave_entitlement = @annual_leave_entitlement,
                    casual_leave_taken = @casual_leave_taken,
                    updated_at = GETDATE()
                WHERE employee_id = @employee_id AND deleted_on IS NULL;
            `);
        return result;
    } catch (error) {
        console.error('Error updating leave summary:', error);
        throw new Error('Error updating leave summary');
    }
};

// Function to delete leave summary for an employee (soft delete)
export const softDeleteLeave = async (employee_id) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('employee_id', sql.Int, employee_id)
            .query(`
                UPDATE LeaveSummary
                SET deleted_on = GETDATE()
                WHERE employee_id = @employee_id;
            `);
        return result;
    } catch (error) {
        console.error('Error deleting leave summary:', error);
        throw new Error('Error deleting leave summary');
    }
};

// Function to get all leave summaries
export const getAllLeaveSummary = async () => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`
                SELECT * 
                FROM LeaveSummary 
                WHERE deleted_on IS NULL;
            `);
        return result.recordset;
    } catch (error) {
        console.error('Error retrieving all leave summaries:', error);
        throw new Error('Error retrieving all leave summaries');
    }
};
