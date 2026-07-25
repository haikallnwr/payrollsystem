import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  PayslipResponse,
  toPayslipResponse,
  toPayslipResponseGetAll,
  generateSlipNumber,
} from "../models/payslip";

const payslipInclude = {
  payroll: {
    select: {
      month: true,
      year: true,
      net_salary: true,
      employee_id: true,
      employee: { select: { full_name: true, employee_code: true, user_id: true } },
    },
  },
} as const;

export class PayslipService {
  static async generatePayslip(currentUser: TokenPayload, request: { payroll_id: number }): Promise<PayslipResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.PAYSLIP_CREATE, request) as { payroll_id: number };

    const payroll = await prisma.payroll.findUnique({
      where: { id: createValidate.payroll_id },
    });

    if (!payroll) {
      throw new ResponseError(404, "Payroll not found");
    }

    if (payroll.status !== "PAID") {
      throw new ResponseError(400, "Payslip can only be generated for payrolls with PAID status");
    }

    const existingPayslip = await prisma.payslip.findUnique({
      where: { payroll_id: createValidate.payroll_id },
    });

    if (existingPayslip) {
      throw new ResponseError(400, "Payslip for this payroll already exists");
    }

    const payslip = await prisma.$transaction(async (tx) => {
      const slipNumber = await generateSlipNumber(tx, payroll.month, payroll.year);

      const created = await tx.payslip.create({
        data: {
          payroll_id: createValidate.payroll_id,
          slip_number: slipNumber,
        },
        include: payslipInclude,
      });

      return created;
    });

    return toPayslipResponse(payslip);
  }

  static async getAllPayslip(currentUser: TokenPayload): Promise<PayslipResponse[]> {
    let whereClause = {};

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee) {
        return [];
      }

      whereClause = { payroll: { employee_id: userEmployee.id } };
    }

    const payslips = await prisma.payslip.findMany({
      where: whereClause,
      include: payslipInclude,
    });

    return toPayslipResponseGetAll(payslips);
  }

  static async getPayslipById(currentUser: TokenPayload, id: number): Promise<PayslipResponse> {
    const payslip = await prisma.payslip.findUnique({
      where: { id: id },
      include: payslipInclude,
    });

    if (!payslip) {
      throw new ResponseError(404, "Payslip not found");
    }

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee || payslip.payroll.employee_id !== userEmployee.id) {
        throw new ResponseError(403, "You are not allowed to access this resource.");
      }
    }

    return toPayslipResponse(payslip);
  }

  static async getPayslipByPayrollId(currentUser: TokenPayload, payrollId: number): Promise<PayslipResponse> {
    const payslip = await prisma.payslip.findUnique({
      where: { payroll_id: payrollId },
      include: payslipInclude,
    });

    if (!payslip) {
      throw new ResponseError(404, "Payslip not found for this payroll");
    }

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee || payslip.payroll.employee_id !== userEmployee.id) {
        throw new ResponseError(403, "You are not allowed to access this resource.");
      }
    }

    return toPayslipResponse(payslip);
  }
}
