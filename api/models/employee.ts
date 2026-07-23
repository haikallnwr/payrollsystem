import { Prisma, EmploymentStatus } from "../generated/prisma/client";

type employeePayload = Prisma.EmployeeGetPayload<{
  include: {
    job_position: {
      select: {
        position_name: true;
        level: true;
        division: { select: { name: true } };
      };
    };
  };
}>;

export type EmployeeCreateRequest = {
  job_position_id: number;
  full_name: string;
  phone?: string;
  join_date: Date;
  base_salary: number;
  bank_name?: string;
  bank_account?: string;
};

export type EmployeeUpdateRequest = {
  job_position_id?: number;
  full_name?: string;
  phone?: string;
  join_date?: Date;
  base_salary?: number;
  bank_name?: string;
  bank_account?: string;
};

export type EmployeeStatusUpdateRequest = {
  employment_status: EmploymentStatus;
};

export type EmployeeResponse = {
  id: number;
  employee_code: string;
  full_name: string;
  phone: string | null;
  join_date: Date;
  base_salary: number;
  bank_name: string | null;
  bank_account: string | null;
  employment_status: EmploymentStatus;
  job_position_id: number;
  position_name: string;
  level: string;
  division_name: string;
};

export function toEmployeeResponse(payload: employeePayload): EmployeeResponse {
  return {
    id: payload.id,
    employee_code: payload.employee_code,
    full_name: payload.full_name,
    phone: payload.phone,
    join_date: payload.join_date,
    base_salary: Number(payload.base_salary),
    bank_name: payload.bank_name,
    bank_account: payload.bank_account,
    employment_status: payload.employment_status,
    job_position_id: payload.job_position_id,
    position_name: payload.job_position.position_name,
    level: payload.job_position.level,
    division_name: payload.job_position.division.name,
  };
}

export function toEmployeeResponseGetAll(payloads: employeePayload[]): EmployeeResponse[] {
  return payloads.map(toEmployeeResponse);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateEmployeeCode(tx: any): Promise<string> {
  const prefix = "EMP";

  const latest = await tx.employee.findFirst({
    orderBy: { employee_code: "desc" },
    select: { employee_code: true },
  });

  let num = 0;
  if (latest?.employee_code) {
    const lastNumberStr = latest.employee_code.substring(prefix.length);
    num = parseInt(lastNumberStr, 10) || 0;
  }

  num++;
  return prefix + num.toString().padStart(4, "0");
}
