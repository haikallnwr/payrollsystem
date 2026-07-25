import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { divisionFormSchema, type DivisionFormData } from "../division.validation";
import { useCreateDivisionMutation } from "../hooks/useCreateDivisionMutation";
import { useUpdateDivisionMutation } from "../hooks/useUpdateDivisionMutation";
import type { Division } from "../division.type";
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
import { Loader2 } from "lucide-react";

interface DivisionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division?: Division | null;
}

export function DivisionFormDialog({ open, onOpenChange, division }: DivisionFormDialogProps) {
  const isEditing = !!division;
  const createMutation = useCreateDivisionMutation();
  const updateMutation = useUpdateDivisionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (division) {
      reset({
        name: division.name,
        description: division.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [division, reset, open]);

  const onSubmit = async (data: DivisionFormData) => {
    if (isEditing && division) {
      await updateMutation.mutateAsync({
        id: division.id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    reset();
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Division" : "Add New Division"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update organizational division details."
              : "Create an organizational division (e.g. Engineering, Human Resources, Finance)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Division Name *
            </Label>
            <Input id="name" placeholder="e.g. Engineering" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description
            </Label>
            <Input
              id="description"
              placeholder="e.g. Technology & Product Development Division"
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
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Division"
              ) : (
                "Create Division"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
