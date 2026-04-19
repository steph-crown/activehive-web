import { apiClient } from "@/lib/api-client";
import type {
  AuthCredentials,
  AuthResponse,
  ForgotPasswordPayload,
  RegisterResponse,
  ResetPasswordPayload,
  SignupPayload,
} from "../types";

const basePath = "/api/auth";

export const authApi = {
  login: (payload: AuthCredentials): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(`${basePath}/login`, payload),
  signup: (payload: SignupPayload): Promise<RegisterResponse> =>
    apiClient.post<RegisterResponse>(`${basePath}/register`, payload),
  forgotPassword: (payload: ForgotPasswordPayload): Promise<unknown> =>
    apiClient.post<unknown>(`${basePath}/forgot-password`, payload),
  resetPassword: (payload: ResetPasswordPayload): Promise<unknown> =>
    apiClient.post<unknown>(`${basePath}/reset-password`, payload),
};
