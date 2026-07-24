import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { divisionFormSchema, type DivisionFormData } from "../division.validation";
import { useCreateDivisionMutation } from "../hooks/useCreateDivisionMutation";
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
}

export function DivisionFormDialog({ open, onOpenChange }: DivisionFormDialogProps) {
  const createMutation = useCreateDivisionMutation();

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

  const onSubmit = async (data: DivisionFormData) => {
    await createMutation.mutateAsync(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Division</DialogTitle>
          <DialogDescription>
            Create an organizational division (e.g. Engineering, Human Resources, Finance).
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
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
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
