import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import type { BatchPayrollGenerateRequest, BatchPayrollStatusUpdateRequest, PayrollGenerateRequest } from "../models/payroll";
import { PayrollService } from "../services/payroll";
import type { PayrollStatus } from "../generated/prisma/client";

export class PayrollController {
  static async generatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as PayrollGenerateRequest;
      const result = await PayrollService.generatePayroll(user, request);

      res.status(201).json({
        code: 201,
        message: "Payroll successfully generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateBatchPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as BatchPayrollGenerateRequest;
      const result = await PayrollService.generateBatchPayroll(user, request);

      res.status(201).json({
        code: 201,
        message: `Batch payroll completed: ${result.createdCount} created, ${result.skippedCount} skipped out of ${result.processedCount} active employees.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayroll(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await PayrollService.getAllPayroll(user);
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
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const result = await PayrollService.getPayrollById(user, id);

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
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as { status: PayrollStatus };
      const result = await PayrollService.updatePayrollStatus(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Success update payroll status",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBatchPayrollStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as BatchPayrollStatusUpdateRequest;
      const result = await PayrollService.updateBatchPayrollStatus(user, request);

      res.status(200).json({
        code: 200,
        message: `Successfully updated status for ${result.updatedCount} payroll items.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
