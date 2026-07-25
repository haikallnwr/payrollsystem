import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from "../middleware/jwt";
import { DashboardService } from "../services/dashboard";

export class DashboardController {
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const stats = await DashboardService.getDashboardStats(user);

      res.status(200).json({
        code: 200,
        message: "Success get dashboard statistics",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
