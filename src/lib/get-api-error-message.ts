import { isAxiosError } from "axios";

type ApiErrorBody = {
  message?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
