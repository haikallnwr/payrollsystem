export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
  employee: {
    id: number;
    employee_code: string;
    full_name: string;
    position_name: string;
    division_name: string;
  } | null;
}
