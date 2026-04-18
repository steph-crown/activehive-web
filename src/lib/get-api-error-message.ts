import { isAxiosError, type AxiosError } from "axios";

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

const INVALID_CREDENTIALS_USER_MESSAGE =
  "The email or password you entered is incorrect. Please try again.";

function normalizeApiMessage(data: ApiErrorBody | undefined): string {
  const raw = data?.message;
  if (typeof raw === "string") return raw.trim();
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
    return raw[0].trim();
  }
  return "";
}

function isInvalidCredentialsAxiosError(error: AxiosError): boolean {
  const data = error.response?.data as ApiErrorBody | undefined;
  const status = error.response?.status ?? data?.statusCode ?? undefined;
  if (status !== 401) return false;
  const msg = normalizeApiMessage(data).toLowerCase();
  if (msg === "invalid credentials" || msg.includes("invalid credential")) {
    return true;
  }
  if (
    typeof data?.error === "string" &&
    data.error.toLowerCase() === "unauthorized" &&
    !msg
  ) {
    return true;
  }
  return false;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isAxiosError(error)) {
    if (isInvalidCredentialsAxiosError(error)) {
      return INVALID_CREDENTIALS_USER_MESSAGE;
    }
    const data = error.response?.data as ApiErrorBody | undefined;
    const normalized = normalizeApiMessage(data);
    if (normalized) {
      return normalized;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
