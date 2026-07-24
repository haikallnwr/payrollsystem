import { z } from "zod";

export const userRegisterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
  employee_id: z.number().optional().nullable(),
});

export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
