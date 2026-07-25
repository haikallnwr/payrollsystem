import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  DivisionCreateRequest,
  DivisionResponse,
  toDivisionResponse,
  toDivisionResponseGetAll,
} from "../models/division";

export class DivisionService {
  static async createDivision(currentUser: TokenPayload, request: DivisionCreateRequest): Promise<DivisionResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.DIVISION_CREATE, request) as DivisionCreateRequest;
    const count = await prisma.division.count({
      where: {
        name: createValidate.name,
        is_deleted: false,
      },
    });

    if (count > 0) {
      throw new ResponseError(400, "Division already exists");
    }

    const division = await prisma.division.create({
      data: {
        name: createValidate.name,
        description: createValidate.description,
      },
    });

    return toDivisionResponse(division);
  }

  static async getAllDivision(_currentUser?: TokenPayload): Promise<DivisionResponse[]> {
    const division = await prisma.division.findMany({
      where: {
        is_deleted: false,
      },
    });

    return toDivisionResponseGetAll(division);
  }

  static async updateDivision(
    currentUser: TokenPayload,
    id: number,
    request: DivisionCreateRequest,
  ): Promise<DivisionResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.DIVISION_UPDATE, request) as DivisionCreateRequest;

    const existing = await prisma.division.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "Division not found");
    }

    const updated = await prisma.division.update({
      where: { id: id },
      data: {
        name: updateValidate.name || existing.name,
        description: updateValidate.description,
      },
    });

    return toDivisionResponse(updated);
  }

  static async deleteDivision(currentUser: TokenPayload, id: number): Promise<void> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const existing = await prisma.division.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "Division not found");
    }

    await prisma.division.update({
      where: { id: id },
      data: {
        is_deleted: true,
      },
    });
  }
}
