export type PayrollStatus = "DRAFT" | "APPROVED" | "PAID" | "REJECTED";

export interface PayrollOvertimeDetail {
  id: number;
  date: string;
  hours: number;
  amount: number;
}

export interface PayrollReimbursementDetail {
  id: number;
  title: string;
  amount: number;
}

export interface Payroll {
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
  overtime_details: PayrollOvertimeDetail[];
  reimbursement_details: PayrollReimbursementDetail[];
}

export interface PayrollGenerateInput {
  employee_id: number;
  month: number;
  year: number;
  tax_percentage: number;
  other_deduction?: number;
  other_deduction_note?: string;
}

export interface PayrollStatusUpdateInput {
  status: PayrollStatus;
}
