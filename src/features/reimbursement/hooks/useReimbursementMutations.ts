import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReimbursementApi } from "../api/reimbursement.api";
import { REIMBURSEMENT_QUERY_KEY } from "./useReimbursementsQuery";
import type { ReimbursementCreateInput, ReimbursementApproveInput } from "../reimbursement.type";
import { toast } from "sonner";

export function useCreateReimbursementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReimbursementCreateInput) => ReimbursementApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message || "Reimbursement claim submitted");
      queryClient.invalidateQueries({ queryKey: REIMBURSEMENT_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit claim");
    },
  });
}

export function useUpdateReimbursementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReimbursementCreateInput }) =>
      ReimbursementApi.update(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Reimbursement claim updated");
      queryClient.invalidateQueries({ queryKey: REIMBURSEMENT_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update claim");
    },
  });
}

export function useApproveReimbursementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReimbursementApproveInput }) =>
      ReimbursementApi.approve(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Reimbursement status updated");
      queryClient.invalidateQueries({ queryKey: REIMBURSEMENT_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update claim status");
    },
  });
}
