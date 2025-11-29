import { useMutation } from "@tanstack/react-query";
import { gymOwnerRegistrationApi } from "./api";
import type {
  BrandingPayload,
  CompleteRegistrationPayload,
  DocumentsPayload,
  LocationsPayload,
  StepOnePayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
} from "../types";

export const useOwnerStepOneMutation = () =>
  useMutation({
    mutationFn: (payload: StepOnePayload) =>
      gymOwnerRegistrationApi.stepOne(payload),
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      gymOwnerRegistrationApi.verifyEmail(payload),
  });

export const useResendVerificationMutation = () =>
  useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      gymOwnerRegistrationApi.resendVerification(payload),
  });

export const useBrandingStepMutation = () =>
  useMutation({
    mutationFn: (payload: BrandingPayload) =>
      gymOwnerRegistrationApi.stepTwo(payload),
  });

export const useDocumentsStepMutation = () =>
  useMutation({
    mutationFn: (payload: DocumentsPayload) =>
      gymOwnerRegistrationApi.stepThree(payload),
  });

export const useLocationsStepMutation = () =>
  useMutation({
    mutationFn: (payload: LocationsPayload) =>
      gymOwnerRegistrationApi.stepFour(payload),
  });

export const useCompleteRegistrationMutation = () =>
  useMutation({
    mutationFn: (payload: CompleteRegistrationPayload) =>
      gymOwnerRegistrationApi.stepSix(payload),
  });
