import { Request, Response, NextFunction } from "express";
import { JobPositionCreateRequest } from "../models/jobPosition";
import { JobPositionService } from "../services/jobPosition";

export class JobPositionController {
  static async createJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as JobPositionCreateRequest;
      const result = await JobPositionService.jobPositionCreate(request);

      res.status(201).json({
        code: 201,
        message: "Job Position successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await JobPositionService.getAllJobPosition();

      res.status(201).json({
        code: 201,
        message: "Success get all job position",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
