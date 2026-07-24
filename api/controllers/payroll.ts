import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import { PayrollGenerateRequest } from "../models/payroll";
import { PayrollService } from "../services/payroll";

export class PayrollController {
 
  static async generatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as PayrollGenerateRequest;
      const result = await PayrollService.generatePayroll(user.id, request);

      res.status(201).json({
        code: 201,
        message: "Payroll successfully generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PayrollService.getAllPayroll();
      res.status(200).json({
        code: 200,
        message: "Success get all payroll",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPayrollById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await PayrollService.getPayrollById(id);

      res.status(200).json({
        code: 200,
        message: "Success get payroll",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePayrollStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const request = req.body as { status: string };
      const result = await PayrollService.updatePayrollStatus(id, request as any);

      res.status(200).json({
        code: 200,
        message: "Success update payroll status",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
