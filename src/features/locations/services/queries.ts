import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "./api";
import type {
  GymLocation,
  LocationDetailsResponse,
  CreateLocationPayload,
  Facility,
} from "../types";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  list: () => [...locationsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...locationsQueryKeys.all, "detail", id] as const,
  facilities: (locationId: string) =>
    [...locationsQueryKeys.all, "facilities", locationId] as const,
};

export const useLocationsQuery = () =>
  useQuery<GymLocation[]>({
    queryKey: locationsQueryKeys.list(),
    queryFn: () => locationsApi.getLocations(),
  });

export const useLocationQuery = (id: string) =>
  useQuery<LocationDetailsResponse>({
    queryKey: locationsQueryKeys.detail(id),
    queryFn: () => locationsApi.getLocationById(id),
    enabled: !!id,
  });

export const useCreateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      locationsApi.createLocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: locationsQueryKeys.all,
      });
    },
  });
};

export const useFacilitiesQuery = (locationId: string) =>
  useQuery<Facility[]>({
    queryKey: locationsQueryKeys.facilities(locationId),
    queryFn: () => locationsApi.getFacilities(locationId),
    enabled: !!locationId,
  });

export const useCreateFacilityMutation = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) =>
      locationsApi.createFacility(locationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: locationsQueryKeys.facilities(locationId),
      });
    },
  });
};

export const useUpdateFacilityMutation = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      payload,
    }: {
      facilityId: string;
      payload: FormData;
    }) => locationsApi.updateFacility(facilityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: locationsQueryKeys.facilities(locationId),
      });
    },
  });
};

export const useDeleteFacilityMutation = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facilityId: string) =>
      locationsApi.deleteFacility(facilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: locationsQueryKeys.facilities(locationId),
      });
    },
  });
};
