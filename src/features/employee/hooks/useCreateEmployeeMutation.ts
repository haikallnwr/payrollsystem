import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeApi } from "../api/employee.api";
import { EMPLOYEE_QUERY_KEY } from "./useEmployeesQuery";
import type { EmployeeCreateInput } from "../employee.type";
import { toast } from "sonner";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeCreateInput) => EmployeeApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message || "Employee created successfully");
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create employee");
    },
  });
}
