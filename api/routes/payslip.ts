import { Router } from "express";
import { PayslipController } from "../controllers/payslip";

const payslipRouter = Router();

payslipRouter.post("/generate", PayslipController.generatePayslip);
payslipRouter.get("/", PayslipController.getAllPayslip);
payslipRouter.get("/payroll/:payrollId", PayslipController.getPayslipByPayrollId);
payslipRouter.get("/:id", PayslipController.getPayslipById);

export { payslipRouter };
