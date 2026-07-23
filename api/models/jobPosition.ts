import { JobLevel, Prisma } from "../generated/prisma/client";

type jobPositionPayload = Prisma.JobPositionGetPayload<{
  include: {
    division: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type JobPositionCreateRequest = {
  division_id: number;
  position_name: string;
  level: JobLevel;
  default_salary: number;
  description?: string;
};

export type JobPositionUpdateRequest = {
  division_id?: number;
  position_name?: string;
  level?: JobLevel;
  default_salary?: number;
  description?: string;
  is_deleted?: boolean;
};

export type JobPositionResponse = {
  id: number;
  position_name: string;
  level: JobLevel;
  default_salary: number;
  description: string | null;
  division_id: number;
  division_name: string;
};

export function toJobPositionResponse(payload: jobPositionPayload): JobPositionResponse {
  return {
    id: payload.id,
    position_name: payload.position_name,
    level: payload.level,
    default_salary: Number(payload.default_salary),
    description: payload.description,
    division_id: payload.division_id,
    division_name: payload.division.name,
  };
}

export function toJobPositionResponseGetAll(payloads: jobPositionPayload[]): JobPositionResponse[] {
  return payloads.map(toJobPositionResponse);
}
