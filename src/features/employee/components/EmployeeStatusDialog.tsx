import { useState } from "react";
import type { Employee, EmploymentStatus } from "../employee.type";
import { useUpdateEmployeeStatusMutation } from "../hooks/useUpdateEmployeeStatusMutation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EmployeeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EmployeeStatusDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeStatusDialogProps) {
  const updateStatusMutation = useUpdateEmployeeStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState<EmploymentStatus>(
    employee?.employment_status || "ACTIVE"
  );

  if (!employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStatusMutation.mutateAsync({
      id: employee.id,
      data: { employment_status: selectedStatus },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Update Employment Status</DialogTitle>
          <DialogDescription>
            Change status for <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.full_name}</span> ({employee.employee_code}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs font-semibold">
              Employment Status
            </Label>
            <Select
              defaultValue={employee.employment_status}
              onValueChange={(val: string) => setSelectedStatus(val as EmploymentStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="RESIGNED">Resigned</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
