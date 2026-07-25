import type { Request, Response, NextFunction } from "express";
import type { DivisionCreateRequest } from "../models/division";
import type { TokenPayload } from "../middleware/jwt";
import { DivisionService } from "../services/division";

export class DivisionController {
  static async createDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as DivisionCreateRequest;
      const result = await DivisionService.createDivision(user, request);

      res.status(201).json({
        code: 201,
        message: "Division successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllDivision(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await DivisionService.getAllDivision(user);

      res.status(200).json({
        code: 200,
        message: "Success get all divisions",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as DivisionCreateRequest;
      const result = await DivisionService.updateDivision(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Division updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      await DivisionService.deleteDivision(user, id);

      res.status(200).json({
        code: 200,
        message: "Division deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
