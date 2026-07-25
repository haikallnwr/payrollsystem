import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollApi } from "../api/payroll.api";
import type { BatchPayrollGenerateInput, BatchPayrollResultResponse } from "../payroll.type";
import { toast } from "sonner";

export const useGenerateBatchPayrollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchPayrollGenerateInput) => PayrollApi.generateBatch(data),
    onSuccess: (res) => {
      const data: BatchPayrollResultResponse = res.data;
      toast.success(
        res.message ||
          `Batch Payroll Completed: ${data.createdCount} created, ${data.skippedCount} skipped out of ${data.processedCount} employees.`,
      );
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to generate batch payroll");
    },
  });
};
