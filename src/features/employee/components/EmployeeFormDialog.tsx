import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, type EmployeeFormData } from "../employee.validation";
import type { Employee } from "../employee.type";
import { useJobPositionsQuery } from "../hooks/useJobPositionsQuery";
import { useCreateEmployeeMutation } from "../hooks/useCreateEmployeeMutation";
import { useUpdateEmployeeMutation } from "../hooks/useUpdateEmployeeMutation";
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

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeFormDialogProps) {
  const isEditing = !!employee;
  const { data: jobPositions = [], isLoading: isLoadingPositions } = useJobPositionsQuery();
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name: "",
      job_position_id: 0,
      phone: "",
      join_date: new Date().toISOString().split("T")[0],
      base_salary: 0,
      bank_name: "",
      bank_account: "",
    },
  });

  useEffect(() => {
    if (employee) {
      const formattedDate = employee.join_date
        ? new Date(employee.join_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        full_name: employee.full_name,
        job_position_id: employee.job_position_id,
        phone: employee.phone || "",
        join_date: formattedDate,
        base_salary: Number(employee.base_salary),
        bank_name: employee.bank_name || "",
        bank_account: employee.bank_account || "",
      });
    } else {
      reset({
        full_name: "",
        job_position_id: 0,
        phone: "",
        join_date: new Date().toISOString().split("T")[0],
        base_salary: 0,
        bank_name: "",
        bank_account: "",
      });
    }
  }, [employee, reset, open]);

  const onSubmit = async (data: EmployeeFormData) => {
    const payload = {
      ...data,
      job_position_id: Number(data.job_position_id),
      base_salary: Number(data.base_salary),
    };

    if (isEditing && employee) {
      await updateMutation.mutateAsync({
        id: employee.id,
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
      <DialogContent className="sm:max-w-135 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update employee profile, job position, and salary components."
              : "Create a new employee record in your organization directory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs font-semibold">
              Full Name *
            </Label>
            <Input
              id="full_name"
              placeholder="e.g. John Doe"
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Job Position Select */}
          <div className="space-y-1.5">
            <Label htmlFor="job_position_id" className="text-xs font-semibold">
              Job Position & Division *
            </Label>
            <Select
              disabled={isLoadingPositions}
              onValueChange={(val: string) => setValue("job_position_id", Number(val))}
              defaultValue={employee ? String(employee.job_position_id) : undefined}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.map((pos) => (
                  <SelectItem key={pos.id} value={String(pos.id)}>
                    {pos.position_name} ({pos.level}) — {pos.division_name || pos.division?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.job_position_id && (
              <p className="text-xs text-red-500">{errors.job_position_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                {...register("phone")}
              />
            </div>

            {/* Join Date */}
            <div className="space-y-1.5">
              <Label htmlFor="join_date" className="text-xs font-semibold">
                Join Date *
              </Label>
              <Input id="join_date" type="date" {...register("join_date")} />
              {errors.join_date && (
                <p className="text-xs text-red-500">{errors.join_date.message}</p>
              )}
            </div>
          </div>

          {/* Base Salary */}
          <div className="space-y-1.5">
            <Label htmlFor="base_salary" className="text-xs font-semibold">
              Base Salary (IDR) *
            </Label>
            <Input
              id="base_salary"
              type="number"
              placeholder="10000000"
              {...register("base_salary", { valueAsNumber: true })}
            />
            {errors.base_salary && (
              <p className="text-xs text-red-500">{errors.base_salary.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="space-y-1.5">
              <Label htmlFor="bank_name" className="text-xs font-semibold">
                Bank Name
              </Label>
              <Input
                id="bank_name"
                placeholder="BCA / Mandiri / BNI"
                {...register("bank_name")}
              />
            </div>

            {/* Bank Account */}
            <div className="space-y-1.5">
              <Label htmlFor="bank_account" className="text-xs font-semibold">
                Account Number
              </Label>
              <Input
                id="bank_account"
                placeholder="1234567890"
                {...register("bank_account")}
              />
            </div>
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
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
