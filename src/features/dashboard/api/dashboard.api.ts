import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { DashboardStats } from "../dashboard.type";

export const DashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    return response.data;
  },
};
