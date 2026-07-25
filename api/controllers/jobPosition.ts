import type { Request, Response, NextFunction } from "express";
import type { JobPositionCreateRequest, JobPositionUpdateRequest } from "../models/jobPosition";
import type { TokenPayload } from "../middleware/jwt";
import { JobPositionService } from "../services/jobPosition";

export class JobPositionController {
  static async createJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as JobPositionCreateRequest;
      const result = await JobPositionService.jobPositionCreate(user, request);

      res.status(201).json({
        code: 201,
        message: "Job Position successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllJobPosition(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await JobPositionService.getAllJobPosition(user);

      res.status(200).json({
        code: 200,
        message: "Success get all job position",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as JobPositionUpdateRequest;
      const result = await JobPositionService.jobPositionUpdate(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Success update job position",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteJobPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      await JobPositionService.deleteJobPosition(user, id);

      res.status(200).json({
        code: 200,
        message: "Success delete job position",
      });
    } catch (error) {
      next(error);
    }
  }
}
