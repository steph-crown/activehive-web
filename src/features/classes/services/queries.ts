import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi } from "./api";
import type {
  Class,
  ClassTemplate,
  CreateClassPayload,
  UpdateClassPayload,
  CreateTemplatePayload,
  UseTemplatePayload,
  AssignTrainerPayload,
  ReuseClassPayload,
} from "../types";

export const classesQueryKeys = {
  all: ["classes"] as const,
  list: (locationId?: string) => [...classesQueryKeys.all, "list", locationId] as const,
  detail: (id: string) => [...classesQueryKeys.all, "detail", id] as const,
  templates: () => [...classesQueryKeys.all, "templates"] as const,
  report: (id: string) => [...classesQueryKeys.all, "report", id] as const,
};

export const useClassesQuery = (locationId?: string) =>
  useQuery<Class[]>({
    queryKey: classesQueryKeys.list(locationId),
    queryFn: () => classesApi.getClasses(locationId),
  });

export const useClassQuery = (id: string) =>
  useQuery<Class>({
    queryKey: classesQueryKeys.detail(id),
    queryFn: () => classesApi.getClassById(id),
    enabled: !!id,
  });

export const useCreateClassMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) =>
      classesApi.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
    },
  });
};

export const useUpdateClassMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClassPayload }) =>
      classesApi.updateClass(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteClassMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
    },
  });
};

export const useAssignTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignTrainerPayload }) =>
      classesApi.assignTrainer(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.detail(variables.id),
      });
    },
  });
};

export const useReuseClassMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReuseClassPayload }) =>
      classesApi.reuseClass(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
    },
  });
};

export const useClassReportQuery = (id: string) =>
  useQuery({
    queryKey: classesQueryKeys.report(id),
    queryFn: () => classesApi.getClassReport(id),
    enabled: !!id,
  });

export const useTemplatesQuery = () =>
  useQuery<ClassTemplate[]>({
    queryKey: classesQueryKeys.templates(),
    queryFn: () => classesApi.getTemplates(),
  });

export const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) =>
      classesApi.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.templates(),
      });
    },
  });
};

export const useUseTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UseTemplatePayload) =>
      classesApi.useTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
    },
  });
};
