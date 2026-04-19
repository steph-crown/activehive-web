import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import type {
  AuthCredentials,
  AuthResponse,
  ForgotPasswordPayload,
  RegisterResponse,
  ResetPasswordPayload,
  SignupPayload,
} from "../types";

export const useLoginMutation = () =>
  useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (payload) => authApi.login(payload),
  });

export const useSignupMutation = () =>
  useMutation<RegisterResponse, Error, SignupPayload>({
    mutationFn: async (payload) => authApi.signup(payload),
  });

export const useForgotPasswordMutation = () =>
  useMutation<unknown, Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => authApi.forgotPassword(payload),
  });

export const useResetPasswordMutation = () =>
  useMutation<unknown, Error, ResetPasswordPayload>({
    mutationFn: async (payload) => authApi.resetPassword(payload),
  });
