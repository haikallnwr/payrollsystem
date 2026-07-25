import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  BatchPayrollGenerateRequest,
  BatchPayrollResultResponse,
  BatchPayrollStatusUpdateRequest,
  BatchPayrollStatusUpdateResponse,
  PayrollGenerateRequest,
  PayrollResponse,
  toPayrollResponse,
  toPayrollResponseGetAll,
} from "../models/payroll";
import { PayrollStatus } from "../generated/prisma/client";

const payrollInclude = {
  employee: { select: { full_name: true, employee_code: true, user_id: true } },
  generator: { select: { email: true } },
  payslip: { select: { slip_number: true } },
  overtimes: { select: { id: true, date: true, hours: true, amount: true } },
  reimbursements: { select: { id: true, title: true, amount: true } },
} as const;

export class PayrollService {
  static async generatePayroll(currentUser: TokenPayload, request: PayrollGenerateRequest): Promise<PayrollResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.PAYROLL_CREATE, request) as PayrollGenerateRequest;

    const employee = await prisma.employee.findFirst({
      where: { id: createValidate.employee_id, is_deleted: false },
    });

    if (!employee) {
      throw new ResponseError(404, "Employee not found");
    }

    const existingPayroll = await prisma.payroll.findFirst({
      where: {
        employee_id: createValidate.employee_id,
        month: createValidate.month,
        year: createValidate.year,
      },
    });

    if (existingPayroll) {
      throw new ResponseError(400, "Payroll for this employee in the specified period already exists");
    }

    const payroll = await prisma.$transaction(async (tx) => {
      const reimbursements = await tx.reimbursement.findMany({
        where: {
          employee_id: createValidate.employee_id,
          status: "APPROVED",
          payroll_id: null,
        },
      });

      const overtimes = await tx.overtime.findMany({
        where: {
          employee_id: createValidate.employee_id,
          payroll_id: null,
        },
      });

      const basicSalary = Number(employee.base_salary);
      const overtimeTotal = overtimes.reduce((sum, o) => sum + Number(o.amount), 0);
      const reimbursementTotal = reimbursements.reduce((sum, r) => sum + Number(r.amount), 0);
      const otherDeduction = createValidate.other_deduction ?? 0;

      const grossSalary = basicSalary + overtimeTotal + reimbursementTotal;
      const taxPercentage = createValidate.tax_percentage;
      const tax = (grossSalary * taxPercentage) / 100;
      const netSalary = grossSalary - tax - otherDeduction;

      const created = await tx.payroll.create({
        data: {
          employee_id: createValidate.employee_id,
          month: createValidate.month,
          year: createValidate.year,
          basic_salary: basicSalary,
          overtime_total: overtimeTotal,
          reimbursement_total: reimbursementTotal,
          tax_percentage: taxPercentage,
          tax: tax,
          other_deduction: otherDeduction,
          other_deduction_note: createValidate.other_deduction_note,
          gross_salary: grossSalary,
          net_salary: netSalary,
          generated_by: currentUser.id,
        },
        include: payrollInclude,
      });

      if (overtimes.length > 0) {
        await tx.overtime.updateMany({
          where: { id: { in: overtimes.map((o) => o.id) } },
          data: { payroll_id: created.id },
        });
      }

      if (reimbursements.length > 0) {
        await tx.reimbursement.updateMany({
          where: { id: { in: reimbursements.map((r) => r.id) } },
          data: { payroll_id: created.id },
        });
      }

      const payroll = await tx.payroll.findUniqueOrThrow({
        where: { id: created.id },
        include: payrollInclude,
      });

      return payroll;
    });

    return toPayrollResponse(payroll);
  }

  static async generateBatchPayroll(
    currentUser: TokenPayload,
    request: BatchPayrollGenerateRequest,
  ): Promise<BatchPayrollResultResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const batchValidate = Validation.validate(
      UseValidation.PAYROLL_GENERATE_BATCH,
      request,
    ) as BatchPayrollGenerateRequest;

    const activeEmployees = await prisma.employee.findMany({
      where: {
        employment_status: "ACTIVE",
        is_deleted: false,
      },
    });

    if (activeEmployees.length === 0) {
      throw new ResponseError(400, "No active employees found to generate payroll.");
    }

    const createdPayrolls: PayrollResponse[] = [];
    let skippedCount = 0;
    let createdCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const employee of activeEmployees) {
        const existing = await tx.payroll.findFirst({
          where: {
            employee_id: employee.id,
            month: batchValidate.month,
            year: batchValidate.year,
          },
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        const reimbursements = await tx.reimbursement.findMany({
          where: {
            employee_id: employee.id,
            status: "APPROVED",
            payroll_id: null,
          },
        });

        const overtimes = await tx.overtime.findMany({
          where: {
            employee_id: employee.id,
            payroll_id: null,
          },
        });

        const basicSalary = Number(employee.base_salary);
        const overtimeTotal = overtimes.reduce((sum, o) => sum + Number(o.amount), 0);
        const reimbursementTotal = reimbursements.reduce((sum, r) => sum + Number(r.amount), 0);
        const otherDeduction = batchValidate.other_deduction ?? 0;

        const grossSalary = basicSalary + overtimeTotal + reimbursementTotal;
        const taxPercentage = batchValidate.tax_percentage;
        const tax = (grossSalary * taxPercentage) / 100;
        const netSalary = grossSalary - tax - otherDeduction;

        const created = await tx.payroll.create({
          data: {
            employee_id: employee.id,
            month: batchValidate.month,
            year: batchValidate.year,
            basic_salary: basicSalary,
            overtime_total: overtimeTotal,
            reimbursement_total: reimbursementTotal,
            tax_percentage: taxPercentage,
            tax: tax,
            other_deduction: otherDeduction,
            other_deduction_note: batchValidate.other_deduction_note,
            gross_salary: grossSalary,
            net_salary: netSalary,
            generated_by: currentUser.id,
          },
          include: payrollInclude,
        });

        if (overtimes.length > 0) {
          await tx.overtime.updateMany({
            where: { id: { in: overtimes.map((o) => o.id) } },
            data: { payroll_id: created.id },
          });
        }

        if (reimbursements.length > 0) {
          await tx.reimbursement.updateMany({
            where: { id: { in: reimbursements.map((r) => r.id) } },
            data: { payroll_id: created.id },
          });
        }

        const fullPayroll = await tx.payroll.findUniqueOrThrow({
          where: { id: created.id },
          include: payrollInclude,
        });

        createdPayrolls.push(toPayrollResponse(fullPayroll));
        createdCount++;
      }
    });

    return {
      processedCount: activeEmployees.length,
      createdCount,
      skippedCount,
      payrolls: createdPayrolls,
    };
  }

  static async getAllPayroll(currentUser: TokenPayload): Promise<PayrollResponse[]> {
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

    const payrolls = await prisma.payroll.findMany({
      where: whereClause,
      include: payrollInclude,
    });

    return toPayrollResponseGetAll(payrolls);
  }

  static async getPayrollById(currentUser: TokenPayload, id: number): Promise<PayrollResponse> {
    const payroll = await prisma.payroll.findUnique({
      where: { id: id },
      include: payrollInclude,
    });

    if (!payroll) {
      throw new ResponseError(404, "Payroll not found");
    }

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee || payroll.employee_id !== userEmployee.id) {
        throw new ResponseError(403, "You are not allowed to access this resource.");
      }
    }

    return toPayrollResponse(payroll);
  }

  static async updatePayrollStatus(
    currentUser: TokenPayload,
    id: number,
    request: { status: PayrollStatus },
  ): Promise<PayrollResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.PAYROLL_UPDATE, request) as { status: PayrollStatus };

    const existing = await prisma.payroll.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Payroll not found");
    }

    if (existing.status === "PAID") {
      throw new ResponseError(400, "Cannot update payroll that has already been paid");
    }

    // HR Self-Processing Rule: HR cannot approve, reject, or update status for their own payroll
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (userEmployee && existing.employee_id === userEmployee.id) {
        throw new ResponseError(403, "HR users cannot approve, reject, or update status for their own payroll.");
      }
    }

    const payroll = await prisma.payroll.update({
      where: { id: id },
      data: {
        status: updateValidate.status,
      },
      include: payrollInclude,
    });

    return toPayrollResponse(payroll);
  }

  static async updateBatchPayrollStatus(
    currentUser: TokenPayload,
    request: BatchPayrollStatusUpdateRequest,
  ): Promise<BatchPayrollStatusUpdateResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const validate = Validation.validate(
      UseValidation.PAYROLL_UPDATE_BATCH_STATUS,
      request,
    ) as BatchPayrollStatusUpdateRequest;

    let hrEmployeeId: number | null = null;
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });
      if (userEmployee) {
        hrEmployeeId = userEmployee.id;
      }
    }

    const whereCondition: any = {
      id: { in: validate.payroll_ids },
      status: { not: "PAID" },
    };

    if (hrEmployeeId !== null) {
      whereCondition.employee_id = { not: hrEmployeeId };
    }

    const payrollsToUpdate = await prisma.payroll.findMany({
      where: whereCondition,
    });

    if (payrollsToUpdate.length === 0) {
      throw new ResponseError(400, "No eligible payrolls found to update status (HR users cannot process their own payroll).");
    }

    const updatedIds = payrollsToUpdate.map((p) => p.id);

    await prisma.payroll.updateMany({
      where: { id: { in: updatedIds } },
      data: { status: validate.status },
    });

    const updatedPayrolls = await prisma.payroll.findMany({
      where: { id: { in: updatedIds } },
      include: payrollInclude,
    });

    return {
      updatedCount: updatedPayrolls.length,
      payrolls: toPayrollResponseGetAll(updatedPayrolls),
    };
  }
}
