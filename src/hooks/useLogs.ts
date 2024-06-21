import { api } from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useLogs = () => {
  return {
    getAll: () => {
      return useQuery({
        queryKey: [`logs`],
        placeholderData: keepPreviousData,
        queryFn: async () =>
          await api.get("/logs").then((result) => result.data),
      });
    },
    getOne: (pid?: string | null) =>
      useQuery({
        enabled: !!pid,
        queryKey: [`logs-${pid}`, pid],
        queryFn: async () => {
          return await api.get(`logs/${pid}`);
        },
      }),
  };
};
