import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type {
  Payroll,
  PayrollGenerateInput,
  PayrollStatusUpdateInput,
} from "../payroll.type";

export const PayrollApi = {
  getAll: async (): Promise<ApiResponse<Payroll[]>> => {
    const response = await axiosInstance.get<ApiResponse<Payroll[]>>("/payrolls");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Payroll>> => {
    const response = await axiosInstance.get<ApiResponse<Payroll>>(`/payrolls/${id}`);
    return response.data;
  },

  generate: async (data: PayrollGenerateInput): Promise<ApiResponse<Payroll>> => {
    const response = await axiosInstance.post<ApiResponse<Payroll>>("/payrolls/generate", data);
    return response.data;
  },

  updateStatus: async (id: number, data: PayrollStatusUpdateInput): Promise<ApiResponse<Payroll>> => {
    const response = await axiosInstance.put<ApiResponse<Payroll>>(`/payrolls/status/${id}`, data);
    return response.data;
  },
};
