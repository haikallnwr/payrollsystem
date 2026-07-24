import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "../api/user.api";
import { USER_QUERY_KEY } from "./useUsersQuery";
import { EMPLOYEE_QUERY_KEY } from "@/features/employee/hooks/useEmployeesQuery";
import type { UserRegisterInput } from "../user.type";
import { toast } from "sonner";

export function useRegisterUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserRegisterInput) => UserApi.register(data),
    onSuccess: (res) => {
      toast.success(res.message || "User account created successfully");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user account");
    },
  });
}
