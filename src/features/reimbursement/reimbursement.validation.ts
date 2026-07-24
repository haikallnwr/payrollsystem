import { z } from "zod";

export const reimbursementFormSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  amount: z.number().min(1000, "Amount must be at least Rp 1.000"),
  proof_file: z.string().optional(),
});

export type ReimbursementFormData = z.infer<typeof reimbursementFormSchema>;
