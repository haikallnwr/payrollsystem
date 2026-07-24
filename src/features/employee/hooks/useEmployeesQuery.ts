import { useQuery } from "@tanstack/react-query";
import { EmployeeApi } from "../api/employee.api";

export const EMPLOYEE_QUERY_KEY = ["employees"];

export function useEmployeesQuery() {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEY,
    queryFn: async () => {
      const response = await EmployeeApi.getAll();
      return response.data || [];
    },
  });
}
