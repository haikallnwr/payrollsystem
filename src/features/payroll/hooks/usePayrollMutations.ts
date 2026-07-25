import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollApi } from "../api/payroll.api";
import { PAYROLL_QUERY_KEY } from "./usePayrollsQuery";
import type { BatchPayrollStatusUpdateInput, PayrollGenerateInput, PayrollStatusUpdateInput } from "../payroll.type";
import { toast } from "sonner";

export function useGeneratePayrollMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayrollGenerateInput) => PayrollApi.generate(data),
    onSuccess: (res) => {
      toast.success(res.message || "Payroll generated successfully");
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate payroll");
    },
  });
}

export function useUpdatePayrollStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PayrollStatusUpdateInput }) =>
      PayrollApi.updateStatus(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Payroll status updated");
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update payroll status");
    },
  });
}

export function useUpdateBatchPayrollStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchPayrollStatusUpdateInput) => PayrollApi.updateBatchStatus(data),
    onSuccess: (res) => {
      toast.success(res.message || "Batch payroll status updated successfully");
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update batch payroll status");
    },
  });
}
