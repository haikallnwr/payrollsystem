import { useState, useMemo } from "react";
import { useOvertimesQuery } from "../hooks/useOvertimesQuery";
import { useDeleteOvertimeMutation } from "../hooks/useOvertimeMutations";
import type { Overtime } from "../overtime.type";
import { OvertimeTable } from "../components/OvertimeTable";
import { OvertimeFormDialog } from "../components/OvertimeFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Calculator, DollarSign } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function OvertimePage() {
  const { user } = useAuth();
  const { data: overtimes = [], isLoading } = useOvertimesQuery();
  const deleteMutation = useDeleteOvertimeMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<Overtime | null>(null);

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  // Summary Counters
  const totalHours = useMemo(
    () => overtimes.reduce((sum: number, o: Overtime) => sum + Number(o.hours), 0),
    [overtimes]
  );

  const totalAmount = useMemo(
    () => overtimes.reduce((sum: number, o: Overtime) => sum + Number(o.amount), 0),
    [overtimes]
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreate = () => {
    setSelectedOvertime(null);
    setIsOpen(true);
  };

  const handleEdit = (item: Overtime) => {
    setSelectedOvertime(item);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this overtime log?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Overtime Log & Tracking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track employee overtime hours and calculated compensation rates.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Overtime
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Entries</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {overtimes.length}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Logged Hours</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {totalHours} hrs
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Calculated Compensation</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <OvertimeTable
        overtimes={overtimes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <OvertimeFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        overtime={selectedOvertime}
      />
    </div>
  );
}
