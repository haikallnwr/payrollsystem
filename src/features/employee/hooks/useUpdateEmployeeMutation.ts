import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeApi } from "../api/employee.api";
import { EMPLOYEE_QUERY_KEY } from "./useEmployeesQuery";
import type { EmployeeUpdateInput } from "../employee.type";
import { toast } from "sonner";

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateInput }) =>
      EmployeeApi.update(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update employee");
    },
  });
}
