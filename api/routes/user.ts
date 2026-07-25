import { Router } from "express";
import { UserController } from "../controllers/user";
import { authenticate } from "../middleware/auth";

const userRouter = Router();

// Public route
userRouter.post("/login", UserController.userLogin);

// Protected routes (require authentication)
userRouter.post("/logout", authenticate, UserController.userLogout);
userRouter.get("/me", authenticate, UserController.getMe);
userRouter.put("/me/password", authenticate, UserController.updateOwnPassword);
userRouter.put("/password", authenticate, UserController.updateOwnPassword);

userRouter.post("/register", authenticate, UserController.userRegister);
userRouter.get("/", authenticate, UserController.getAllUser);
userRouter.put("/update/:id", authenticate, UserController.updateUser);
userRouter.delete("/delete/:id", authenticate, UserController.deleteUser);

export { userRouter };
