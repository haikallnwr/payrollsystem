import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { Division, DivisionCreateInput } from "../division.type";

export const DivisionApi = {
  getAll: async (): Promise<ApiResponse<Division[]>> => {
    const response = await axiosInstance.get<ApiResponse<Division[]>>("/divisions");
    return response.data;
  },

  create: async (data: DivisionCreateInput): Promise<ApiResponse<Division>> => {
    const response = await axiosInstance.post<ApiResponse<Division>>("/divisions/create", data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(`/divisions/delete/${id}`);
    return response.data;
  },
};
