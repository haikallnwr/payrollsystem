import { useQuery } from "@tanstack/react-query";
import { DivisionApi } from "../api/division.api";

export const DIVISION_QUERY_KEY = ["divisions"];

export function useDivisionsQuery() {
  return useQuery({
    queryKey: DIVISION_QUERY_KEY,
    queryFn: async () => {
      const response = await DivisionApi.getAll();
      return response.data || [];
    },
  });
}
