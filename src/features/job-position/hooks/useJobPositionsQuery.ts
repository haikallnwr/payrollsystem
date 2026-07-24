import { useQuery } from "@tanstack/react-query";
import { JobPositionApi } from "../api/job-position.api";

export const JOB_POSITION_QUERY_KEY = ["job-positions"];

export function useJobPositionsQuery() {
  return useQuery({
    queryKey: JOB_POSITION_QUERY_KEY,
    queryFn: async () => {
      const response = await JobPositionApi.getAll();
      return response.data || [];
    },
  });
}
