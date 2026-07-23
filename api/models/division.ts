import { Division } from "../generated/prisma/client";

export type DivisionCreateRequest = {
  name: string;
  description?: string;
};

export type DivisionUpdateRequest = {
  name?: string;
  description?: string;
  is_deleted?: boolean;
};

export type DivisionResponse = {
  id: number;
  name: string;
  description: string | null;
};

export function toDivisionResponse(req: Division): DivisionResponse {
  return {
    id: req.id,
    name: req.name,
    description: req.description,
  };
}

export function toDivisionResponseGetAll(req: Division[]): DivisionResponse[] {
  return req.map(toDivisionResponse);
}
