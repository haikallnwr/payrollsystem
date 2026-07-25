import { useState, useMemo } from "react";
import { usePayrollsQuery } from "../hooks/usePayrollsQuery";
import {
  useUpdatePayrollStatusMutation,
  useUpdateBatchPayrollStatusMutation,
} from "../hooks/usePayrollMutations";
import { useGeneratePayslipMutation } from "@/features/payslip/hooks/usePayslipMutations";
import type { Payroll, PayrollStatus } from "../payroll.type";
import type { Payslip } from "@/features/payslip/payslip.type";
import { PayrollTable } from "../components/PayrollTable";
import { PayrollFormDialog } from "../components/PayrollFormDialog";
import { BatchPayrollFormDialog } from "../components/BatchPayrollFormDialog";
import { PayrollDetailModal } from "../components/PayrollDetailModal";
import { PayslipModal } from "@/features/payslip/components/PayslipModal";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Calculator, Clock, Filter, Zap, CheckCircle, XCircle, Loader2 } from "lucide-react";
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
  const updateBatchStatusMutation = useUpdateBatchPayrollStatusMutation();
  const generatePayslipMutation = useGeneratePayslipMutation();

  // Filter States
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Dialog & Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
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

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectable = filteredPayrolls
        .filter((p) => {
          if (p.status === "PAID") return false;
          if (user?.role === "HR" && user?.employee?.id && p.employee_id === user.employee.id) return false;
          return true;
        })
        .map((p) => p.id);
      setSelectedIds(selectable);
    } else {
      setSelectedIds([]);
    }
  };

  const handleBatchUpdateStatus = async (status: PayrollStatus) => {
    if (selectedIds.length === 0) return;
    await updateBatchStatusMutation.mutateAsync({
      payroll_ids: selectedIds,
      status,
    });
    setSelectedIds([]);
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
          <div className="flex items-center space-x-2 shrink-0">
            <Button
              onClick={() => setIsBatchFormOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-medium shadow-xs"
            >
              <Zap className="w-4 h-4 mr-2 fill-emerald-200" />
              Run Batch Payroll
            </Button>
            <Button
              onClick={handleCreate}
              variant="outline"
              className="rounded-full border-emerald-800/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Single Payroll
            </Button>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-lg">
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

      {/* Status Filter Bar & Batch Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500">Filter by Status:</span>
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setSelectedIds([]); }}>
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

        {/* Bulk Action Controls */}
        {canManage && selectedIds.length > 0 && (
          <div className="flex items-center space-x-2  rounded-lg shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
            <span className="text-xs font-bold text-slate-600 px-2">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="h-4 w-px bg-slate-600" />
            <Button
              size="sm"
              disabled={updateBatchStatusMutation.isPending}
              onClick={() => handleBatchUpdateStatus("APPROVED")}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-2xs"
            >
              {updateBatchStatusMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              )}
              Approve Selected
            </Button>
            <Button
              size="sm"
              disabled={updateBatchStatusMutation.isPending}
              onClick={() => handleBatchUpdateStatus("PAID")}
              className="h-8 text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-medium shadow-2xs"
            >
              {updateBatchStatusMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              )}
              Mark Selected as Paid
            </Button>
            <Button
              size="sm"
              disabled={updateBatchStatusMutation.isPending}
              onClick={() => handleBatchUpdateStatus("REJECTED")}
              className="h-8 text-xs bg-rose-700 hover:bg-rose-800 text-white font-medium shadow-2xs"
            >
              {updateBatchStatusMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
              )}
              Reject Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Main Payroll Table */}
      <PayrollTable
        payrolls={filteredPayrolls}
        isLoading={isLoading}
        canManage={canManage}
        userRole={user?.role}
        currentEmployeeId={user?.employee?.id}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
        onGeneratePayslip={handleGeneratePayslip}
        onViewPayslip={handleViewPayslip}
      />

      {/* Modals */}
      <PayrollFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      <BatchPayrollFormDialog open={isBatchFormOpen} onOpenChange={setIsBatchFormOpen} />

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
