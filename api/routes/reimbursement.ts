import { Router } from "express";
import { ReimbursementController } from "../controllers/reimbursement";

const reimbursementRouter = Router();

reimbursementRouter.post("/create", ReimbursementController.createReimbursement);
reimbursementRouter.get("/", ReimbursementController.getAllReimbursement);
reimbursementRouter.put("/update/:id", ReimbursementController.updateReimbursement);
reimbursementRouter.put("/approve/:id", ReimbursementController.approveReimbursement);

export { reimbursementRouter };
