import { useQuery } from "@tanstack/react-query";
import { DashboardApi } from "../api/dashboard.api";

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await DashboardApi.getStats();
      return response.data;
    },
  });
};
