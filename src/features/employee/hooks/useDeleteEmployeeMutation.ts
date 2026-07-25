import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeApi } from "../api/employee.api";
import { toast } from "sonner";

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => EmployeeApi.delete(id),
    onSuccess: (res) => {
      toast.success(res.message || "Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete employee");
    },
  });
};
