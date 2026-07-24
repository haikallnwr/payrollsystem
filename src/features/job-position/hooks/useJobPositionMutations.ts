import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JobPositionApi } from "../api/job-position.api";
import { JOB_POSITION_QUERY_KEY } from "./useJobPositionsQuery";
import type { JobPositionCreateInput, JobPositionUpdateInput } from "../job-position.type";
import { toast } from "sonner";

export function useCreateJobPositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobPositionCreateInput) => JobPositionApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message || "Job position created successfully");
      queryClient.invalidateQueries({ queryKey: JOB_POSITION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create job position");
    },
  });
}

export function useUpdateJobPositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobPositionUpdateInput }) =>
      JobPositionApi.update(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Job position updated successfully");
      queryClient.invalidateQueries({ queryKey: JOB_POSITION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update job position");
    },
  });
}
