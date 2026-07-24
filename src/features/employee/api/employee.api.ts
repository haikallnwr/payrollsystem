import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type {
  Employee,
  EmployeeCreateInput,
  EmployeeUpdateInput,
  EmployeeStatusUpdateInput,
} from "../employee.type";

export const EmployeeApi = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    const response = await axiosInstance.get<ApiResponse<Employee[]>>("/employees");
    return response.data;
  },

  create: async (data: EmployeeCreateInput): Promise<ApiResponse<Employee>> => {
    const response = await axiosInstance.post<ApiResponse<Employee>>("/employees/create", data);
    return response.data;
  },

  update: async (id: number, data: EmployeeUpdateInput): Promise<ApiResponse<Employee>> => {
    const response = await axiosInstance.put<ApiResponse<Employee>>(`/employees/update/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: EmployeeStatusUpdateInput
  ): Promise<ApiResponse<Employee>> => {
    const response = await axiosInstance.put<ApiResponse<Employee>>(`/employees/status/${id}`, data);
    return response.data;
  },
};
