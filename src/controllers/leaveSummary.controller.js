import { createLeave, getAllLeaveSummary, getLeaveByEmployeeId,  softDeleteLeave, updateLeave, } from "../models/leaveSummary.model.js";

export const createLeaveSummary = async (req, res) => {
    const { employeeId } = req.params; 
  const { annual_leave_entitlement } = req.body;
    try {
      const leaveSummary = await createLeave(employeeId, annual_leave_entitlement);
      res.status(201).json({
        success: true,
        message: 'Leave summary created successfully',
        data: leaveSummary
      });
    } catch (error) {
      console.error('Error creating leave summary:', error);
      res.status(500).json({ message: 'Error creating leave summary' });
    }
  };
  
  // Controller to get leave summary by employee ID
  export const getLeaveSummaryByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
      const leaveSummary = await getLeaveByEmployeeId(employeeId);
      if (!leaveSummary) {
        return res.status(404).json({ message: 'Leave summary not found' });
      }
      res.status(200).json(leaveSummary);
    } catch (error) {
      console.error('Error fetching leave summary:', error);
      res.status(500).json({ message: 'Error fetching leave summary' });
    }
  };
  
  // Controller to update leave summary
  export const updatedLeaveSummary= async (req, res) => {
    const { employeeId } = req.params;
    const { annual_leave_entitlement, casual_leave_taken } = req.body;
    try {
      const updatedLeaveSummary = await updateLeave(employeeId, annual_leave_entitlement, casual_leave_taken);
      if (!updatedLeaveSummary) {
        return res.status(404).json({ message: 'Leave summary not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Leave summary updated successfully',
        data: updatedLeaveSummary
      });
    } catch (error) {
      console.error('Error updating leave summary:', error);
      res.status(500).json({ message: 'Error updating leave summary' });
    }
  };
  
  // Controller to delete leave summary
  export const deleteLeaveSummary = async (req, res) => {
    const { employeeId } = req.params;
    try {
      const deletedLeaveSummary = await softDeleteLeave(employeeId);
      if (!deletedLeaveSummary) {
        return res.status(404).json({ message: 'Leave summary not found' });
      }
      res.status(200).json({ message: 'Leave summary deleted successfully' });
    } catch (error) {
      console.error('Error deleting leave summary:', error);
      res.status(500).json({ message: 'Error deleting leave summary' });
    }
  };
  
  // Controller to get all leave summaries
  export const getAllLeaveSummaries = async (req, res) => {
    try {
      const leaveSummaries = await getAllLeaveSummary();
      res.status(200).json(leaveSummaries);
    } catch (error) {
      console.error('Error fetching all leave summaries:', error);
      res.status(500).json({ message: 'Error fetching all leave summaries' });
    }
  };