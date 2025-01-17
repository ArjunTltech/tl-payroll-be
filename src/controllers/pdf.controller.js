import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayslipData } from '../models/payroll.model.js';
import { log } from 'console';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePdf = async (req, res) => {
  let browser = null;
  try {
    // Error logging function
    // const logError = (message, error) => {
    //   console.error('------- ERROR DETAILS -------');
    //   console.error(`Message: ${message}`);
    //   console.error(`Error Name: ${error.name}`);
    //   console.error(`Error Message: ${error.message}`);
    //   console.error(`Stack Trace: ${error.stack}`);
    //   console.error('-----------------------------');
    // };

    // const employeeData = {
    //   name: 'Ali',
    //   id: 'TL-E024',
    //   salary: '15,000.00',
    //   department: 'Dev',
    //   designation: 'Full Stack Developer',
    //   payPeriod: 'September 2024 - October 2024',
    //   payDate: 'October 5th, 2024',
    //   basic: '7,967.00',
    //   hra: '1,593.00',
    //   allowances: '3,186.00',
    //   totalEarnings: '15,931.00',
    // };

    const { employeeId } = req.params;
    console.log(req.params)
    

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    // Fetch data from database
    const employeeData = await getPayslipData(employeeId);

    const templatePath = path.join(__dirname, '../handlebars/template.hbs');
    console.log('Template Path:', templatePath);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    if (!templateHtml || templateHtml.trim() === '') {
      throw new Error('Template HTML is empty');
    }

    const template = handlebars.compile(templateHtml);
    const html = template(employeeData);

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ],
        timeout: 30000
      });
    } catch (launchError) {
      logError('Browser Launch Failed', launchError);
      throw launchError;
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    try {
      await page.setContent(html, {
        waitUntil: ['load', 'networkidle0'],
        timeout: 20000
      });
    } catch (contentError) {
      logError('Content Setting Failed', contentError);
      throw contentError;
    }

    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        },
        preferCSSPageSize: true
      });

      // Verify PDF buffer
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error('Generated PDF is empty');
      }
    } catch (pdfError) {
      logError('PDF Generation Failed', pdfError);
      throw pdfError;
    }

    await browser.close();

    // Save for debugging purposes
    // const debugPdfPath = path.join(__dirname, 'debug_payslip.pdf');
    // fs.writeFileSync(debugPdfPath, pdfBuffer);
    // console.log(`Debug PDF saved to: ${debugPdfPath}`);

    // Ensure response is sent correctly
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=payslip.pdf',
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache',
    });

    // Send the PDF buffer as raw binary data
    res.end(pdfBuffer);

  } catch (error) {
    console.error('CRITICAL PDF GENERATION ERROR:', error);

    // Close browser if it was opened
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    // Send detailed error response
    res.status(500).json({
      error: 'PDF Generation Failed',
      details: error.message
    });
  }
};