import { z } from "zod";

export const payrollGenerateSchema = z.object({
  employee_id: z.number().min(1, "Employee is required"),
  month: z.number().min(1, "Month must be between 1 and 12").max(12),
  year: z.number().min(2000, "Year is required"),
  tax_percentage: z.number().min(0, "Tax percentage cannot be negative").max(100, "Tax cannot exceed 100%"),
  other_deduction: z.number().min(0, "Deduction cannot be negative").optional(),
  other_deduction_note: z.string().optional(),
});

export type PayrollGenerateFormData = z.infer<typeof payrollGenerateSchema>;
