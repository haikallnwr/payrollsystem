import { Request, Response, NextFunction } from "express";
import { PayslipService } from "../services/payslip";

export class PayslipController {
  static async generatePayslip(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as { payroll_id: number };
      const result = await PayslipService.generatePayslip(request);

      res.status(201).json({
        code: 201,
        message: "Payslip successfully generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayslip(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PayslipService.getAllPayslip();
      res.status(200).json({
        code: 200,
        message: "Success get all payslip",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayslipById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await PayslipService.getPayslipById(id);

      res.status(200).json({
        code: 200,
        message: "Success get payslip",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayslipByPayrollId(req: Request, res: Response, next: NextFunction) {
    try {
      const payrollId = Number(req.params.payrollId);
      const result = await PayslipService.getPayslipByPayrollId(payrollId);

      res.status(200).json({
        code: 200,
        message: "Success get payslip by payroll",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
