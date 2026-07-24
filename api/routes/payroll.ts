import { Router } from "express";
import { PayrollController } from "../controllers/payroll";

const payrollRouter = Router();

payrollRouter.post("/generate", PayrollController.generatePayroll);
payrollRouter.get("/", PayrollController.getAllPayroll);
payrollRouter.get("/:id", PayrollController.getPayrollById);
payrollRouter.put("/status/:id", PayrollController.updatePayrollStatus);

export { payrollRouter };
