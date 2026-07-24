import { useQuery } from "@tanstack/react-query";
import { ReimbursementApi } from "../api/reimbursement.api";

export const REIMBURSEMENT_QUERY_KEY = ["reimbursements"];

export function useReimbursementsQuery() {
  return useQuery({
    queryKey: REIMBURSEMENT_QUERY_KEY,
    queryFn: async () => {
      const response = await ReimbursementApi.getAll();
      return response.data || [];
    },
  });
}
