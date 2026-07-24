import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DivisionApi } from "../api/division.api";
import { DIVISION_QUERY_KEY } from "./useDivisionsQuery";
import type { DivisionCreateInput } from "../division.type";
import { toast } from "sonner";

export function useCreateDivisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DivisionCreateInput) => DivisionApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message || "Division created successfully");
      queryClient.invalidateQueries({ queryKey: DIVISION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create division");
    },
  });
}
