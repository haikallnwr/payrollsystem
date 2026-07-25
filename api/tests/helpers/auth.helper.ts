import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../middleware/jwt";
import type { RoleUser } from "../../generated/prisma/client";

export interface CreateTestUserOptions {
  email?: string;
  password?: string;
  role?: RoleUser;
  fullName?: string;
  employeeCode?: string;
  createEmployeeProfile?: boolean;
}

/**
 * Creates temporary test user (with test. prefix for auto-cleanup)
 */
export async function createTestUser(options: CreateTestUserOptions = {}) {
  const email = options.email || `test.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;
  const rawPassword = options.password || "Password123!";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  const role = options.role || "ADMIN";

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  let employee = null;

  if (options.createEmployeeProfile || role === "EMPLOYEE" || role === "HR") {
    let division = await prisma.division.findFirst({ where: { is_deleted: false } });
    if (!division) {
      division = await prisma.division.create({
        data: { name: `Test-Dept-${Date.now()}` },
      });
    }

    let position = await prisma.jobPosition.findFirst({ where: { is_deleted: false } });
    if (!position) {
      position = await prisma.jobPosition.create({
        data: {
          division_id: division.id,
          position_name: "Test Staff",
          level: "JUNIOR",
          default_salary: 5000000,
        },
      });
    }

    const employeeCode = options.employeeCode || `EMP-TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    employee = await prisma.employee.create({
      data: {
        user_id: user.id,
        employee_code: employeeCode,
        job_position_id: position.id,
        full_name: options.fullName || "Test Employee",
        join_date: new Date(),
        base_salary: 6000000,
        employment_status: "ACTIVE",
      },
    });
  }

  const token = generateToken(user);
  const cookieHeader = `token=${token}`;

  return {
    user,
    employee,
    rawPassword,
    token,
    cookieHeader,
  };
}
