import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  JobPositionCreateRequest,
  JobPositionResponse,
  JobPositionUpdateRequest,
  toJobPositionResponse,
  toJobPositionResponseGetAll,
} from "../models/jobPosition";

export class JobPositionService {
  static async jobPositionCreate(currentUser: TokenPayload, request: JobPositionCreateRequest): Promise<JobPositionResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const createValidate = Validation.validate(UseValidation.JOB_POSITION_CREATE, request) as JobPositionCreateRequest;
    const count = await prisma.jobPosition.count({
      where: {
        position_name: createValidate.position_name,
        level: createValidate.level,
        is_deleted: false,
      },
    });

    if (count > 0) {
      throw new ResponseError(400, "Job Position already exists");
    }

    const jobPosition = await prisma.jobPosition.create({
      data: {
        position_name: createValidate.position_name,
        division_id: createValidate.division_id,
        level: createValidate.level,
        default_salary: createValidate.default_salary,
        description: createValidate.description,
      },
      include: {
        division: true,
      },
    });

    return toJobPositionResponse(jobPosition);
  }

  static async jobPositionUpdate(
    currentUser: TokenPayload,
    id: number,
    request: JobPositionUpdateRequest,
  ): Promise<JobPositionResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.JOB_POSITION_UPDATE, request) as JobPositionUpdateRequest;

    const existing = await prisma.jobPosition.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "Job Position not found");
    }

    const jobPosition = await prisma.jobPosition.update({
      where: {
        id: id,
      },
      data: {
        position_name: updateValidate.position_name,
        division_id: updateValidate.division_id,
        level: updateValidate.level,
        default_salary: updateValidate.default_salary,
        description: updateValidate.description,
      },
      include: {
        division: true,
      },
    });

    return toJobPositionResponse(jobPosition);
  }

  static async getAllJobPosition(_currentUser?: TokenPayload): Promise<JobPositionResponse[]> {
    const jobPositions = await prisma.jobPosition.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        division: true,
      },
    });

    return toJobPositionResponseGetAll(jobPositions);
  }

  static async deleteJobPosition(currentUser: TokenPayload, id: number): Promise<void> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const existing = await prisma.jobPosition.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "Job Position not found");
    }

    await prisma.jobPosition.update({
      where: { id: id },
      data: {
        is_deleted: true,
      },
    });
  }
}
