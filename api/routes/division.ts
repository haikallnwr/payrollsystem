import { Router } from "express";
import { DivisionController } from "../controllers/division";
import { authenticate } from "../middleware/auth";

const divisionRouter = Router();

divisionRouter.use(authenticate);

divisionRouter.post("/create", DivisionController.createDivision);
divisionRouter.get("/", DivisionController.getAllDivision);
divisionRouter.put("/update/:id", DivisionController.updateDivision);
divisionRouter.delete("/delete/:id", DivisionController.deleteDivision);

export { divisionRouter };
