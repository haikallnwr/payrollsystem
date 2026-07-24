import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { Payslip, PayslipGenerateInput } from "../payslip.type";

export const PayslipApi = {
  getAll: async (): Promise<ApiResponse<Payslip[]>> => {
    const response = await axiosInstance.get<ApiResponse<Payslip[]>>("/payslips");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Payslip>> => {
    const response = await axiosInstance.get<ApiResponse<Payslip>>(`/payslips/${id}`);
    return response.data;
  },

  getByPayrollId: async (payrollId: number): Promise<ApiResponse<Payslip>> => {
    const response = await axiosInstance.get<ApiResponse<Payslip>>(`/payslips/payroll/${payrollId}`);
    return response.data;
  },

  generate: async (data: PayslipGenerateInput): Promise<ApiResponse<Payslip>> => {
    const response = await axiosInstance.post<ApiResponse<Payslip>>("/payslips/generate", data);
    return response.data;
  },
};
