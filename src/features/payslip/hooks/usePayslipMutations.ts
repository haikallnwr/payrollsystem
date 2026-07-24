import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PayslipApi } from "../api/payslip.api";
import { PAYROLL_QUERY_KEY } from "@/features/payroll/hooks/usePayrollsQuery";
import type { PayslipGenerateInput } from "../payslip.type";
import { toast } from "sonner";

export function useGeneratePayslipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayslipGenerateInput) => PayslipApi.generate(data),
    onSuccess: (res) => {
      toast.success(res.message || "Official payslip generated");
      queryClient.invalidateQueries({ queryKey: PAYROLL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate payslip");
    },
  });
}
