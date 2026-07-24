import type { Payroll } from "@/features/payroll/payroll.type";
import type { Payslip } from "../payslip.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Banknote, ShieldCheck } from "lucide-react";

interface PayslipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payroll: Payroll | null;
  payslip: Payslip | null;
}

export function PayslipModal({
  open,
  onOpenChange,
  payroll,
  payslip,
}: PayslipModalProps) {
  if (!payroll) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getMonthName = (m: number) => {
    const dates = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return dates[m - 1] || m;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto print:p-0 print:max-w-none print:shadow-none">
        <DialogHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Official Salary Payslip</DialogTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-slate-50 border-slate-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Payslip Card Document */}
        <div className="p-6 md:p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-slate-900 dark:text-slate-100 font-sans shadow-sm">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">PAYROLL SYSTEM INC.</h3>
                <p className="text-xs text-slate-500">Official Monthly Compensation Statement</p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {payslip?.slip_number || payroll.slip_number || "SLIP-GENERATED"}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Period: {getMonthName(payroll.month)} {payroll.year}
              </p>
            </div>
          </div>

          {/* Employee & Payment Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs">
            <div>
              <p className="text-slate-400 font-medium">EMPLOYEE DETAILS</p>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                {payroll.employee_name}
              </p>
              <p className="font-mono text-slate-500">{payroll.employee_code}</p>
            </div>

            <div className="sm:text-right">
              <p className="text-slate-400 font-medium">PAYMENT STATUS</p>
              <div className="inline-flex items-center space-x-1 font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIRMED PAID</span>
              </div>
              <p className="text-slate-500 font-mono">Issued by: {payroll.generated_by_email}</p>
            </div>
          </div>

          {/* Detailed Itemized Line Items Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Salary Structure & Breakdown
            </h4>

            <div className="space-y-2 text-xs">
              {/* Earnings Header */}
              <div className="flex justify-between items-center py-2 px-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg text-emerald-800 dark:text-emerald-300 font-bold">
                <span>EARNINGS & ALLOWANCES</span>
                <span>AMOUNT (IDR)</span>
              </div>

              <div className="flex justify-between py-1.5 px-3 border-b border-slate-100 dark:border-slate-900">
                <span className="text-slate-700 dark:text-slate-300">Base Salary</span>
                <span className="font-mono font-semibold">{formatCurrency(payroll.basic_salary)}</span>
              </div>

              {payroll.overtime_total > 0 && (
                <div className="flex justify-between py-1.5 px-3 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-700 dark:text-slate-300">Overtime Allowance</span>
                  <span className="font-mono font-semibold">+{formatCurrency(payroll.overtime_total)}</span>
                </div>
              )}

              {payroll.reimbursement_total > 0 && (
                <div className="flex justify-between py-1.5 px-3 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-700 dark:text-slate-300">Reimbursements & Expenses</span>
                  <span className="font-mono font-semibold">+{formatCurrency(payroll.reimbursement_total)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 px-3 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100">
                <span>GROSS EARNINGS</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(payroll.gross_salary)}
                </span>
              </div>

              {/* Deductions Header */}
              <div className="flex justify-between items-center py-2 px-3 mt-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-lg text-rose-800 dark:text-rose-300 font-bold">
                <span>TAX & DEDUCTIONS</span>
                <span>AMOUNT (IDR)</span>
              </div>

              <div className="flex justify-between py-1.5 px-3 border-b border-slate-100 dark:border-slate-900">
                <span className="text-slate-700 dark:text-slate-300">
                  Income Tax Deduction ({payroll.tax_percentage}%)
                </span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                  -{formatCurrency(payroll.tax)}
                </span>
              </div>

              {payroll.other_deduction > 0 && (
                <div className="flex justify-between py-1.5 px-3 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-700 dark:text-slate-300">
                    Other Deduction {payroll.other_deduction_note ? `(${payroll.other_deduction_note})` : ""}
                  </span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(payroll.other_deduction)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Net Take Home Total Summary Banner */}
          <div className="p-4 bg-blue-50/80 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                NET TAKE-HOME PAY
              </p>
              <p className="text-[11px] text-slate-500">Transferred directly to bank account</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {formatCurrency(payroll.net_salary)}
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[11px] text-slate-400 italic">
            This is a computer-generated salary payslip. No signature is required.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
