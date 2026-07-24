import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import { JobPositionCreateRequest, JobPositionResponse, JobPositionUpdateRequest, toJobPositionResponse, toJobPositionResponseGetAll } from "../models/jobPosition";

export class JobPositionService {
  static async jobPositionCreate(request: JobPositionCreateRequest): Promise<JobPositionResponse> {
    const createValidate = Validation.validate(UseValidation.JOB_POSITION_CREATE, request) as JobPositionCreateRequest;
    const isJobPositionExist = prisma.jobPosition.count({
      where: {
        position_name: createValidate.position_name,
        level: createValidate.level,
      },
    });

    if (!isJobPositionExist) {
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

  static async jobPositionUpdate(id: number, request: JobPositionUpdateRequest): Promise<JobPositionResponse> {
    const updateValidate = Validation.validate(UseValidation.JOB_POSITION_UPDATE, request) as JobPositionUpdateRequest;

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

    if (!jobPosition) {
      throw new ResponseError(400, "Invalid Request");
    }

    return toJobPositionResponse(jobPosition);
  }

  static async getAllJobPosition(): Promise<JobPositionResponse[]> {
    const jobPosition = await prisma.jobPosition.findMany({
      include: {
        division: true,
      },
    });

    if (!jobPosition) {
      throw new ResponseError(400, "There is no job position created");
    }
    return toJobPositionResponseGetAll(jobPosition);
  }
}
