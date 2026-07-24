import { useState, useMemo } from "react";
import { usePayrollsQuery } from "../hooks/usePayrollsQuery";
import { useUpdatePayrollStatusMutation } from "../hooks/usePayrollMutations";
import { useGeneratePayslipMutation } from "@/features/payslip/hooks/usePayslipMutations";
import type { Payroll } from "../payroll.type";
import type { Payslip } from "@/features/payslip/payslip.type";
import { PayrollTable } from "../components/PayrollTable";
import { PayrollFormDialog } from "../components/PayrollFormDialog";
import { PayrollDetailModal } from "../components/PayrollDetailModal";
import { PayslipModal } from "@/features/payslip/components/PayslipModal";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Calculator, Clock, Filter } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PayrollPage() {
  const { user } = useAuth();
  const { data: payrolls = [], isLoading } = usePayrollsQuery();
  const updateStatusMutation = useUpdatePayrollStatusMutation();
  const generatePayslipMutation = useGeneratePayslipMutation();

  // Filter States
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog & Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  // Filtered Payrolls
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p: Payroll) => {
      return statusFilter === "ALL" || p.status === statusFilter;
    });
  }, [payrolls, statusFilter]);

  // Executive Summary Metrics
  const totalNetDisbursed = useMemo(
    () =>
      payrolls
        .filter((p: Payroll) => p.status === "PAID")
        .reduce((sum: number, p: Payroll) => sum + Number(p.net_salary), 0),
    [payrolls]
  );

  const pendingApprovalsCount = useMemo(
    () => payrolls.filter((p: Payroll) => p.status === "DRAFT").length,
    [payrolls]
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreate = () => {
    setSelectedPayroll(null);
    setIsFormOpen(true);
  };

  const handleViewDetail = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (
    id: number,
    status: "APPROVED" | "PAID" | "REJECTED"
  ) => {
    await updateStatusMutation.mutateAsync({
      id,
      data: { status },
    });
  };

  const handleGeneratePayslip = async (payroll: Payroll) => {
    await generatePayslipMutation.mutateAsync({ payroll_id: payroll.id });
  };

  const handleViewPayslip = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setSelectedPayslip({
      id: 0,
      payroll_id: payroll.id,
      slip_number: payroll.slip_number || "SLIP-GENERATED",
      generated_at: new Date().toISOString(),
      employee_name: payroll.employee_name,
      employee_code: payroll.employee_code,
      month: payroll.month,
      year: payroll.year,
      net_salary: payroll.net_salary,
    });
    setIsPayslipOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Payroll Processing & Payslips
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate employee monthly compensation, approve disbursements, and issue payslips.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Payroll
          </Button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Runs</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{payrolls.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Drafts</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {pendingApprovalsCount}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Net Disbursed</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalNetDisbursed)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-500">Filter by Status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-9 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Payroll Table */}
      <PayrollTable
        payrolls={filteredPayrolls}
        isLoading={isLoading}
        canManage={canManage}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
        onGeneratePayslip={handleGeneratePayslip}
        onViewPayslip={handleViewPayslip}
      />

      {/* Modals */}
      <PayrollFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      <PayrollDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        payroll={selectedPayroll}
      />

      <PayslipModal
        open={isPayslipOpen}
        onOpenChange={setIsPayslipOpen}
        payroll={selectedPayroll}
        payslip={selectedPayslip}
      />
    </div>
  );
}
