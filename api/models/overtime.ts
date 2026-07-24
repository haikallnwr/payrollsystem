import { Prisma } from "../generated/prisma/client";

type overtimePayload = Prisma.OvertimeGetPayload<{
  include: {
    employee: { select: { full_name: true; employee_code: true } };
    creator: { select: { email: true } };
  };
}>;

export type OvertimeCreateRequest = {
  employee_id: number;
  date: Date;
  hours: number;
  notes?: string;
};

export type OvertimeResponse = {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  date: Date;
  hours: number;
  amount: number;
  notes: string | null;
  created_by_email: string;
  is_locked: boolean;
};

export function toOvertimeResponse(payload: overtimePayload): OvertimeResponse {
  return {
    id: payload.id,
    employee_id: payload.employee_id,
    employee_name: payload.employee.full_name,
    employee_code: payload.employee.employee_code,
    date: payload.date,
    hours: payload.hours,
    amount: Number(payload.amount),
    notes: payload.notes,
    created_by_email: payload.creator.email,
    is_locked: payload.payroll_id !== null,
  };
}

export function toOvertimeResponseGetAll(payloads: overtimePayload[]): OvertimeResponse[] {
  return payloads.map(toOvertimeResponse);
}
