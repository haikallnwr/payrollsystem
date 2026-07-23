import type { Request, Response, NextFunction } from "express";
import { DivisionCreateRequest } from "../models/division";
import { DivisionService } from "../services/division";

export class DivisionController {
  static async createDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as DivisionCreateRequest;
      const result = await DivisionService.createDivision(request);

      res.status(201).json({
        code: 201,
        message: "Division successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllDivision(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DivisionService.getAllDivision();

      res.status(200).json({
        code: 200,
        message: "Success get all division",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
