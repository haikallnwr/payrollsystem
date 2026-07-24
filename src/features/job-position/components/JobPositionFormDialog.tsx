import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPositionFormSchema, type JobPositionFormData } from "../job-position.validation";
import type { JobPosition, JobLevel } from "../job-position.type";
import { useDivisionsQuery } from "@/features/division/hooks/useDivisionsQuery";
import { useCreateJobPositionMutation, useUpdateJobPositionMutation } from "../hooks/useJobPositionMutations";
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

interface JobPositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPosition?: JobPosition | null;
}

export function JobPositionFormDialog({
  open,
  onOpenChange,
  jobPosition,
}: JobPositionFormDialogProps) {
  const isEditing = !!jobPosition;
  const { data: divisions = [], isLoading: isLoadingDivisions } = useDivisionsQuery();
  const createMutation = useCreateJobPositionMutation();
  const updateMutation = useUpdateJobPositionMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JobPositionFormData>({
    resolver: zodResolver(jobPositionFormSchema),
    defaultValues: {
      position_name: "",
      division_id: 0,
      level: "JUNIOR",
      default_salary: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (jobPosition) {
      reset({
        position_name: jobPosition.position_name,
        division_id: jobPosition.division_id,
        level: jobPosition.level,
        default_salary: Number(jobPosition.default_salary),
        description: jobPosition.description || "",
      });
    } else {
      reset({
        position_name: "",
        division_id: 0,
        level: "JUNIOR",
        default_salary: 0,
        description: "",
      });
    }
  }, [jobPosition, reset, open]);

  const onSubmit = async (data: JobPositionFormData) => {
    const payload = {
      ...data,
      division_id: Number(data.division_id),
      default_salary: Number(data.default_salary),
    };

    if (isEditing && jobPosition) {
      await updateMutation.mutateAsync({
        id: jobPosition.id,
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
            {isEditing ? "Edit Job Position" : "Add New Job Position"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update job title, level, division assignment, and default base salary."
              : "Define a job role and assign its division and standard base salary."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Position Name */}
          <div className="space-y-1.5">
            <Label htmlFor="position_name" className="text-xs font-semibold">
              Position Title *
            </Label>
            <Input
              id="position_name"
              placeholder="e.g. Senior Backend Engineer"
              {...register("position_name")}
            />
            {errors.position_name && (
              <p className="text-xs text-red-500">{errors.position_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Division Select */}
            <div className="space-y-1.5">
              <Label htmlFor="division_id" className="text-xs font-semibold">
                Division *
              </Label>
              <Select
                disabled={isLoadingDivisions}
                onValueChange={(val: string) => setValue("division_id", Number(val))}
                defaultValue={jobPosition ? String(jobPosition.division_id) : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select division..." />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((div) => (
                    <SelectItem key={div.id} value={String(div.id)}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.division_id && (
                <p className="text-xs text-red-500">{errors.division_id.message}</p>
              )}
            </div>

            {/* Level Select */}
            <div className="space-y-1.5">
              <Label htmlFor="level" className="text-xs font-semibold">
                Job Level *
              </Label>
              <Select
                onValueChange={(val: string) => setValue("level", val as JobLevel)}
                defaultValue={jobPosition?.level || "JUNIOR"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JUNIOR">Junior</SelectItem>
                  <SelectItem value="MIDDLE">Middle</SelectItem>
                  <SelectItem value="SENIOR">Senior</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-xs text-red-500">{errors.level.message}</p>
              )}
            </div>
          </div>

          {/* Default Base Salary */}
          <div className="space-y-1.5">
            <Label htmlFor="default_salary" className="text-xs font-semibold">
              Default Base Salary (IDR) *
            </Label>
            <Input
              id="default_salary"
              type="number"
              placeholder="12000000"
              {...register("default_salary", { valueAsNumber: true })}
            />
            {errors.default_salary && (
              <p className="text-xs text-red-500">{errors.default_salary.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description
            </Label>
            <Input
              id="description"
              placeholder="e.g. Responsible for core backend services and microservices."
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
                  Saving...
                </>
              ) : isEditing ? (
                "Update Position"
              ) : (
                "Create Position"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
