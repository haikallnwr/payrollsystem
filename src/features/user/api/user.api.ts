import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { UserItem, UserRegisterInput } from "../user.type";

export const UserApi = {
  getAll: async (): Promise<ApiResponse<UserItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<UserItem[]>>("/users");
    return response.data;
  },

  register: async (data: UserRegisterInput): Promise<ApiResponse<UserItem>> => {
    const response = await axiosInstance.post<ApiResponse<UserItem>>("/users/register", data);
    return response.data;
  },
};
