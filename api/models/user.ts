import { Prisma, RoleUser } from "../generated/prisma/client";

type userPayload = Prisma.UserGetPayload<{
  include: {
    employee: {
      select: {
        id: true;
        employee_code: true;
        full_name: true;
        job_position: {
          select: {
            position_name: true;
            division: { select: { name: true } };
          };
        };
      };
    };
  };
}>;

export type UserRegisterRequest = {
  email: string;
  password: string;
  role: RoleUser;
  employee_id?: number;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserUpdateRoleRequest = {
  email?: string;
  password?: string;
  role?: RoleUser;
};

export type UserResponse = {
  id: number;
  email: string;
  role: RoleUser;
  employee: {
    id: number;
    employee_code: string;
    full_name: string;
    position_name: string;
    division_name: string;
  } | null;
};

export function toUserResponse(payload: userPayload): UserResponse {
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    employee: payload.employee
      ? {
          id: payload.employee.id,
          employee_code: payload.employee.employee_code,
          full_name: payload.employee.full_name,
          position_name: payload.employee.job_position.position_name,
          division_name: payload.employee.job_position.division.name,
        }
      : null,
  };
}

export function toUserResponseGetAll(payloads: userPayload[]): UserResponse[] {
  return payloads.map(toUserResponse);
}
