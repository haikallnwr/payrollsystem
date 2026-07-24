import { z } from "zod";

export const jobPositionFormSchema = z.object({
  division_id: z.number().min(1, "Division is required"),
  position_name: z.string().min(2, "Position name must be at least 2 characters"),
  level: z.enum(["JUNIOR", "MIDDLE", "SENIOR", "LEAD", "MANAGER"]),
  default_salary: z.number().min(0, "Default salary cannot be negative"),
  description: z.string().optional(),
});

export type JobPositionFormData = z.infer<typeof jobPositionFormSchema>;
