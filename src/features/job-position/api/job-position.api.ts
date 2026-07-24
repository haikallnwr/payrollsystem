import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { JobPosition, JobPositionCreateInput, JobPositionUpdateInput } from "../job-position.type";

export const JobPositionApi = {
  getAll: async (): Promise<ApiResponse<JobPosition[]>> => {
    const response = await axiosInstance.get<ApiResponse<JobPosition[]>>("/jobPosition");
    return response.data;
  },

  create: async (data: JobPositionCreateInput): Promise<ApiResponse<JobPosition>> => {
    const response = await axiosInstance.post<ApiResponse<JobPosition>>("/jobPosition/create", data);
    return response.data;
  },

  update: async (id: number, data: JobPositionUpdateInput): Promise<ApiResponse<JobPosition>> => {
    const response = await axiosInstance.put<ApiResponse<JobPosition>>(`/jobPosition/update/${id}`, data);
    return response.data;
  },
};
