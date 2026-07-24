import { Prisma, ReimbursementStatus } from "../generated/prisma/client";

type reimbursementPayload = Prisma.ReimbursementGetPayload<{
  include: {
    employee: { select: { full_name: true; employee_code: true } };
    approver: { select: { email: true } };
  };
}>;

export type ReimbursementCreateRequest = {
  employee_id: number;
  title: string;
  description?: string;
  amount: number;
  proof_file?: string;
};

export type ReimbursementApproveRequest = {
  status: ReimbursementStatus; 
};

export type ReimbursementResponse = {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  title: string;
  description: string | null;
  amount: number;
  proof_file: string | null;
  status: ReimbursementStatus;
  approved_by_email: string | null;
  approved_at: Date | null;
  is_locked: boolean;
};

export function toReimbursementResponse(payload: reimbursementPayload): ReimbursementResponse {
  return {
    id: payload.id,
    employee_id: payload.employee_id,
    employee_name: payload.employee.full_name,
    employee_code: payload.employee.employee_code,
    title: payload.title,
    description: payload.description,
    amount: Number(payload.amount),
    proof_file: payload.proof_file,
    status: payload.status,
    approved_by_email: payload.approver?.email ?? null,
    approved_at: payload.approved_at,
    is_locked: payload.payroll_id !== null,
  };
}

export function toReimbursementResponseGetAll(payloads: reimbursementPayload[]): ReimbursementResponse[] {
  return payloads.map(toReimbursementResponse);
}
