import { Router } from "express";
import { EmployeeController } from "../controllers/employee";

const employeeRouter = Router();

employeeRouter.post("/create", EmployeeController.createEmployee);
employeeRouter.get("/", EmployeeController.getAllEmployee);
employeeRouter.put("/update/:id", EmployeeController.updateEmployee);
employeeRouter.put("/status/:id", EmployeeController.updateStatusEmployee);

export { employeeRouter };
