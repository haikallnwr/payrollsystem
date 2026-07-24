import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { overtimeFormSchema, type OvertimeFormData } from "../overtime.validation";
import type { Overtime } from "../overtime.type";
import { useEmployeesQuery } from "@/features/employee/hooks/useEmployeesQuery";
import { useCreateOvertimeMutation, useUpdateOvertimeMutation } from "../hooks/useOvertimeMutations";
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

interface OvertimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overtime?: Overtime | null;
}

export function OvertimeFormDialog({
  open,
  onOpenChange,
  overtime,
}: OvertimeFormDialogProps) {
  const isEditing = !!overtime;
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployeesQuery();
  const createMutation = useCreateOvertimeMutation();
  const updateMutation = useUpdateOvertimeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OvertimeFormData>({
    resolver: zodResolver(overtimeFormSchema),
    defaultValues: {
      employee_id: 0,
      date: new Date().toISOString().split("T")[0],
      hours: 1,
      notes: "",
    },
  });

  useEffect(() => {
    if (overtime) {
      const formattedDate = overtime.date
        ? new Date(overtime.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        employee_id: overtime.employee_id,
        date: formattedDate,
        hours: Number(overtime.hours),
        notes: overtime.notes || "",
      });
    } else {
      reset({
        employee_id: 0,
        date: new Date().toISOString().split("T")[0],
        hours: 1,
        notes: "",
      });
    }
  }, [overtime, reset, open]);

  const onSubmit = async (data: OvertimeFormData) => {
    const payload = {
      ...data,
      employee_id: Number(data.employee_id),
      hours: Number(data.hours),
    };

    if (isEditing && overtime) {
      await updateMutation.mutateAsync({
        id: overtime.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Overtime Record" : "Log Overtime Hours"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update overtime work date, hours, or description."
              : "Record extra work hours for an employee to calculate overtime pay."}
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
              defaultValue={overtime ? String(overtime.employee_id) : undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={String(emp.id)}>
                    {emp.full_name} ({emp.employee_code}) — {emp.division_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee_id && (
              <p className="text-xs text-red-500">{errors.employee_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Overtime Date */}
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-semibold">
                Work Date *
              </Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Overtime Hours */}
            <div className="space-y-1.5">
              <Label htmlFor="hours" className="text-xs font-semibold">
                Duration (Hours) *
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                placeholder="2.5"
                {...register("hours", { valueAsNumber: true })}
              />
              {errors.hours && (
                <p className="text-xs text-red-500">{errors.hours.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              Project / Work Description
            </Label>
            <Input
              id="notes"
              placeholder="e.g. Critical release deployment & server maintenance"
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Record"
              ) : (
                "Log Overtime"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
