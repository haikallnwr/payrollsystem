import type { Payroll } from "../payroll.type";
import { PayrollStatusBadge } from "./PayrollStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Eye,
  FileCheck,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PayrollTableProps {
  payrolls: Payroll[];
  isLoading: boolean;
  canManage: boolean;
  onViewDetail: (payroll: Payroll) => void;
  onUpdateStatus: (id: number, status: "APPROVED" | "PAID" | "REJECTED") => void;
  onGeneratePayslip: (payroll: Payroll) => void;
  onViewPayslip: (payroll: Payroll) => void;
}

export function PayrollTable({
  payrolls,
  isLoading,
  canManage,
  onViewDetail,
  onUpdateStatus,
  onGeneratePayslip,
  onViewPayslip,
}: PayrollTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getMonthName = (m: number) => {
    const dates = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return dates[m - 1] || m;
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No payroll records</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No monthly payroll records generated yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
          <TableRow>
            <TableHead className="w-24 text-xs font-bold uppercase tracking-wider">Period</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Employee</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Base Salary</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Additions (OT + Reimburse)</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Deductions (Tax + Custom)</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Net Take-Home</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
            <TableHead className="w-16 text-right text-xs font-bold uppercase tracking-wider"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.map((item) => {
            const totalAdditions = Number(item.overtime_total) + Number(item.reimbursement_total);
            const totalDeductions = Number(item.tax) + Number(item.other_deduction);

            return (
              <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                {/* Period */}
                <TableCell className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {getMonthName(item.month)} {item.year}
                </TableCell>

                {/* Employee Name & Code */}
                <TableCell>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.employee_name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{item.employee_code}</div>
                </TableCell>

                {/* Basic Salary */}
                <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {formatCurrency(item.basic_salary)}
                </TableCell>

                {/* Additions */}
                <TableCell className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(totalAdditions)}
                </TableCell>

                {/* Deductions */}
                <TableCell className="font-mono text-xs font-medium text-rose-600 dark:text-rose-400">
                  -{formatCurrency(totalDeductions)}
                </TableCell>

                {/* Net Salary */}
                <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/40">
                  {formatCurrency(item.net_salary)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <PayrollStatusBadge status={item.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs">Payroll Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* View Itemized Breakdown */}
                      <DropdownMenuItem onClick={() => onViewDetail(item)}>
                        <Eye className="w-3.5 h-3.5 mr-2 text-slate-500" />
                        <span>View Breakdown</span>
                      </DropdownMenuItem>

                      {/* Management Status Transitions */}
                      {canManage && item.status === "DRAFT" && (
                        <>
                          <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "APPROVED")} className="text-blue-600">
                            <CheckCircle className="w-3.5 h-3.5 mr-2" />
                            <span>Approve Payroll</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "REJECTED")} className="text-rose-600">
                            <XCircle className="w-3.5 h-3.5 mr-2" />
                            <span>Reject Payroll</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      {canManage && item.status === "APPROVED" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "PAID")} className="text-emerald-600 font-semibold">
                          <DollarSign className="w-3.5 h-3.5 mr-2" />
                          <span>Mark as Paid</span>
                        </DropdownMenuItem>
                      )}

                      {/* Payslip Actions */}
                      {item.status === "PAID" && (
                        <>
                          <DropdownMenuSeparator />
                          {item.slip_number ? (
                            <DropdownMenuItem onClick={() => onViewPayslip(item)} className="text-blue-600 font-semibold">
                              <FileText className="w-3.5 h-3.5 mr-2" />
                              <span>View Payslip</span>
                            </DropdownMenuItem>
                          ) : (
                            canManage && (
                              <DropdownMenuItem onClick={() => onGeneratePayslip(item)} className="text-emerald-600 font-semibold">
                                <FileCheck className="w-3.5 h-3.5 mr-2" />
                                <span>Generate Payslip</span>
                              </DropdownMenuItem>
                            )
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
