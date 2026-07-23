import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import { EmployeeCreateRequest, EmployeeResponse, EmployeeStatusUpdateRequest, EmployeeUpdateRequest, generateEmployeeCode, toEmployeeResponse, toEmployeeResponseGetAll } from "../models/employee";

export class EmployeeService {
  static async createEmployee(request: EmployeeCreateRequest): Promise<EmployeeResponse> {
    const createValidate = Validation.validate(UseValidation.EMPLOYEE_CREATE, request) as EmployeeCreateRequest;
    const isEmployeeExist = await prisma.employee.count({
      where: {
        full_name: createValidate.full_name,
        phone: createValidate.phone,
        bank_account: createValidate.bank_account,
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

  static async getAllEmployee(): Promise<EmployeeResponse[]> {
    const employee = await prisma.employee.findMany({
      include: {
        job_position: {
          include: {
            division: true,
          },
        },
      },
    });

    if (!employee) {
      throw new ResponseError(400, "There is no employee created");
    }
    return toEmployeeResponseGetAll(employee);
  }

  static async updateEmployee(id: number, request: EmployeeUpdateRequest): Promise<EmployeeResponse> {
    const updateValidate = Validation.validate(UseValidation.EMPLOYEE_UPDATE, request) as EmployeeUpdateRequest;

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

    if (!employee) {
      throw new ResponseError(400, "Invalid Request");
    }
    return toEmployeeResponse(employee);
  }

  static async updateStatusEmployee(id: number, request: EmployeeStatusUpdateRequest): Promise<EmployeeResponse> {
    const updateStatusValidate = Validation.validate(UseValidation.EMPLOYEE_UPDATE_STATUS, request) as EmployeeStatusUpdateRequest;

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

    if (!employee) {
      throw new ResponseError(400, "Invalid Request");
    }
    return toEmployeeResponse(employee);
  }
}
