import { prisma } from "../../lib/prisma";

export async function clearDatabase() {
  try {
    // 1. Delete test payslips
    await prisma.payslip.deleteMany({
      where: {
        payroll: {
          employee: {
            employee_code: { contains: "EMP-TEST" },
          },
        },
      },
    });

    // 2. Delete test payrolls (both by employee code AND by generator email)
    await prisma.payroll.deleteMany({
      where: {
        OR: [
          { employee: { employee_code: { contains: "EMP-TEST" } } },
          { generator: { email: { startsWith: "test." } } },
          { generator: { email: { endsWith: "@example.com" } } },
        ],
      },
    });

    // 3. Delete test overtimes & reimbursements
    await prisma.overtime.deleteMany({
      where: {
        OR: [
          { employee: { employee_code: { contains: "EMP-TEST" } } },
          { notes: { contains: "test" } },
        ],
      },
    });

    await prisma.reimbursement.deleteMany({
      where: {
        OR: [
          { employee: { employee_code: { contains: "EMP-TEST" } } },
          { title: { contains: "Test" } },
        ],
      },
    });

    // 4. Delete test employees
    await prisma.employee.deleteMany({
      where: {
        OR: [
          { employee_code: { contains: "EMP-TEST" } },
          { full_name: { contains: "Test" } },
          { user: { email: { startsWith: "test." } } },
        ],
      },
    });

    // 5. Delete test users
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

    // 6. Delete test job positions & divisions
    await prisma.jobPosition.deleteMany({
      where: {
        OR: [
          { position_name: { startsWith: "Test" } },
          { division: { name: { startsWith: "Test-Dept-" } } },
        ],
      },
    });

    await prisma.division.deleteMany({
      where: {
        name: { startsWith: "Test-Dept-" },
      },
    });
  } catch (e) {
    // Ignore cleanup errors
  }
}
