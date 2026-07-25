import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DivisionApi } from "../api/division.api";
import { DIVISION_QUERY_KEY } from "./useDivisionsQuery";
import type { DivisionUpdateInput } from "../division.type";
import { toast } from "sonner";

export function useUpdateDivisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DivisionUpdateInput }) =>
      DivisionApi.update(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Division updated successfully");
      queryClient.invalidateQueries({ queryKey: DIVISION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update division");
    },
  });
}
