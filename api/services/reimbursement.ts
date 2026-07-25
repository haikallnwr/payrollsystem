import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  ReimbursementCreateRequest,
  ReimbursementApproveRequest,
  ReimbursementResponse,
  toReimbursementResponse,
  toReimbursementResponseGetAll,
} from "../models/reimbursement";

export class ReimbursementService {
  static async createReimbursement(currentUser: TokenPayload, request: ReimbursementCreateRequest): Promise<ReimbursementResponse> {
    const createValidate = Validation.validate(UseValidation.REIMBURSEMENT_CREATE, request) as ReimbursementCreateRequest;

    const userEmployee = await prisma.employee.findFirst({
      where: { user_id: currentUser.id },
    });

    if (currentUser.role === "EMPLOYEE") {
      if (!userEmployee) {
        throw new ResponseError(400, "Your user account is not linked to an employee profile.");
      }
      if (createValidate.employee_id && createValidate.employee_id !== userEmployee.id) {
        throw new ResponseError(403, "You are not allowed to access this resource.");
      }
      createValidate.employee_id = userEmployee.id;
    }

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

  static async getAllReimbursement(currentUser: TokenPayload): Promise<ReimbursementResponse[]> {
    let whereClause = {};

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee) {
        return [];
      }

      whereClause = { employee_id: userEmployee.id };
    }

    const reimbursements = await prisma.reimbursement.findMany({
      where: whereClause,
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    return toReimbursementResponseGetAll(reimbursements);
  }

  static async updateReimbursement(currentUser: TokenPayload, id: number, request: ReimbursementCreateRequest): Promise<ReimbursementResponse> {
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

    if (currentUser.role === "EMPLOYEE") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (!userEmployee || existing.employee_id !== userEmployee.id) {
        throw new ResponseError(403, "You are not allowed to access this resource.");
      }
    }

    const reimbursement = await prisma.reimbursement.update({
      where: { id: id },
      data: {
        title: updateValidate.title || existing.title,
        description: updateValidate.description,
        amount: updateValidate.amount || existing.amount,
        proof_file: updateValidate.proof_file,
      },
      include: {
        employee: { select: { full_name: true, employee_code: true } },
        approver: { select: { email: true } },
      },
    });

    return toReimbursementResponse(reimbursement);
  }

  static async approveReimbursement(
    currentUser: TokenPayload,
    id: number,
    request: ReimbursementApproveRequest,
  ): Promise<ReimbursementResponse> {
    if (currentUser.role === "EMPLOYEE") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

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

    // HR Self-Processing Rule: HR cannot approve or reject their own reimbursement
    if (currentUser.role === "HR") {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });

      if (userEmployee && userEmployee.id === existing.employee_id) {
        throw new ResponseError(403, "You cannot approve your own reimbursement.");
      }
    }

    const reimbursement = await prisma.reimbursement.update({
      where: { id: id },
      data: {
        status: approveValidate.status,
        approved_by: currentUser.id,
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
