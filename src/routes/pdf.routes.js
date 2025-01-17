import express from 'express';
import { generatePdf } from '../controllers/pdf.controller.js';

const router = express.Router();

// Route to generate the PDF
router.get('/generate-pdf/:employeeId', generatePdf);

export default router;