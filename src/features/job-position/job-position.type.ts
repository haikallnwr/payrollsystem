export type JobLevel = "JUNIOR" | "MIDDLE" | "SENIOR" | "LEAD" | "MANAGER";

export interface JobPosition {
  id: number;
  position_name: string;
  level: JobLevel;
  default_salary: number;
  description: string | null;
  division_id: number;
  division_name: string;
}

export interface JobPositionCreateInput {
  division_id: number;
  position_name: string;
  level: JobLevel;
  default_salary: number;
  description?: string;
}

export interface JobPositionUpdateInput {
  division_id?: number;
  position_name?: string;
  level?: JobLevel;
  default_salary?: number;
  description?: string;
}
