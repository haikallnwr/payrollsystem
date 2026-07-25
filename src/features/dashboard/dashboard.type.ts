export interface DashboardStats {
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
}
