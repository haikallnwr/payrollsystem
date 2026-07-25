import { Router } from "express";
import { PayslipController } from "../controllers/payslip";
import { authenticate } from "../middleware/auth";

const payslipRouter = Router();

payslipRouter.use(authenticate);

payslipRouter.post("/generate", PayslipController.generatePayslip);
payslipRouter.get("/", PayslipController.getAllPayslip);
payslipRouter.get("/payroll/:payrollId", PayslipController.getPayslipByPayrollId);
payslipRouter.get("/:id", PayslipController.getPayslipById);

export { payslipRouter };
