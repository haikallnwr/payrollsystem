import { Router } from "express";
import { UserController } from "../controllers/user";
import { authenticate } from "../middleware/auth";

const userRouter = Router();

userRouter.post("/register", UserController.userRegister);
userRouter.post("/login", UserController.userLogin);
userRouter.post("/logout", authenticate, UserController.userLogout);
userRouter.get("/me", authenticate, UserController.getMe);
userRouter.get("/", UserController.getAllUser);

export { userRouter };
