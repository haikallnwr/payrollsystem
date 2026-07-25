import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { batchPayrollSchema, type BatchPayrollFormData } from "../payroll.validation";
import { useGenerateBatchPayrollMutation } from "../hooks/useGenerateBatchPayrollMutation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, AlertCircle } from "lucide-react";

interface BatchPayrollFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function BatchPayrollFormDialog({ open, onOpenChange }: BatchPayrollFormDialogProps) {
  const generateBatchMutation = useGenerateBatchPayrollMutation();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BatchPayrollFormData>({
    resolver: zodResolver(batchPayrollSchema),
    defaultValues: {
      month: currentMonth,
      year: currentYear,
      tax_percentage: 5,
      other_deduction: 0,
      other_deduction_note: "",
    },
  });

  const selectedMonth = watch("month");

  useEffect(() => {
    if (open) {
      reset({
        month: currentMonth,
        year: currentYear,
        tax_percentage: 5,
        other_deduction: 0,
        other_deduction_note: "",
      });
    }
  }, [open, currentMonth, currentYear, reset]);

  const onSubmit = async (data: BatchPayrollFormData) => {
    const payload = {
      month: Number(data.month),
      year: Number(data.year),
      tax_percentage: Number(data.tax_percentage),
      other_deduction: data.other_deduction ? Number(data.other_deduction) : 0,
      other_deduction_note: data.other_deduction_note || undefined,
    };

    await generateBatchMutation.mutateAsync(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Run Batch Monthly Payroll</span>
          </DialogTitle>
          <DialogDescription>
            Automatically generate draft payrolls for <strong>all active employees</strong> in a single batch operation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Info Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900 flex items-start space-x-2 text-xs text-blue-800 dark:text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              Active employees without existing payrolls for this month will be created in <strong>DRAFT</strong> status. Approved reimbursements and overtimes will be locked automatically.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Month */}
            <div className="space-y-1.5">
              <Label htmlFor="month">Target Month</Label>
              <Select
                value={selectedMonth?.toString()}
                onValueChange={(val) => setValue("month", Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && <p className="text-xs text-rose-500">{errors.month.message}</p>}
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <Label htmlFor="year">Target Year</Label>
              <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
              {errors.year && <p className="text-xs text-rose-500">{errors.year.message}</p>}
            </div>
          </div>

          {/* Tax Percentage */}
          <div className="space-y-1.5">
            <Label htmlFor="tax_percentage">Default Income Tax Percentage (%)</Label>
            <Input
              id="tax_percentage"
              type="number"
              step="0.1"
              placeholder="5"
              {...register("tax_percentage", { valueAsNumber: true })}
            />
            {errors.tax_percentage && (
              <p className="text-xs text-rose-500">{errors.tax_percentage.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Other Deduction */}
            <div className="space-y-1.5">
              <Label htmlFor="other_deduction">Default Other Deduction (Rp)</Label>
              <Input
                id="other_deduction"
                type="number"
                placeholder="0"
                {...register("other_deduction", { valueAsNumber: true })}
              />
              {errors.other_deduction && (
                <p className="text-xs text-rose-500">{errors.other_deduction.message}</p>
              )}
            </div>

            {/* Deduction Note */}
            <div className="space-y-1.5">
              <Label htmlFor="other_deduction_note">Deduction Note (Optional)</Label>
              <Input
                id="other_deduction_note"
                placeholder="e.g. BPJS / Default deduction"
                {...register("other_deduction_note")}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={generateBatchMutation.isPending}
              className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-sm"
            >
              {generateBatchMutation.isPending ? "Processing Batch..." : "Run Batch Generation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
