import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { JobPositionOption } from "../employee.type";

export const JobPositionApi = {
  getAll: async (): Promise<ApiResponse<JobPositionOption[]>> => {
    const response = await axiosInstance.get<ApiResponse<JobPositionOption[]>>("/jobPosition");
    return response.data;
  },
};
