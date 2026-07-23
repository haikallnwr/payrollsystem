import { Router } from "express";
import { UserController } from "../controllers/user";
import { verifyJsonWebToken } from "../middleware/errorHandler";

const userRouter = Router();

userRouter.post("/register", UserController.userRegister);
userRouter.post("/login", UserController.userLogin);
userRouter.get("/me", verifyJsonWebToken, UserController.getMe);
userRouter.get("/", UserController.getAllUser);

export { userRouter };
