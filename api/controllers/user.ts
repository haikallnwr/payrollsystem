import type { Request, Response, NextFunction } from "express";
import type { UserLoginRequest, UserRegisterRequest } from "../models/user";
import type { TokenPayload } from "../middleware/jwt";
import { generateToken } from "../middleware/jwt";
import { UserService } from "../services/user";
import { getTokenCookieOptions, TOKEN_COOKIE_NAME } from "../lib/cookie";

export class UserController {
  static async userRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as UserRegisterRequest;
      const result = await UserService.userRegister(request);

      res.status(201).json({
        code: 201,
        message: "Register successfull",
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
        message: "Log in successfull",
      });
    } catch (error) {
      next(error);
    }
  }

  
  static async getMe(req: Request, res: Response, next: NextFunction) {
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

  static async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getAllUser();

      res.status(200).json({
        code: 200,
        message: "Success get all user",
        data: result,
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
