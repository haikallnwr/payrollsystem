import { useQuery } from "@tanstack/react-query";
import { PayslipApi } from "../api/payslip.api";

export function usePayslipsQuery() {
  return useQuery({
    queryKey: ["payslips"],
    queryFn: async () => {
      const response = await PayslipApi.getAll();
      return response.data || [];
    },
  });
}

export function usePayslipByPayrollQuery(payrollId: number | null) {
  return useQuery({
    queryKey: ["payslip-payroll", payrollId],
    queryFn: async () => {
      if (!payrollId) return null;
      const response = await PayslipApi.getByPayrollId(payrollId);
      return response.data;
    },
    enabled: !!payrollId,
  });
}
