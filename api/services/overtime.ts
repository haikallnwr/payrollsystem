import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import {
  OvertimeCreateRequest,
  OvertimeResponse,
  toOvertimeResponse,
  toOvertimeResponseGetAll,
} from "../models/overtime";

const OVERTIME_RATE_PER_HOUR = 50000;

export class OvertimeService {
  static async createOvertime(createdByUserId: number, request: OvertimeCreateRequest): Promise<OvertimeResponse> {
    const createValidate = Validation.validate(UseValidation.OVERTIME_CREATE, request) as OvertimeCreateRequest;

    const employee = await prisma.employee.findUnique({
      where: { id: createValidate.employee_id },
    });

    if (!employee) {
      throw new ResponseError(404, "Employee not found");
    }

    const amount = createValidate.hours * OVERTIME_RATE_PER_HOUR;

    const overtime = await prisma.overtime.create({
      data: {
        employee_id: createValidate.employee_id,
        date: createValidate.date,
        hours: createValidate.hours,
        amount: amount,
        notes: createValidate.notes,
        created_by: createdByUserId,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        creator: { select: { email: true } },
      },
    });

    return toOvertimeResponse(overtime);
  }

  static async getAllOvertime(): Promise<OvertimeResponse[]> {
    const overtimes = await prisma.overtime.findMany({
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        creator: { select: { email: true } },
      },
    });

    if (!overtimes) {
      throw new ResponseError(400, "There is no overtime created");
    }

    return toOvertimeResponseGetAll(overtimes);
  }

  static async updateOvertime(id: number, request: OvertimeCreateRequest): Promise<OvertimeResponse> {
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

    const hours = updateValidate.hours ?? existing.hours;
    const amount = hours * OVERTIME_RATE_PER_HOUR;

    const overtime = await prisma.overtime.update({
      where: { id: id },
      data: {
        date: updateValidate.date,
        hours: updateValidate.hours,
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

  static async deleteOvertime(id: number): Promise<void> {
    const existing = await prisma.overtime.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Overtime not found");
    }

    if (existing.payroll_id !== null) {
      throw new ResponseError(400, "Cannot delete overtime that is already locked to a payroll");
    }

    await prisma.overtime.delete({
      where: { id: id },
    });
  }
}
