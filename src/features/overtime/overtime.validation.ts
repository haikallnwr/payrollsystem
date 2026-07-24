import { z } from "zod";

export const overtimeFormSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.number().min(0.5, "Hours must be at least 0.5").max(24, "Hours cannot exceed 24"),
  notes: z.string().optional(),
});

export type OvertimeFormData = z.infer<typeof overtimeFormSchema>;
