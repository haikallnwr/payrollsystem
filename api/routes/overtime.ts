import { Router } from "express";
import { OvertimeController } from "../controllers/overtime";

const overtimeRouter = Router();

overtimeRouter.post("/create", OvertimeController.createOvertime);
overtimeRouter.get("/", OvertimeController.getAllOvertime);
overtimeRouter.put("/update/:id", OvertimeController.updateOvertime);
overtimeRouter.delete("/delete/:id", OvertimeController.deleteOvertime);

export { overtimeRouter };
