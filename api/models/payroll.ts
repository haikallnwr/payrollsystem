  import { Prisma, PayrollStatus } from "../generated/prisma/client";

  type payrollPayload = Prisma.PayrollGetPayload<{
    include: {
      employee: { select: { full_name: true; employee_code: true } };
      generator: { select: { email: true } };
      payslip: { select: { slip_number: true } };
      overtimes: { select: { id: true; date: true; hours: true; amount: true } };
      reimbursements: { select: { id: true; title: true; amount: true } };
    };
  }>;


  export type PayrollGenerateRequest = {
    employee_id: number;
    month: number;
    year: number;
    tax_percentage: number;
    other_deduction?: number;
    other_deduction_note?: string;
  };

  export type PayrollResponse = {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_code: string;
    month: number;
    year: number;
    basic_salary: number;
    overtime_total: number;
    reimbursement_total: number;
    tax_percentage: number;
    tax: number;
    other_deduction: number;
    other_deduction_note: string | null;
    gross_salary: number;
    net_salary: number;
    status: PayrollStatus;
    slip_number: string | null;
    generated_by_email: string;
    overtime_details: { id: number; date: Date; hours: number; amount: number }[];
    reimbursement_details: { id: number; title: string; amount: number }[];
  };

  export function toPayrollResponse(payload: payrollPayload): PayrollResponse {
    return {
      id: payload.id,
      employee_id: payload.employee_id,
      employee_name: payload.employee.full_name,
      employee_code: payload.employee.employee_code,
      month: payload.month,
      year: payload.year,
      basic_salary: Number(payload.basic_salary),
      overtime_total: Number(payload.overtime_total),
      reimbursement_total: Number(payload.reimbursement_total),
      tax_percentage: Number(payload.tax_percentage),
      tax: Number(payload.tax),
      other_deduction: Number(payload.other_deduction),
      other_deduction_note: payload.other_deduction_note,
      gross_salary: Number(payload.gross_salary),
      net_salary: Number(payload.net_salary),
      status: payload.status,
      slip_number: payload.payslip?.slip_number ?? null,
      generated_by_email: payload.generator.email,
      overtime_details: payload.overtimes.map((o) => ({
        id: o.id,
        date: o.date,
        hours: o.hours,
        amount: Number(o.amount),
      })),
      reimbursement_details: payload.reimbursements.map((r) => ({
        id: r.id,
        title: r.title,
        amount: Number(r.amount),
      })),
    };
  }

  export function toPayrollResponseGetAll(payloads: payrollPayload[]): PayrollResponse[] {
    return payloads.map(toPayrollResponse);
  }
