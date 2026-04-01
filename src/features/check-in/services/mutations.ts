import { useMutation } from "@tanstack/react-query";
import { checkInsApi } from "./api";
import type { CreateCheckInPayload } from "../types";

export const useCreateCheckInMutation = () =>
  useMutation({
    mutationFn: (payload: CreateCheckInPayload) => checkInsApi.create(payload),
  });
