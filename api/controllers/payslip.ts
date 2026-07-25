import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import { PayslipService } from "../services/payslip";

export class PayslipController {
  static async generatePayslip(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as { payroll_id: number };
      const result = await PayslipService.generatePayslip(user, request);

      res.status(201).json({
        code: 201,
        message: "Payslip successfully generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayslip(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await PayslipService.getAllPayslip(user);
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
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const result = await PayslipService.getPayslipById(user, id);

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
      const user = res.locals.user as TokenPayload;
      const payrollId = Number(req.params.payrollId);
      const result = await PayslipService.getPayslipByPayrollId(user, payrollId);

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
