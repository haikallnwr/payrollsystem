import { prisma } from "../lib/prisma";
import type { TokenPayload } from "../middleware/jwt";

export type DashboardStatsResponse = {
  totalEmployees: number;
  monthlyPayroll: {
    amount: number;
    periodLabel: string;
  };
  pendingClaims: number;
  overtimeHours: number;
  recentPayrolls: Array<{
    id: number;
    month: number;
    year: number;
    employeeName: string;
    netSalary: number;
    status: string;
  }>;
  recentReimbursements: Array<{
    id: number;
    title: string;
    employeeName: string;
    amount: number;
    status: string;
  }>;
};

export class DashboardService {
  static async getDashboardStats(currentUser: TokenPayload): Promise<DashboardStatsResponse> {
    const isEmployeeRole = currentUser.role === "EMPLOYEE";

    let userEmployeeId: number | null = null;
    if (isEmployeeRole) {
      const userEmployee = await prisma.employee.findFirst({
        where: { user_id: currentUser.id },
      });
      userEmployeeId = userEmployee?.id || null;
    }

    // 1. Total Employees
    const totalEmployees = await prisma.employee.count({
      where: { is_deleted: false },
    });

    // 2. Pending Reimbursement Claims
    const pendingClaimsWhere = isEmployeeRole && userEmployeeId
      ? { employee_id: userEmployeeId, status: "PENDING" as const }
      : { status: "PENDING" as const };
    const pendingClaims = await prisma.reimbursement.count({
      where: pendingClaimsWhere,
    });

    // 3. Overtime Hours
    const overtimeWhere = isEmployeeRole && userEmployeeId
      ? { employee_id: userEmployeeId }
      : {};
    const overtimeSum = await prisma.overtime.aggregate({
      where: overtimeWhere,
      _sum: {
        hours: true,
      },
    });
    const overtimeHours = Number(overtimeSum._sum.hours || 0);

    // 4. Monthly Payroll Amount
    const payrollWhere = isEmployeeRole && userEmployeeId
      ? { employee_id: userEmployeeId }
      : {};

    const latestPayroll = await prisma.payroll.findFirst({
      where: payrollWhere,
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    let monthlyPayrollAmount = 0;
    let periodLabel = "No payroll records";

    if (latestPayroll) {
      const periodPayrolls = await prisma.payroll.aggregate({
        where: {
          ...payrollWhere,
          month: latestPayroll.month,
          year: latestPayroll.year,
        },
        _sum: {
          net_salary: true,
        },
      });

      monthlyPayrollAmount = Number(periodPayrolls._sum.net_salary || 0);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      periodLabel = `${monthNames[latestPayroll.month - 1]} ${latestPayroll.year}`;
    }

    // 5. Recent Payrolls
    const recentPayrollsList = await prisma.payroll.findMany({
      where: payrollWhere,
      take: 5,
      orderBy: [{ year: "desc" }, { month: "desc" }, { created_at: "desc" }],
      include: {
        employee: { select: { full_name: true } },
      },
    });

    const recentPayrolls = recentPayrollsList.map((p) => ({
      id: p.id,
      month: p.month,
      year: p.year,
      employeeName: p.employee.full_name,
      netSalary: Number(p.net_salary),
      status: p.status,
    }));

    // 6. Recent Reimbursements
    const recentReimbursementsList = await prisma.reimbursement.findMany({
      where: isEmployeeRole && userEmployeeId ? { employee_id: userEmployeeId } : {},
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        employee: { select: { full_name: true } },
      },
    });

    const recentReimbursements = recentReimbursementsList.map((r) => ({
      id: r.id,
      title: r.title,
      employeeName: r.employee.full_name,
      amount: Number(r.amount),
      status: r.status,
    }));

    return {
      totalEmployees,
      monthlyPayroll: {
        amount: monthlyPayrollAmount,
        periodLabel,
      },
      pendingClaims,
      overtimeHours,
      recentPayrolls,
      recentReimbursements,
    };
  }
}
