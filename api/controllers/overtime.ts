import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import type { OvertimeCreateRequest } from "../models/overtime";
import { OvertimeService } from "../services/overtime";

export class OvertimeController {
  static async createOvertime(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as OvertimeCreateRequest;
      const result = await OvertimeService.createOvertime(user, request);

      res.status(201).json({
        code: 201,
        message: "Overtime successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOvertime(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await OvertimeService.getAllOvertime(user);
      res.status(200).json({
        code: 200,
        message: "Success get all overtime",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOvertime(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as OvertimeCreateRequest;
      const result = await OvertimeService.updateOvertime(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Success update overtime",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOvertime(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      await OvertimeService.deleteOvertime(user, id);

      res.status(200).json({
        code: 200,
        message: "Success delete overtime",
      });
    } catch (error) {
      next(error);
    }
  }
}
