import express from "express";
import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js";
// import payrollRoutes from "./payroll.routes.js";
import pdfRoutes from "./pdf.routes.js";
// import reportRoutes from "./report.routes.js";

const router = express.Router();

// Mount subroutes
router.use("/auth", authRoutes);
router.use("/employee", employeeRoutes);
router.use("/pdf", pdfRoutes);
// router.use("/payroll", payrollRoutes);
// router.use("/pdf", pdfRoutes);
// router.use("/report", reportRoutes);

export default router;