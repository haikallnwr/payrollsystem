import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OvertimeApi } from "../api/overtime.api";
import { OVERTIME_QUERY_KEY } from "./useOvertimesQuery";
import type { OvertimeCreateInput, OvertimeUpdateInput } from "../overtime.type";
import { toast } from "sonner";

export function useCreateOvertimeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OvertimeCreateInput) => OvertimeApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message || "Overtime record logged successfully");
      queryClient.invalidateQueries({ queryKey: OVERTIME_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to log overtime");
    },
  });
}

export function useUpdateOvertimeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OvertimeUpdateInput }) =>
      OvertimeApi.update(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Overtime record updated");
      queryClient.invalidateQueries({ queryKey: OVERTIME_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update overtime record");
    },
  });
}

export function useDeleteOvertimeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => OvertimeApi.delete(id),
    onSuccess: (res) => {
      toast.success(res.message || "Overtime record deleted");
      queryClient.invalidateQueries({ queryKey: OVERTIME_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete overtime record");
    },
  });
}
