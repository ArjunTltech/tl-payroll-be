import { sql, getPool } from "../config/db.js";

// Function to create an employee
export const createEmployee = async (name, employee_id, dob, department_id, designation_id, joining_date, status) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('employee_id', sql.NVarChar, employee_id)
            .input('dob', sql.Date, dob)
            .input('department_id', sql.Int, department_id)
            .input('designation_id', sql.Int, designation_id)
            .input('joining_date', sql.Date, joining_date)
            .input('status', sql.NVarChar, status)
            .query(`
                INSERT INTO Employees (name, employee_id, dob, department_id, designation_id, joining_date, status)
                VALUES (@name, @employee_id, @dob, @department_id, @designation_id, @joining_date, @status);
            `);
        return result;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Error creating employee');
    }
};


// Function to get all employees
export const getAllEmployees = async () => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT  e.id AS employee_id,e.name AS employee_name,
                    e.employee_id AS employee_code, e.dob,e.joining_date,e.status,d.name AS department_name,dg.name AS designation_name
                FROM 
                Employees e
                LEFT JOIN 
                Departments d ON e.department_id = d.id
                LEFT JOIN 
                Designations dg ON e.designation_id = dg.id
                WHERE  e.deleted_on IS NULL;`);
        return result.recordset;
    } catch (error) {
        console.error('Error retrieving employees:', error);
        throw new Error('Error retrieving employees');
    }
};

// Function to get an employee by ID
export const getEmployeeById = async (id) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM Employees WHERE id = @id AND deleted_on IS NULL`);
        return result.recordset[0];
    } catch (error) {
        console.error('Error retrieving employee:', error);
        throw new Error('Error retrieving employee');
    }
};

// Function to update an employee
export const updateEmployee = async (id, name, department_id, designation_id, status) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('department_id', sql.Int, department_id)   // Use department_id (integer)
            .input('designation_id', sql.Int, designation_id) // Use designation_id (integer)
            .input('status', sql.NVarChar, status)
            .query(`
        UPDATE Employees
        SET name = @name, department_id = @department_id, designation_id = @designation_id, status = @status, updated_at = GETDATE()
        WHERE id = @id AND deleted_on IS NULL;
      `);
        return result;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Error updating employee');
    }
};


export const softDeleteEmployee = async (id) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
        UPDATE Employees
        SET deleted_on = GETDATE()
        WHERE id = @id;
      `);
        return result;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw new Error('Error deleting employee');
    }
};
