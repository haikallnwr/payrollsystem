import { z } from "zod";

export const employeeFormSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  job_position_id: z.number().min(1, "Job position is required"),
  phone: z.string().optional(),
  join_date: z.string().min(1, "Join date is required"),
  base_salary: z.number().min(0, "Base salary cannot be negative"),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export const employeeStatusSchema = z.object({
  employment_status: z.enum(["ACTIVE", "RESIGNED", "TERMINATED"]),
});

export type EmployeeStatusFormData = z.infer<typeof employeeStatusSchema>;
