export interface Payslip {
  id: number;
  payroll_id: number;
  slip_number: string;
  generated_at: string;
  employee_name: string;
  employee_code: string;
  month: number;
  year: number;
  net_salary: number;
}

export interface PayslipGenerateInput {
  payroll_id: number;
}
