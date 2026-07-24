import { useState, useMemo } from "react";
import { useReimbursementsQuery } from "../hooks/useReimbursementsQuery";
import { useApproveReimbursementMutation } from "../hooks/useReimbursementMutations";
import type { Reimbursement } from "../reimbursement.type";
import { ReimbursementTable } from "../components/ReimbursementTable";
import { ReimbursementFormDialog } from "../components/ReimbursementFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function ReimbursementPage() {
  const { user } = useAuth();
  const { data: reimbursements = [], isLoading } = useReimbursementsQuery();
  const approveMutation = useApproveReimbursementMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Reimbursement | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  // Summary Metrics
  const pendingCount = useMemo(
    () => reimbursements.filter((r: Reimbursement) => r.status === "PENDING").length,
    [reimbursements]
  );

  const approvedTotal = useMemo(
    () =>
      reimbursements
        .filter((r: Reimbursement) => r.status === "APPROVED")
        .reduce((sum: number, r: Reimbursement) => sum + Number(r.amount), 0),
    [reimbursements]
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreate = () => {
    setSelectedClaim(null);
    setIsOpen(true);
  };

  const handleEdit = (item: Reimbursement) => {
    setSelectedClaim(item);
    setIsOpen(true);
  };

  const handleApprove = async (id: number) => {
    await approveMutation.mutateAsync({
      id,
      data: { status: "APPROVED" },
    });
  };

  const handleReject = async (id: number) => {
    await approveMutation.mutateAsync({
      id,
      data: { status: "REJECTED" },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Reimbursements & Claims
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Submit and review expense reimbursement claims across your organization.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Submit Claim
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Claims</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {reimbursements.length}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Approvals</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{pendingCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Approved Amount</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(approvedTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <ReimbursementTable
        reimbursements={reimbursements}
        isLoading={isLoading}
        canManage={canManage}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Form Modal */}
      <ReimbursementFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        reimbursement={selectedClaim}
      />
    </div>
  );
}
