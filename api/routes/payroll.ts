import { Router } from "express";
import { PayrollController } from "../controllers/payroll";
import { authenticate } from "../middleware/auth";

const payrollRouter = Router();

payrollRouter.use(authenticate);

payrollRouter.post("/generate", PayrollController.generatePayroll);
payrollRouter.post("/generate-batch", PayrollController.generateBatchPayroll);
payrollRouter.get("/", PayrollController.getAllPayroll);
payrollRouter.get("/:id", PayrollController.getPayrollById);
payrollRouter.put("/status/:id", PayrollController.updatePayrollStatus);

export { payrollRouter };
