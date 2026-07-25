import { prisma } from "../../lib/prisma";

export async function clearDatabase() {
  try {
    // Delete test payslips & payrolls
    await prisma.payslip.deleteMany({
      where: {
        payroll: {
          employee: {
            employee_code: { contains: "EMP-TEST" },
          },
        },
      },
    });

    await prisma.payroll.deleteMany({
      where: {
        employee: {
          employee_code: { contains: "EMP-TEST" },
        },
      },
    });

    // Delete test overtimes & reimbursements
    await prisma.overtime.deleteMany({
      where: {
        notes: { contains: "test" },
      },
    });

    await prisma.reimbursement.deleteMany({
      where: {
        title: { contains: "Test" },
      },
    });

    // Delete test employees
    await prisma.employee.deleteMany({
      where: {
        OR: [
          { employee_code: { contains: "EMP-TEST" } },
          { full_name: { contains: "Test" } },
        ],
      },
    });

    // Delete test users (starting with test. or example.com), keeping admin@company.com safe
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { startsWith: "test." } },
          { email: { endsWith: "@example.com" } },
          { email: { contains: "@test.com" } },
        ],
        NOT: [
          { email: "admin@company.com" },
        ],
      },
    });

    // Delete test divisions
    await prisma.division.deleteMany({
      where: {
        name: { startsWith: "Test-Dept-" },
      },
    });
  } catch (e) {
    console.error("Database cleanup notice:", e);
  }
}
