import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema, type UserRegisterFormData } from "../user.validation";
import { useRegisterUserMutation } from "../hooks/useRegisterUserMutation";
import { useEmployeesQuery } from "@/features/employee/hooks/useEmployeesQuery";
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
import { Loader2, ShieldCheck, User, Mail, Lock } from "lucide-react";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmployeeId?: number | null;
}

export function UserFormDialog({
  open,
  onOpenChange,
  defaultEmployeeId,
}: UserFormDialogProps) {
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployeesQuery();
  const registerMutation = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "EMPLOYEE",
      employee_id: defaultEmployeeId || undefined,
    },
  });

  const selectedEmployeeId = watch("employee_id");
  const selectedRole = watch("role");

  useEffect(() => {
    if (open) {
      reset({
        email: "",
        password: "",
        role: "EMPLOYEE",
        employee_id: defaultEmployeeId || undefined,
      });
    }
  }, [open, defaultEmployeeId, reset]);

  const onSubmit = async (data: UserRegisterFormData) => {
    const payload = {
      email: data.email,
      password: data.password,
      role: data.role,
      employee_id: data.employee_id ? Number(data.employee_id) : undefined,
    };

    await registerMutation.mutateAsync(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Create & Assign User Account</span>
          </DialogTitle>
          <DialogDescription>
            Register a system user account with login credentials and link it to an employee profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Employee Link Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Link to Employee (Optional)</span>
            </Label>
            <Select
              disabled={isLoadingEmployees}
              value={selectedEmployeeId ? String(selectedEmployeeId) : "none"}
              onValueChange={(val) => {
                if (val === "none") {
                  setValue("employee_id", undefined);
                } else {
                  const empId = Number(val);
                  setValue("employee_id", empId);
                  // Autofill email if employee name matches or is available
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee to link..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- No Employee Link (Standalone User) --</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={String(emp.id)}>
                    {emp.full_name} ({emp.employee_code}) — {emp.position_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Linking allows this employee to log in and view their personal payroll and attendance history.
            </p>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Account Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. employee@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Initial Password *</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">User System Role *</Label>
            <Select
              value={selectedRole}
              onValueChange={(val: "ADMIN" | "HR" | "EMPLOYEE") => setValue("role", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select system role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">EMPLOYEE — Standard Staff Access</SelectItem>
                <SelectItem value="HR">HR — Human Resources Access</SelectItem>
                <SelectItem value="ADMIN">ADMIN — Full System Access</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={registerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 font-medium"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register User Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
