import type { Request, Response, NextFunction } from "express";
import type { EmployeeCreateRequest, EmployeeStatusUpdateRequest, EmployeeUpdateRequest } from "../models/employee";
import type { TokenPayload } from "../middleware/jwt";
import { EmployeeService } from "../services/employee";

export class EmployeeController {
  static async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const request = req.body as EmployeeCreateRequest;
      const result = await EmployeeService.createEmployee(user, request);

      res.status(201).json({
        code: 201,
        message: "Employee successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllEmployee(_req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const result = await EmployeeService.getAllEmployee(user);
      res.status(200).json({
        code: 200,
        message: "Success get all employees",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const result = await EmployeeService.getEmployeeById(user, id);

      res.status(200).json({
        code: 200,
        message: "Success get employee detail",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as EmployeeUpdateRequest;
      const result = await EmployeeService.updateEmployee(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Success update employee",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      const request = req.body as EmployeeStatusUpdateRequest;
      const result = await EmployeeService.updateStatusEmployee(user, id, request);

      res.status(200).json({
        code: 200,
        message: "Success update employee status",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenPayload;
      const id = Number(req.params.id);
      await EmployeeService.deleteEmployee(user, id);

      res.status(200).json({
        code: 200,
        message: "Success delete employee",
      });
    } catch (error) {
      next(error);
    }
  }
}
