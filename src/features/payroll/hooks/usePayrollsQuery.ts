import { useQuery } from "@tanstack/react-query";
import { PayrollApi } from "../api/payroll.api";

export const PAYROLL_QUERY_KEY = ["payrolls"];

export function usePayrollsQuery() {
  return useQuery({
    queryKey: PAYROLL_QUERY_KEY,
    queryFn: async () => {
      const response = await PayrollApi.getAll();
      return response.data || [];
    },
  });
}

export function usePayrollByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["payroll", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await PayrollApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
