import type { Request, Response, NextFunction } from "express";
import type { UserLoginRequest, UserRegisterRequest } from "../models/user";
import { generateToken, getDetailToken } from "../middleware/jwt";
import { UserService } from "../services/user";

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

      const token = await generateToken(result);

      res.status(200).json({
        code: 200,
        message: "Log in successfull",
        data: token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization as string;
      const token = await getDetailToken(header);
      const result = await UserService.getMe(token.email);

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
}
