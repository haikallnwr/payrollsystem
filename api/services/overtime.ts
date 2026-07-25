import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  OvertimeCreateRequest,
  OvertimeResponse,
  toOvertimeResponse,
  toOvertimeResponseGetAll,
} from "../models/overtime";

export class OvertimeService {
  static async createOvertime(currentUser: TokenPayload, request: OvertimeCreateRequest): Promise<OvertimeResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.OVERTIME_CREATE, request) as OvertimeCreateRequest;

    const targetEmployee = await prisma.employee.findUnique({
      where: { id: createValidate.employee_id },
    });

    if (!targetEmployee) {
      throw new ResponseError(404, "Employee not found");
    }

    // HR Self-Processing Rule: HR cannot create overtime for themselves
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (userEmployee && userEmployee.id === createValidate.employee_id) {
        throw new ResponseError(403, "You cannot process your own overtime.");
      }
    }

    // Formula Lembur Standar Ketenagakerjaan: (1 / 173) x Gaji Pokok
    const baseSalary = Number(targetEmployee.base_salary || 0);
    const hourlyRate = Math.round(baseSalary / 173);
    const amount = createValidate.hours * hourlyRate;

    const overtime = await prisma.overtime.create({
      data: {
        employee_id: createValidate.employee_id,
        date: createValidate.date,
        hours: createValidate.hours,
        amount: amount,
        notes: createValidate.notes,
        created_by: currentUser.id,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        creator: { select: { email: true } },
      },
    });

    return toOvertimeResponse(overtime);
  }

  static async getAllOvertime(currentUser: TokenPayload): Promise<OvertimeResponse[]> {
    let whereClause = {};

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee) {
        return [];
      }

      whereClause = { employee_id: userEmployee.id };
    }

    const overtimes = await prisma.overtime.findMany({
      where: whereClause,
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        creator: { select: { email: true } },
      },
    });

    return toOvertimeResponseGetAll(overtimes);
  }

  static async updateOvertime(currentUser: TokenPayload, id: number, request: OvertimeCreateRequest): Promise<OvertimeResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.OVERTIME_UPDATE, request) as OvertimeCreateRequest;

    const existing = await prisma.overtime.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Overtime not found");
    }

    if (existing.payroll_id !== null) {
      throw new ResponseError(400, "Cannot update overtime that is already locked to a payroll");
    }

    // HR Self-Processing Rule: HR cannot update their own overtime
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (userEmployee && userEmployee.id === existing.employee_id) {
        throw new ResponseError(403, "You cannot process your own overtime.");
      }
    }

    const targetEmployee = await prisma.employee.findUnique({
      where: { id: existing.employee_id },
    });
    const baseSalary = Number(targetEmployee?.base_salary || 0);
    const hourlyRate = Math.round(baseSalary / 173);

    const hours = updateValidate.hours ?? existing.hours;
    const amount = hours * hourlyRate;

    const overtime = await prisma.overtime.update({
      where: { id: id },
      data: {
        date: updateValidate.date || existing.date,
        hours: hours,
        amount: amount,
        notes: updateValidate.notes,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        creator: { select: { email: true } },
      },
    });

    return toOvertimeResponse(overtime);
  }

  static async deleteOvertime(currentUser: TokenPayload, id: number): Promise<void> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const existing = await prisma.overtime.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Overtime not found");
    }

    if (existing.payroll_id !== null) {
      throw new ResponseError(400, "Cannot delete overtime that is already locked to a payroll");
    }

    // HR Self-Processing Rule: HR cannot delete their own overtime
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (userEmployee && userEmployee.id === existing.employee_id) {
        throw new ResponseError(403, "You cannot process your own overtime.");
      }
    }

    await prisma.overtime.delete({
      where: { id: id },
    });
  }
}
