import { EmploymentStatus, JobLevel, PayrollStatus, ReimbursementStatus, RoleUser } from "../generated/prisma/client";
import { z, ZodType } from "zod";

export class UseValidation {
  // ========================= USER =========================

  static readonly USER_REGISTER: ZodType = z.object({
    email: z.email(),
    password: z.string().min(8).max(100),
    role: z.enum(Object.values(RoleUser) as [RoleUser, ...RoleUser[]]).optional(),
    employee_id: z.number().int().positive().optional(),
  });

  static readonly USER_LOGIN: ZodType = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  static readonly USER_UPDATE: ZodType = z.object({
    email: z.email().optional(),
    password: z.string().min(8).max(100).optional(),
    role: z.enum(Object.values(RoleUser) as [RoleUser, ...RoleUser[]]).optional(),
    employee_id: z.number().int().positive().optional(),
  });

  // ========================= DIVISION =========================

  static readonly DIVISION_CREATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(255).optional(),
  });

  static readonly DIVISION_UPDATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(255).optional(),
  });

  // ========================= JOB POSITION =========================

  static readonly JOB_POSITION_CREATE: ZodType = z.object({
    division_id: z.number().int().positive(),
    position_name: z.string().trim().min(1).max(100),
    level: z.enum(Object.values(JobLevel) as [JobLevel, ...JobLevel[]]),
    default_salary: z.number().positive(),
    description: z.string().trim().max(255).optional(),
  });

  static readonly JOB_POSITION_UPDATE: ZodType = z.object({
    division_id: z.number().int().positive().optional(),
    position_name: z.string().trim().min(1).max(100).optional(),
    level: z.enum(Object.values(JobLevel) as [JobLevel, ...JobLevel[]]).optional(),
    default_salary: z.number().positive().optional(),
    description: z.string().trim().max(255).optional(),
  });

  // ========================= EMPLOYEE =========================

  static readonly EMPLOYEE_CREATE: ZodType = z.object({
    user_id: z.number().int().positive().optional(),
    job_position_id: z.number().int().positive(),
    full_name: z.string().trim().min(3).max(100),
    phone: z.string().trim().max(20).optional(),
    join_date: z.coerce.date(),
    base_salary: z.number().positive(),
    bank_name: z.string().trim().max(100).optional(),
    bank_account: z.string().trim().max(50).optional(),
    employment_status: z.enum(Object.values(EmploymentStatus) as [EmploymentStatus, ...EmploymentStatus[]]).optional(),
  });

  static readonly EMPLOYEE_UPDATE: ZodType = z.object({
    user_id: z.number().int().positive().optional(),
    job_position_id: z.number().int().positive().optional(),
    full_name: z.string().trim().min(3).max(100).optional(),
    phone: z.string().trim().max(20).optional(),
    join_date: z.coerce.date().optional(),
    base_salary: z.number().positive().optional(),
    bank_name: z.string().trim().max(100).optional(),
    bank_account: z.string().trim().max(50).optional(),
  });

  static readonly EMPLOYEE_UPDATE_STATUS: ZodType = z.object({
    employment_status: z.enum(Object.values(EmploymentStatus) as [EmploymentStatus, ...EmploymentStatus[]]).optional(),
  });

  // ========================= REIMBURSEMENT =========================

  static readonly REIMBURSEMENT_CREATE: ZodType = z.object({
    employee_id: z.number().int().positive(),
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().max(500).optional(),
    amount: z.number().positive(),
    proof_file: z.string().trim().optional(),
  });

  static readonly REIMBURSEMENT_UPDATE: ZodType = z.object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    amount: z.number().positive().optional(),
    proof_file: z.string().trim().optional(),
  });

  static readonly REIMBURSEMENT_APPROVE: ZodType = z.object({
    status: z.enum(Object.values(ReimbursementStatus) as [ReimbursementStatus, ...ReimbursementStatus[]]),
  });

  // ========================= OVERTIME =========================

  static readonly OVERTIME_CREATE: ZodType = z.object({
    employee_id: z.number().int().positive(),
    date: z.coerce.date(),
    hours: z.number().positive(),
    notes: z.string().trim().max(255).optional(),
  });

  static readonly OVERTIME_UPDATE: ZodType = z.object({
    date: z.coerce.date().optional(),
    hours: z.number().positive().optional(),
    notes: z.string().trim().max(255).optional(),
  });

  // ========================= PAYROLL =========================

  static readonly PAYROLL_CREATE: ZodType = z.object({
    employee_id: z.number().int().positive(),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
    tax_percentage: z.number().min(0).max(100),
    other_deduction: z.number().min(0).optional(),
    other_deduction_note: z.string().trim().max(255).optional(),
  });

  static readonly PAYROLL_UPDATE: ZodType = z.object({
    status: z.enum(Object.values(PayrollStatus) as [PayrollStatus, ...PayrollStatus[]]).optional(),
    other_deduction: z.number().min(0).optional(),
  });
}
