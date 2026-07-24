import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import {
  PayrollGenerateRequest,
  PayrollResponse,
  toPayrollResponse,
  toPayrollResponseGetAll,
} from "../models/payroll";
import { PayrollStatus } from "../generated/prisma/client";

const payrollInclude = {
  employee: { select: { full_name: true, employee_code: true } },
  generator: { select: { email: true } },
  payslip: { select: { slip_number: true } },
  overtimes: { select: { id: true, date: true, hours: true, amount: true } },
  reimbursements: { select: { id: true, title: true, amount: true } },
} as const;

export class PayrollService {
  static async generatePayroll(generatedByUserId: number, request: PayrollGenerateRequest): Promise<PayrollResponse> {
    const createValidate = Validation.validate(UseValidation.PAYROLL_CREATE, request) as PayrollGenerateRequest;

    const employee = await prisma.employee.findUnique({
      where: { id: createValidate.employee_id },
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

      // gross = basic + overtime + reimbursement
      const grossSalary = basicSalary + overtimeTotal + reimbursementTotal;

      // tax is the rupiah amount: gross * tax_percentage / 100
      const taxPercentage = createValidate.tax_percentage;
      const tax = grossSalary * taxPercentage / 100;

      // net = gross - tax - other_deduction
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
          generated_by: generatedByUserId,
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

  static async getAllPayroll(): Promise<PayrollResponse[]> {
    const payrolls = await prisma.payroll.findMany({
      include: payrollInclude,
    });

    if (!payrolls) {
      throw new ResponseError(400, "There is no payroll created");
    }

    return toPayrollResponseGetAll(payrolls);
  }

  static async getPayrollById(id: number): Promise<PayrollResponse> {
    const payroll = await prisma.payroll.findUnique({
      where: { id: id },
      include: payrollInclude,
    });

    if (!payroll) {
      throw new ResponseError(404, "Payroll not found");
    }

    return toPayrollResponse(payroll);
  }

  static async updatePayrollStatus(id: number, request: { status: PayrollStatus }): Promise<PayrollResponse> {
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

    const payroll = await prisma.payroll.update({
      where: { id: id },
      data: {
        status: updateValidate.status,
      },
      include: payrollInclude,
    });

    return toPayrollResponse(payroll);
  }
}
