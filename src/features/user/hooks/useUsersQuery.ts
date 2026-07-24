import { useQuery } from "@tanstack/react-query";
import { UserApi } from "../api/user.api";

export const USER_QUERY_KEY = ["users"];

export function useUsersQuery() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await UserApi.getAll();
      return response.data || [];
    },
  });
}
