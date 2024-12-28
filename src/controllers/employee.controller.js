
import { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, softDeleteEmployee } from '../models/employee.model.js';

export const addEmployee = async (req, res) => {
  

  const { name, employee_id, dob, department_id, designation_id, joining_date, status } = req.body;

  try {
    const result = await createEmployee(name, employee_id, dob, department_id, designation_id, joining_date, status);
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error retrieving employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error('Error retrieving employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEmployeeDetails = async (req, res) => {
  const { id } = req.params;
  const { name, department_id, designation_id, status } = req.body;

  try {
    const result = await updateEmployee(id, name, department_id, designation_id, status);
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    await softDeleteEmployee(id);
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
