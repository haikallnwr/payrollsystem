import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import { ReimbursementCreateRequest, ReimbursementApproveRequest } from "../models/reimbursement";
import { ReimbursementService } from "../services/reimbursement";

export class ReimbursementController {
  static async createReimbursement(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as ReimbursementCreateRequest;
      const result = await ReimbursementService.createReimbursement(request);

      res.status(201).json({
        code: 201,
        message: "Reimbursement successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllReimbursement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReimbursementService.getAllReimbursement();
      res.status(200).json({
        code: 200,
        message: "Success get all reimbursement",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateReimbursement(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const request = req.body as ReimbursementCreateRequest;
      const result = await ReimbursementService.updateReimbursement(id, request);

      res.status(200).json({
        code: 200,
        message: "Success update reimbursement",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

 
  static async approveReimbursement(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = res.locals.user as TokenPayload;
      const request = req.body as ReimbursementApproveRequest;
      const result = await ReimbursementService.approveReimbursement(id, user.id, request);

      res.status(200).json({
        code: 200,
        message: "Success update reimbursement status",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
