import { RoleUser } from "../generated/prisma/client";
import { ResponseError } from "../lib/error";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import type { TokenPayload } from "../middleware/jwt";
import {
  toUserResponse,
  toUserResponseGetAll,
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
  UserUpdatePasswordRequest,
  UserUpdateRoleRequest,
} from "../models/user";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export class UserService {
  static async userRegister(currentUser: TokenPayload, request: UserRegisterRequest): Promise<UserResponse> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const registerValidate = Validation.validate(UseValidation.USER_REGISTER, request) as UserRegisterRequest;

    const isUserExist = await prisma.user.count({
      where: {
        email: registerValidate.email,
        is_deleted: false,
      },
    });

    if (isUserExist !== 0) {
      throw new ResponseError(400, "Email already exists");
    }

    if (registerValidate.employee_id) {
      const employee = await prisma.employee.findUnique({
        where: { id: registerValidate.employee_id },
      });

      if (!employee) {
        throw new ResponseError(404, "Employee not found");
      }

      const existingLink = await prisma.user.findFirst({
        where: {
          employee: { id: registerValidate.employee_id },
          is_deleted: false,
        },
      });

      if (existingLink) {
        throw new ResponseError(400, "Employee is already linked to another user");
      }
    }

    const hashedPassword = await bcrypt.hash(registerValidate.password, 14);

    const user = await prisma.user.create({
      data: {
        email: registerValidate.email,
        password: hashedPassword,
        role: registerValidate.role || RoleUser.EMPLOYEE,
        ...(registerValidate.employee_id && {
          employee: {
            connect: {
              id: registerValidate.employee_id,
            },
          },
        }),
      },
      include: {
        employee: {
          select: {
            id: true,
            employee_code: true,
            full_name: true,
            job_position: { select: { position_name: true, division: { select: { name: true } } } },
          },
        },
      },
    });

    return toUserResponse(user);
  }

  static async userLogin(request: UserLoginRequest) {
    const loginValidate = Validation.validate(UseValidation.USER_LOGIN, request) as UserLoginRequest;

    const user = await prisma.user.findUnique({
      where: {
        email: loginValidate.email,
      },
    });

    if (!user || user.is_deleted) {
      throw new ResponseError(404, "User not found");
    }

    const checkPassword = await bcrypt.compare(loginValidate.password, user.password);

    if (!checkPassword) {
      throw new ResponseError(401, "Invalid password");
    }

    return user;
  }

  static async getMe(email: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        employee: {
          include: {
            job_position: {
              include: {
                division: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.is_deleted) {
      throw new ResponseError(404, "User not found");
    }

    return toUserResponse(user);
  }

  static async getAllUser(currentUser: TokenPayload): Promise<UserResponse[]> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const users = await prisma.user.findMany({
      where: {
        is_deleted: false,
      },
      include: {
        employee: {
          include: {
            job_position: {
              include: {
                division: true,
              },
            },
          },
        },
      },
    });

    return toUserResponseGetAll(users);
  }

  static async updateOwnPassword(
    currentUser: TokenPayload,
    request: UserUpdatePasswordRequest,
  ): Promise<UserResponse> {
    const updateValidate = Validation.validate(
      UseValidation.USER_UPDATE_PASSWORD,
      request,
    ) as UserUpdatePasswordRequest;

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user || user.is_deleted) {
      throw new ResponseError(404, "User not found");
    }

    if (updateValidate.old_password) {
      const match = await bcrypt.compare(updateValidate.old_password, user.password);
      if (!match) {
        throw new ResponseError(400, "Old password is incorrect");
      }
    }

    const newHashedPassword = await bcrypt.hash(updateValidate.new_password, 14);

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        password: newHashedPassword,
      },
      include: {
        employee: {
          include: {
            job_position: {
              include: {
                division: true,
              },
            },
          },
        },
      },
    });

    return toUserResponse(updated);
  }

  static async updateUser(
    currentUser: TokenPayload,
    id: number,
    request: UserUpdateRoleRequest,
  ): Promise<UserResponse> {
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const updateValidate = Validation.validate(UseValidation.USER_UPDATE, request) as UserUpdateRoleRequest;

    const existing = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "User not found");
    }

    let hashedPassword = existing.password;
    if (updateValidate.password) {
      hashedPassword = await bcrypt.hash(updateValidate.password, 14);
    }

    const updated = await prisma.user.update({
      where: { id: id },
      data: {
        email: updateValidate.email || existing.email,
        password: hashedPassword,
        role: currentUser.role === "ADMIN" && updateValidate.role ? updateValidate.role : existing.role,
      },
      include: {
        employee: {
          include: {
            job_position: {
              include: {
                division: true,
              },
            },
          },
        },
      },
    });

    return toUserResponse(updated);
  }

  static async deleteUser(currentUser: TokenPayload, id: number): Promise<void> {
    if (currentUser.role !== "ADMIN") {
      throw new ResponseError(403, "You are not allowed to access this resource.");
    }

    const existing = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existing || existing.is_deleted) {
      throw new ResponseError(404, "User not found");
    }

    await prisma.user.update({
      where: { id: id },
      data: {
        is_deleted: true,
      },
    });
  }
}
