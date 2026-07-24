import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reimbursementFormSchema, type ReimbursementFormData } from "../reimbursement.validation";
import type { Reimbursement } from "../reimbursement.type";
import { useEmployeesQuery } from "@/features/employee/hooks/useEmployeesQuery";
import { useCreateReimbursementMutation, useUpdateReimbursementMutation } from "../hooks/useReimbursementMutations";
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

interface ReimbursementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reimbursement?: Reimbursement | null;
}

export function ReimbursementFormDialog({
  open,
  onOpenChange,
  reimbursement,
}: ReimbursementFormDialogProps) {
  const isEditing = !!reimbursement;
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployeesQuery();
  const createMutation = useCreateReimbursementMutation();
  const updateMutation = useUpdateReimbursementMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReimbursementFormData>({
    resolver: zodResolver(reimbursementFormSchema),
    defaultValues: {
      employee_id: 0,
      title: "",
      description: "",
      amount: 0,
      proof_file: "",
    },
  });

  useEffect(() => {
    if (reimbursement) {
      reset({
        employee_id: reimbursement.employee_id,
        title: reimbursement.title,
        description: reimbursement.description || "",
        amount: Number(reimbursement.amount),
        proof_file: reimbursement.proof_file || "",
      });
    } else {
      reset({
        employee_id: 0,
        title: "",
        description: "",
        amount: 0,
        proof_file: "",
      });
    }
  }, [reimbursement, reset, open]);

  const onSubmit = async (data: ReimbursementFormData) => {
    const payload = {
      ...data,
      employee_id: Number(data.employee_id),
      amount: Number(data.amount),
    };

    if (isEditing && reimbursement) {
      await updateMutation.mutateAsync({
        id: reimbursement.id,
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
            {isEditing ? "Edit Claim Request" : "Submit Reimbursement Claim"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify claim title, amount, or employee assignment."
              : "Submit a new business expense or medical claim request."}
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
              defaultValue={reimbursement ? String(reimbursement.employee_id) : undefined}
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

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Claim Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Client Dinner Expense / Travel Ticket"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-semibold">
              Claim Amount (IDR) *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="450000"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description / Details
            </Label>
            <Input
              id="description"
              placeholder="e.g. Taxi fare and team dinner receipt attached."
              {...register("description")}
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
                  Submitting...
                </>
              ) : isEditing ? (
                "Update Claim"
              ) : (
                "Submit Claim"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
