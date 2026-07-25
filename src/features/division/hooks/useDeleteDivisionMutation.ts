import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DivisionApi } from "../api/division.api";
import { toast } from "sonner";

export const useDeleteDivisionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => DivisionApi.delete(id),
    onSuccess: (res) => {
      toast.success(res.message || "Division deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete division");
    },
  });
};
