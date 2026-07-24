export type EmploymentStatus = "ACTIVE" | "RESIGNED" | "TERMINATED";

export interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  phone: string | null;
  join_date: string;
  base_salary: number;
  bank_name: string | null;
  bank_account: string | null;
  employment_status: EmploymentStatus;
  job_position_id: number;
  position_name: string;
  level: string;
  division_name: string;
}

export interface EmployeeCreateInput {
  job_position_id: number;
  full_name: string;
  phone?: string;
  join_date: string;
  base_salary: number;
  bank_name?: string;
  bank_account?: string;
}

export interface EmployeeUpdateInput {
  job_position_id?: number;
  full_name?: string;
  phone?: string;
  join_date?: string;
  base_salary?: number;
  bank_name?: string;
  bank_account?: string;
}

export interface EmployeeStatusUpdateInput {
  employment_status: EmploymentStatus;
}

export interface JobPositionOption {
  id: number;
  position_name: string;
  level: string;
  division_name?: string;
  division?: {
    name: string;
  };
}
