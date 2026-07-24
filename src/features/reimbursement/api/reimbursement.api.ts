import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type {
  Reimbursement,
  ReimbursementCreateInput,
  ReimbursementApproveInput,
} from "../reimbursement.type";

export const ReimbursementApi = {
  getAll: async (): Promise<ApiResponse<Reimbursement[]>> => {
    const response = await axiosInstance.get<ApiResponse<Reimbursement[]>>("/reimbursements");
    return response.data;
  },

  create: async (data: ReimbursementCreateInput): Promise<ApiResponse<Reimbursement>> => {
    const response = await axiosInstance.post<ApiResponse<Reimbursement>>("/reimbursements/create", data);
    return response.data;
  },

  update: async (id: number, data: ReimbursementCreateInput): Promise<ApiResponse<Reimbursement>> => {
    const response = await axiosInstance.put<ApiResponse<Reimbursement>>(`/reimbursements/update/${id}`, data);
    return response.data;
  },

  approve: async (id: number, data: ReimbursementApproveInput): Promise<ApiResponse<Reimbursement>> => {
    const response = await axiosInstance.put<ApiResponse<Reimbursement>>(`/reimbursements/approve/${id}`, data);
    return response.data;
  },
};
