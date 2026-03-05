import { apiClient } from "@/lib/api-client";
import type {
  ApplicationStatusResponse,
  BrandingPayload,
  CompleteRegistrationPayload,
  DocumentsPayload,
  GenericMessageResponse,
  LocationsPayload,
  ResendVerificationPayload,
  SessionStatusResponse,
  StepOnePayload,
  StepOneResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "../types";

const basePath = "/api/gym-owner-registration";

export const gymOwnerRegistrationApi = {
  stepOne: (payload: StepOnePayload) =>
    apiClient.post<StepOneResponse>(`${basePath}/step-1`, payload),

  verifyEmail: (payload: VerifyEmailPayload) =>
    apiClient.post<VerifyEmailResponse>(`${basePath}/verify-email`, payload),

  resendVerification: (payload: ResendVerificationPayload) =>
    apiClient.post<GenericMessageResponse>(
      `${basePath}/resend-verification`,
      payload
    ),

  getSessionStatus: (sessionId: string) =>
    apiClient.get<SessionStatusResponse>(
      `${basePath}/session/${sessionId}/status`
    ),

  stepTwo: ({ sessionId, primaryColor, secondaryColor, logo }: BrandingPayload) => {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("primaryColor", primaryColor);
    if (secondaryColor) {
      formData.append("secondaryColor", secondaryColor);
    }
    formData.append("logo", logo);

    return apiClient.post<GenericMessageResponse>(
      `${basePath}/step-2`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  stepThree: ({
    sessionId,
    companyRegNo,
    governmentId,
    governmentIdType,
    addressProof,
    addressProofDate,
    additionalDocuments,
  }: DocumentsPayload) => {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("companyRegNo", companyRegNo);
    formData.append("governmentId", governmentId);
    formData.append("governmentIdType", governmentIdType);
    formData.append("addressProof", addressProof);
    formData.append("addressProofDate", addressProofDate);

    additionalDocuments?.forEach((file) => {
      formData.append("additionalDocuments", file);
    });

    return apiClient.post<GenericMessageResponse>(
      `${basePath}/step-3`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  stepFour: ({
    sessionId,
    hasMultipleLocations,
    locations,
    coverImage,
  }: LocationsPayload) => {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("hasMultipleLocations", String(hasMultipleLocations));
    formData.append("locations", JSON.stringify(locations));

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    return apiClient.post<GenericMessageResponse>(`${basePath}/step-4`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  stepSix: (payload: CompleteRegistrationPayload) =>
    apiClient.post<GenericMessageResponse>(`${basePath}/step-6`, payload),

  getApplicationStatus: (sessionId: string) =>
    apiClient.get<ApplicationStatusResponse>(
      `${basePath}/application/${sessionId}/status`
    ),
};
