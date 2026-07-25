import type { Request, Response, NextFunction } from "express";
import type { UserLoginRequest, UserRegisterRequest, UserUpdatePasswordRequest, UserUpdateRoleRequest } from "../models/user";
import type { TokenPayload } from "../middleware/jwt";
import { generateToken } from "../middleware/jwt";
import { UserService } from "../services/user";
import { getTokenCookieOptions, TOKEN_COOKIE_NAME } from "../lib/cookie";

export class UserController {
  static async userRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as UserRegisterRequest;
      const result = await UserService.userRegister(user, request);

      res.status(201).json({
        code: 201,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as UserLoginRequest;
      const result = await UserService.userLogin(request);

      const token = generateToken(result);

      res.cookie(TOKEN_COOKIE_NAME, token, getTokenCookieOptions());

      res.status(200).json({
        code: 200,
        message: "Log in successful",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await UserService.getMe(user.email);

      res.status(200).json({
        code: 200,
        message: "Success get detail user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUser(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await UserService.getAllUser(user);

      res.status(200).json({
        code: 200,
        message: "Success get all users",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOwnPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as UserUpdatePasswordRequest;
      const result = await UserService.updateOwnPassword(user, request);

      res.status(200).json({
        code: 200,
        message: "Password updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as UserUpdateRoleRequest;
      const result = await UserService.updateUser(user, id, request);

      res.status(200).json({
        code: 200,
        message: "User updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      await UserService.deleteUser(user, id);

      res.status(200).json({
        code: 200,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async userLogout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(TOKEN_COOKIE_NAME, getTokenCookieOptions());

      res.status(200).json({
        code: 200,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
