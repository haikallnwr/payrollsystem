import { Router } from "express";
import { JobPositionController } from "../controllers/jobPosition";
import { authenticate } from "../middleware/auth";

const jobPositionRouter = Router();

jobPositionRouter.use(authenticate);

jobPositionRouter.post("/create", JobPositionController.createJobPosition);
jobPositionRouter.get("/", JobPositionController.getAllJobPosition);
jobPositionRouter.put("/update/:id", JobPositionController.updateJobPosition);
jobPositionRouter.delete("/delete/:id", JobPositionController.deleteJobPosition);

export { jobPositionRouter };
