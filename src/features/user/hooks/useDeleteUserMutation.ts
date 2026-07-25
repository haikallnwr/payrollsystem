import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "../api/user.api";
import { toast } from "sonner";

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UserApi.delete(id),
    onSuccess: (res) => {
      toast.success(res.message || "User account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user account");
    },
  });
};
