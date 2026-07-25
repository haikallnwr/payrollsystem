import { Router } from "express";
import { DashboardController } from "../controllers/dashboard";
import { authenticate } from "../middleware/auth";

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/stats", DashboardController.getStats);

export { dashboardRouter };
