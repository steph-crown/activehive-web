import { apiClient } from "@/lib/api-client";
import type { Bank, ResolvedAccount } from "../types";

const paymentsPath = "/api/payments";

export const paymentsApi = {
  getBanks: (): Promise<Bank[]> =>
    apiClient
      .get<{ data: Bank[] }>(`${paymentsPath}/banks`)
      .then((r) => r.data),

  resolveAccount: (
    accountNumber: string,
    bankCode: string,
  ): Promise<ResolvedAccount> =>
    apiClient
      .post<{ data: ResolvedAccount }>(`${paymentsPath}/banks/resolve`, {
        accountNumber,
        bankCode,
      })
      .then((r) => r.data),
};
