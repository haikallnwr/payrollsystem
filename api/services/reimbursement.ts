import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import {
  ReimbursementCreateRequest,
  ReimbursementApproveRequest,
  ReimbursementResponse,
  toReimbursementResponse,
  toReimbursementResponseGetAll,
} from "../models/reimbursement";

export class ReimbursementService {
  static async createReimbursement(request: ReimbursementCreateRequest): Promise<ReimbursementResponse> {
    const createValidate = Validation.validate(UseValidation.REIMBURSEMENT_CREATE, request) as ReimbursementCreateRequest;

    const employee = await prisma.employee.findUnique({
      where: { id: createValidate.employee_id },
    });

    if (!employee) {
      throw new ResponseError(404, "Employee not found");
    }

    const reimbursement = await prisma.reimbursement.create({
      data: {
        employee_id: createValidate.employee_id,
        title: createValidate.title,
        description: createValidate.description,
        amount: createValidate.amount,
        proof_file: createValidate.proof_file,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    return toReimbursementResponse(reimbursement);
  }

  static async getAllReimbursement(): Promise<ReimbursementResponse[]> {
    const reimbursements = await prisma.reimbursement.findMany({
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    if (!reimbursements) {
      throw new ResponseError(400, "There is no reimbursement created");
    }

    return toReimbursementResponseGetAll(reimbursements);
  }

  static async updateReimbursement(id: number, request: ReimbursementCreateRequest): Promise<ReimbursementResponse> {
    const updateValidate = Validation.validate(UseValidation.REIMBURSEMENT_UPDATE, request) as ReimbursementCreateRequest;

    const existing = await prisma.reimbursement.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Reimbursement not found");
    }

    if (existing.payroll_id !== null) {
      throw new ResponseError(400, "Cannot update reimbursement that is already locked to a payroll");
    }

    const reimbursement = await prisma.reimbursement.update({
      where: { id: id },
      data: {
        title: updateValidate.title,
        description: updateValidate.description,
        amount: updateValidate.amount,
        proof_file: updateValidate.proof_file,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    return toReimbursementResponse(reimbursement);
  }

  static async approveReimbursement(id: number, approvedByUserId: number, request: ReimbursementApproveRequest): Promise<ReimbursementResponse> {
    const approveValidate = Validation.validate(UseValidation.REIMBURSEMENT_APPROVE, request) as ReimbursementApproveRequest;

    const existing = await prisma.reimbursement.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new ResponseError(404, "Reimbursement not found");
    }

    if (existing.payroll_id !== null) {
      throw new ResponseError(400, "Cannot change status of reimbursement that is already locked to a payroll");
    }

    const reimbursement = await prisma.reimbursement.update({
      where: { id: id },
      data: {
        status: approveValidate.status,
        approved_by: approvedByUserId,
        approved_at: new Date(),
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    return toReimbursementResponse(reimbursement);
  }
}
