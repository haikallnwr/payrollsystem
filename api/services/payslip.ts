import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
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
      employee: { select: { full_name: true, employee_code: true } },
    },
  },
} as const;

export class PayslipService {
  static async generatePayslip(request: { payroll_id: number }): Promise<PayslipResponse> {
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

  static async getAllPayslip(): Promise<PayslipResponse[]> {
    const payslips = await prisma.payslip.findMany({
      include: payslipInclude,
    });

    if (!payslips) {
      throw new ResponseError(400, "There is no payslip created");
    }

    return toPayslipResponseGetAll(payslips);
  }

  static async getPayslipById(id: number): Promise<PayslipResponse> {
    const payslip = await prisma.payslip.findUnique({
      where: { id: id },
      include: payslipInclude,
    });

    if (!payslip) {
      throw new ResponseError(404, "Payslip not found");
    }

    return toPayslipResponse(payslip);
  }

  static async getPayslipByPayrollId(payrollId: number): Promise<PayslipResponse> {
    const payslip = await prisma.payslip.findUnique({
      where: { payroll_id: payrollId },
      include: payslipInclude,
    });

    if (!payslip) {
      throw new ResponseError(404, "Payslip not found for this payroll");
    }

    return toPayslipResponse(payslip);
  }
}
