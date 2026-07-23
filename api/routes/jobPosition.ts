import { Router } from "express";
import { JobPositionController } from "../controllers/jobPosition";

const jobPositionRouter = Router();

jobPositionRouter.post("/create", JobPositionController.createJobPosition);
jobPositionRouter.get("/", JobPositionController.getAllJobPosition);

export { jobPositionRouter };
