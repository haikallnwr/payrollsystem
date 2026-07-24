export type RoleUser = "ADMIN" | "HR" | "EMPLOYEE";

export interface UserItem {
  id: number;
  email: string;
  role: RoleUser;
  employee: {
    id: number;
    employee_code: string;
    full_name: string;
    position_name: string;
    division_name: string;
  } | null;
}

export interface UserRegisterInput {
  email: string;
  password: string;
  role: RoleUser;
  employee_id?: number;
}
