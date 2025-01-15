
import { addBankDetails, getBankDetails, updateBankDetails, deleteBankDetails } from '../models/bank.model.js';

export const addBankDetailsController = async (req, res) => {
    const { employeeId } = req.params;
    const { bank_name, account_number, ifsc_code, account_type } = req.body;

    try {
        const result = await addBankDetails(employeeId, {
            bank_name,
            account_number,
            ifsc_code,
            account_type,
        });
        res.status(201).json({
            success: true,
            message: 'Bank details added successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error adding bank details:', error);
        res.status(500).json({ message: 'Error adding bank details' });
    }
};

export const getBankDetailsController = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const bankDetails = await getBankDetails(employeeId);
        if (!bankDetails.length) {
            return res.status(404).json({ message: 'Bank details not found for this employee' });
        }
        res.status(200).json(bankDetails);
    } catch (error) {
        console.error('Error fetching bank details:', error);
        res.status(500).json({ message: 'Error fetching bank details' });
    }
};

export const updateBankDetailsController = async (req, res) => {
    const { employeeId } = req.params;
    const { bank_name, account_number, ifsc_code, account_type } = req.body;

    try {
        const result = await updateBankDetails(employeeId, {
            bank_name,
            account_number,
            ifsc_code,
            account_type,
        });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Bank details not found for this employee' });
        }
        res.status(200).json({ message: 'Bank details updated successfully' });
    } catch (error) {
        console.error('Error updating bank details:', error);
        res.status(500).json({ message: 'Error updating bank details' });
    }
};

export const deleteBankDetailsController = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const result = await deleteBankDetails(employeeId);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Bank details not found for this employee' });
        }
        res.status(200).json({ message: 'Bank details deleted successfully' });
    } catch (error) {
        console.error('Error deleting bank details:', error);
        res.status(500).json({ message: 'Error deleting bank details' });
    }
};
