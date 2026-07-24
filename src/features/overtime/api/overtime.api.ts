import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { Overtime, OvertimeCreateInput, OvertimeUpdateInput } from "../overtime.type";

export const OvertimeApi = {
  getAll: async (): Promise<ApiResponse<Overtime[]>> => {
    const response = await axiosInstance.get<ApiResponse<Overtime[]>>("/overtimes");
    return response.data;
  },

  create: async (data: OvertimeCreateInput): Promise<ApiResponse<Overtime>> => {
    const response = await axiosInstance.post<ApiResponse<Overtime>>("/overtimes/create", data);
    return response.data;
  },

  update: async (id: number, data: OvertimeUpdateInput): Promise<ApiResponse<Overtime>> => {
    const response = await axiosInstance.put<ApiResponse<Overtime>>(`/overtimes/update/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(`/overtimes/delete/${id}`);
    return response.data;
  },
};
