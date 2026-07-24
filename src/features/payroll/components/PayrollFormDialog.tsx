import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { payrollGenerateSchema, type PayrollGenerateFormData } from "../payroll.validation";
import { useEmployeesQuery } from "@/features/employee/hooks/useEmployeesQuery";
import { useGeneratePayrollMutation } from "../hooks/usePayrollMutations";
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
import { Loader2 } from "lucide-react";

interface PayrollFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayrollFormDialog({ open, onOpenChange }: PayrollFormDialogProps) {
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployeesQuery();
  const generateMutation = useGeneratePayrollMutation();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PayrollGenerateFormData>({
    resolver: zodResolver(payrollGenerateSchema),
    defaultValues: {
      employee_id: 0,
      month: currentMonth,
      year: currentYear,
      tax_percentage: 5,
      other_deduction: 0,
      other_deduction_note: "",
    },
  });

  const onSubmit = async (data: PayrollGenerateFormData) => {
    const payload = {
      ...data,
      employee_id: Number(data.employee_id),
      month: Number(data.month),
      year: Number(data.year),
      tax_percentage: Number(data.tax_percentage),
      other_deduction: Number(data.other_deduction || 0),
    };

    await generateMutation.mutateAsync(payload);
    reset();
    onOpenChange(false);
  };

  const months = [
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Generate Monthly Payroll</DialogTitle>
          <DialogDescription>
            Calculate base salary, approved overtime, and reimbursements for an employee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Employee Select */}
          <div className="space-y-1.5">
            <Label htmlFor="employee_id" className="text-xs font-semibold">
              Employee *
            </Label>
            <Select
              disabled={isLoadingEmployees}
              onValueChange={(val: string) => setValue("employee_id", Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter((emp) => emp.employment_status === "ACTIVE")
                  .map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.full_name} ({emp.employee_code}) — {emp.position_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.employee_id && (
              <p className="text-xs text-red-500">{errors.employee_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Month Select */}
            <div className="space-y-1.5">
              <Label htmlFor="month" className="text-xs font-semibold">
                Target Month *
              </Label>
              <Select
                defaultValue={String(currentMonth)}
                onValueChange={(val: string) => setValue("month", Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Input */}
            <div className="space-y-1.5">
              <Label htmlFor="year" className="text-xs font-semibold">
                Target Year *
              </Label>
              <Input
                id="year"
                type="number"
                defaultValue={currentYear}
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-xs text-red-500">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tax Percentage */}
            <div className="space-y-1.5">
              <Label htmlFor="tax_percentage" className="text-xs font-semibold">
                Income Tax Rate (%) *
              </Label>
              <Input
                id="tax_percentage"
                type="number"
                step="0.1"
                placeholder="5"
                {...register("tax_percentage", { valueAsNumber: true })}
              />
              {errors.tax_percentage && (
                <p className="text-xs text-red-500">{errors.tax_percentage.message}</p>
              )}
            </div>

            {/* Custom Deduction */}
            <div className="space-y-1.5">
              <Label htmlFor="other_deduction" className="text-xs font-semibold">
                Other Deduction (IDR)
              </Label>
              <Input
                id="other_deduction"
                type="number"
                placeholder="0"
                {...register("other_deduction", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Deduction Note */}
          <div className="space-y-1.5">
            <Label htmlFor="other_deduction_note" className="text-xs font-semibold">
              Deduction Note / Reason
            </Label>
            <Input
              id="other_deduction_note"
              placeholder="e.g. Unpaid absence penalty or equipment installment"
              {...register("other_deduction_note")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={generateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={generateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calculating & Generating...
                </>
              ) : (
                "Generate Payroll"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
