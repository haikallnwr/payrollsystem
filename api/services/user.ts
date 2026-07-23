import { RoleUser } from "../generated/prisma/enums";
import { ResponseError } from "../lib/error";
import { Validation } from "../lib/validation";
import { UseValidation } from "../middleware/validation";
import { toUserResponse, toUserResponseGetAll, UserLoginRequest, UserRegisterRequest, UserResponse } from "../models/user";

import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export class UserService {
  static async userRegister(request: UserRegisterRequest): Promise<UserResponse> {
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
    if (!Object.values(RoleUser).includes(request.role)) {
      throw new ResponseError(404, "Invalid role user");
    }

    const user = await prisma.user.create({
      data: {
        email: registerValidate.email,
        password: hashedPassword,
        role: registerValidate.role,
        ...(registerValidate.employee_id && {
          connect: {
            id: registerValidate.employee_id,
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

    if (!user) {
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

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    return toUserResponse(user);
  }

  static async getAllUser(): Promise<UserResponse[]> {
    const user = await prisma.user.findMany({
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

    if (!user) {
      throw new ResponseError(400, "There is no user created");
    }
    return toUserResponseGetAll(user);
  }
}
