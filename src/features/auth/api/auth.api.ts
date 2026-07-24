import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { User } from "../auth.type";
import type { LoginFormData } from "../auth.validation";

export const AuthApi = {
  login: async (data: LoginFormData): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>("/users/login", data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>("/users/logout");
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return response.data;
  },
};
