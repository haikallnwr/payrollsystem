import { Router } from "express";
import { EmployeeController } from "../controllers/employee";
import { authenticate } from "../middleware/auth";

const employeeRouter = Router();

employeeRouter.use(authenticate);

employeeRouter.post("/create", EmployeeController.createEmployee);
employeeRouter.get("/", EmployeeController.getAllEmployee);
employeeRouter.get("/:id", EmployeeController.getEmployeeById);
employeeRouter.put("/update/:id", EmployeeController.updateEmployee);
employeeRouter.put("/status/:id", EmployeeController.updateStatusEmployee);
employeeRouter.delete("/delete/:id", EmployeeController.deleteEmployee);

export { employeeRouter };
