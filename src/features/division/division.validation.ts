import { z } from "zod";

export const divisionFormSchema = z.object({
  name: z.string().min(2, "Division name must be at least 2 characters"),
  description: z.string().optional(),
});

export type DivisionFormData = z.infer<typeof divisionFormSchema>;
