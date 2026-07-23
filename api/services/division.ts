import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import { DivisionCreateRequest, DivisionResponse, toDivisionResponse } from "../models/division";

export class DivisionService {
  static async createDivision(request: DivisionCreateRequest): Promise<DivisionResponse> {
    const createValidate = Validation.validate(UseValidation.DIVISION_CREATE, request) as DivisionCreateRequest;
    const isDivisionExist = prisma.division.count({
      where: {
        name: createValidate.name,
        is_deleted: false,
      },
    });

    if (!isDivisionExist) {
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
}
