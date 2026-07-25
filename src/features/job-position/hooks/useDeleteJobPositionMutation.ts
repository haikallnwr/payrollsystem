import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JobPositionApi } from "../api/job-position.api";
import { toast } from "sonner";

export const useDeleteJobPositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => JobPositionApi.delete(id),
    onSuccess: (res) => {
      toast.success(res.message || "Job position deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete job position");
    },
  });
};
