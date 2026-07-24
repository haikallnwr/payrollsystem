export interface Overtime {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  date: string;
  hours: number;
  amount: number;
  notes: string | null;
  created_by_email: string;
  is_locked: boolean;
}

export interface OvertimeCreateInput {
  employee_id: number;
  date: string;
  hours: number;
  notes?: string;
}

export interface OvertimeUpdateInput {
  employee_id?: number;
  date?: string;
  hours?: number;
  notes?: string;
}
