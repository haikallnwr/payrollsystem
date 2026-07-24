import { Prisma } from "../generated/prisma/client";

type payslipPayload = Prisma.PayslipGetPayload<{
  include: {
    payroll: {
      select: {
        month: true;
        year: true;
        net_salary: true;
        employee: { select: { full_name: true; employee_code: true } };
      };
    };
  };
}>;

export type PayslipResponse = {
  id: number;
  payroll_id: number;
  slip_number: string;
  generated_at: Date;
  employee_name: string;
  employee_code: string;
  month: number;
  year: number;
  net_salary: number;
};

export function toPayslipResponse(payload: payslipPayload): PayslipResponse {
  return {
    id: payload.id,
    payroll_id: payload.payroll_id,
    slip_number: payload.slip_number,
    generated_at: payload.generated_at,
    employee_name: payload.payroll.employee.full_name,
    employee_code: payload.payroll.employee.employee_code,
    month: payload.payroll.month,
    year: payload.payroll.year,
    net_salary: Number(payload.payroll.net_salary),
  };
}

export function toPayslipResponseGetAll(payloads: payslipPayload[]): PayslipResponse[] {
  return payloads.map(toPayslipResponse);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateSlipNumber(tx: any, month: number, year: number): Promise<string> {
  const prefix = `SLIP-${year}${month.toString().padStart(2, "0")}`;

  const latest = await tx.payslip.findFirst({
    where: { slip_number: { startsWith: prefix } },
    orderBy: { slip_number: "desc" },
    select: { slip_number: true },
  });

  let num = 0;
  if (latest?.slip_number) {
    const lastNumberStr = latest.slip_number.substring(prefix.length);
    num = parseInt(lastNumberStr, 10) || 0;
  }

  num++;
  return prefix + num.toString().padStart(4, "0");
}
