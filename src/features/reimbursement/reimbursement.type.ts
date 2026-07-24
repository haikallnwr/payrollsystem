export type ReimbursementStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Reimbursement {
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
  approved_at: string | null;
  is_locked: boolean;
}

export interface ReimbursementCreateInput {
  employee_id: number;
  title: string;
  description?: string;
  amount: number;
  proof_file?: string;
}

export interface ReimbursementApproveInput {
  status: ReimbursementStatus;
}
