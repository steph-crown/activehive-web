import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "./api";
import type { Bank } from "../types";

export const paymentsQueryKeys = {
  all: ["payments"] as const,
  banks: () => [...paymentsQueryKeys.all, "banks"] as const,
};

export const useBanksQuery = () =>
  useQuery<Bank[]>({
    queryKey: paymentsQueryKeys.banks(),
    queryFn: () => paymentsApi.getBanks(),
    staleTime: 1000 * 60 * 60,
  });
