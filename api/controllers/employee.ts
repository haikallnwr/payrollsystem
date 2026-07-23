import { Request, Response, NextFunction } from "express";
import { EmployeeCreateRequest, EmployeeStatusUpdateRequest, EmployeeUpdateRequest } from "../models/employee";
import { EmployeeService } from "../services/employee";

export class EmployeeController {
  static async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as EmployeeCreateRequest;
      const result = await EmployeeService.createEmployee(request);

      res.status(201).json({
        code: 201,
        message: "Employee successfully created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EmployeeService.getAllEmployee();
      res.status(200).json({
        code: 200,
        message: "Success get all division",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const request = req.body as EmployeeUpdateRequest;
      const result = await EmployeeService.updateEmployee(id, request);

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
      const id = Number(req.params.id);

      const request = req.body as EmployeeStatusUpdateRequest;
      const result = await EmployeeService.updateStatusEmployee(id, request);

      res.status(200).json({
        code: 200,
        message: "Success update employee status",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
