import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeStatusUpdateRequest,
  EmployeeUpdateRequest,
  generateEmployeeCode,
  toEmployeeResponse,
  toEmployeeResponseGetAll,
} from "../models/employee";

export class EmployeeService {
  static async createEmployee(currentUser: TokenPayload, request: EmployeeCreateRequest): Promise<EmployeeResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.EMPLOYEE_CREATE, request) as EmployeeCreateRequest;
    const isEmployeeExist = await prisma.employee.count({
      where: {
        full_name: createValidate.full_name,
        phone: createValidate.phone,
        bank_account: createValidate.bank_account,
        is_deleted: false,
      },
    });

    if (isEmployeeExist > 0) {
      throw new ResponseError(400, "Employee already exists");
    }

    const employee = await prisma.$transaction(async (tx) => {
      const empCode = await generateEmployeeCode(tx);
      const create = await tx.employee.create({
        data: {
          full_name: createValidate.full_name,
          employee_code: empCode,
          phone: createValidate.phone,
          job_position_id: createValidate.job_position_id,
          join_date: createValidate.join_date,
          base_salary: createValidate.base_salary,
          bank_account: createValidate.bank_account,
          bank_name: createValidate.bank_name,
        },
        include: {
          job_position: {
            include: {
              division: true,
            },
          },
        },
      });

      return create;
    });

    return toEmployeeResponse(employee);
  }

  static async getAllEmployee(currentUser: TokenPayload): Promise<EmployeeResponse[]> {
    if (currentUser.role !== "ADMIN" && currentUser.role !== "HR") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const employees = await prisma.employee.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        job_position: {
          include: {
            division: true,
          },
        },
      },
    });

    return toEmployeeResponseGetAll(employees);
  }

  static async getEmployeeById(currentUser: TokenPayload, id: number): Promise<EmployeeResponse> {
    if (currentUser.role !== "ADMIN" && currentUser.role !== "HR") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const employee = await prisma.employee.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
      include: {
        job_position: {
          include: {
            division: true,
          },
        },
      },
    });

    if (!employee) {
      throw new ResponseError(404, "Employee not found");
    }

    return toEmployeeResponse(employee);
  }

  static async updateEmployee(currentUser: TokenPayload, id: number, request: EmployeeUpdateRequest): Promise<EmployeeResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.EMPLOYEE_UPDATE, request) as EmployeeUpdateRequest;

    const existing = await prisma.employee.findFirst({
      where: { id: id, is_deleted: false },
    });

    if (!existing) {
      throw new ResponseError(404, "Employee not found");
    }

    const employee = await prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        full_name: updateValidate.full_name,
        phone: updateValidate.phone,
        job_position_id: updateValidate.job_position_id,
        join_date: updateValidate.join_date,
        base_salary: updateValidate.base_salary,
        bank_account: updateValidate.bank_account,
        bank_name: updateValidate.bank_name,
      },
      include: {
        job_position: {
          include: {
            division: true,
          },
        },
      },
    });

    return toEmployeeResponse(employee);
  }

  static async updateStatusEmployee(currentUser: TokenPayload, id: number, request: EmployeeStatusUpdateRequest): Promise<EmployeeResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateStatusValidate = Validation.validate(UseValidation.EMPLOYEE_UPDATE_STATUS, request) as EmployeeStatusUpdateRequest;

    const existing = await prisma.employee.findFirst({
      where: { id: id, is_deleted: false },
    });

    if (!existing) {
      throw new ResponseError(404, "Employee not found");
    }

    const employee = await prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        employment_status: updateStatusValidate.employment_status,
      },
      include: {
        job_position: {
          include: {
            division: true,
          },
        },
      },
    });

    return toEmployeeResponse(employee);
  }

  static async deleteEmployee(currentUser: TokenPayload, id: number): Promise<void> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const existing = await prisma.employee.findFirst({
      where: { id: id, is_deleted: false },
    });

    if (!existing) {
      throw new ResponseError(404, "Employee not found");
    }

    await prisma.employee.update({
      where: { id: id },
      data: {
        is_deleted: true,
      },
    });
  }
}
