import { useQuery } from "@tanstack/react-query";
import { OvertimeApi } from "../api/overtime.api";

export const OVERTIME_QUERY_KEY = ["overtimes"];

export function useOvertimesQuery() {
  return useQuery({
    queryKey: OVERTIME_QUERY_KEY,
    queryFn: async () => {
      const response = await OvertimeApi.getAll();
      return response.data || [];
    },
  });
}
