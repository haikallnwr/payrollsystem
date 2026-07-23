import { Router } from "express";
import { DivisionController } from "../controllers/division";

const divisionRouter = Router();

divisionRouter.post("/create", DivisionController.createDivision);
divisionRouter.get("/", DivisionController.getAllDivision);

export { divisionRouter };
