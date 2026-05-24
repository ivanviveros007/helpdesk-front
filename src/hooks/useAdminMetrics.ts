"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { AdminMetrics } from "@/types/metrics";

export function useAdminMetrics() {
  return useQuery<AdminMetrics>({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminMetrics>("/tickets/admin/metrics");
      return data;
    },
    refetchInterval: 60_000,
  });
}
