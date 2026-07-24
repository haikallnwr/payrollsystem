import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeApi } from "../api/employee.api";
import { EMPLOYEE_QUERY_KEY } from "./useEmployeesQuery";
import type { EmployeeStatusUpdateInput } from "../employee.type";
import { toast } from "sonner";

export function useUpdateEmployeeStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeStatusUpdateInput }) =>
      EmployeeApi.updateStatus(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Employee status updated");
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update employee status");
    },
  });
}
