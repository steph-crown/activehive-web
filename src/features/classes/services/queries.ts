import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classAttendanceApi, classesApi } from "./api";
import type {
  Class,
  ClassTemplate,
  CreateClassPayload,
  UpdateClassPayload,
  CreateTemplatePayload,
  UseTemplatePayload,
  AssignTrainerPayload,
  ReuseClassPayload,
  AddClassAttendancePayload,
  ClassAttendanceListQuery,
  ScheduleAttendanceQuery,
  ClassAttendancePaginated,
  ClassAttendanceTableRow,
} from "../types";

export const classesQueryKeys = {
  all: ["classes"] as const,
  list: (locationId?: string) => [...classesQueryKeys.all, "list", locationId] as const,
  detail: (id: string) => [...classesQueryKeys.all, "detail", id] as const,
  templates: () => [...classesQueryKeys.all, "templates"] as const,
  report: (id: string) => [...classesQueryKeys.all, "report", id] as const,
};

export const classAttendanceQueryKeys = {
  all: ["class-attendance"] as const,
  list: (params: ClassAttendanceListQuery) =>
    [...classAttendanceQueryKeys.all, "list", params] as const,
  schedule: (scheduleId: string, params: ScheduleAttendanceQuery) =>
    [...classAttendanceQueryKeys.all, "schedule", scheduleId, params] as const,
};

function memberNameFromUnknown(m: unknown): string {
  if (m == null) return "—";
  if (typeof m === "string") return m;
  if (typeof m !== "object") return "—";
  const o = m as Record<string, unknown>;
  const first = String(o.firstName ?? "").trim();
  const last = String(o.lastName ?? "").trim();
  const joined = `${first} ${last}`.trim();
  if (joined) return joined;
  const email = o.email;
  if (typeof email === "string" && email.trim()) return email.trim();
  return "—";
}

/**
 * Normalizes the attendance response shape:
 * { schedule: { class, date, startTime, location }, attendance: [...], pagination: { total, totalPages } }
 */
function normalizeAttendanceResponse(
  raw: unknown,
  classNameFallback = "",
): ClassAttendancePaginated {
  if (raw == null || typeof raw !== "object") {
    return { rows: [], total: 0, totalPages: 1 };
  }

  const r = raw as Record<string, unknown>;
  const schedule = r.schedule as Record<string, unknown> | undefined;
  const attendance = Array.isArray(r.attendance) ? r.attendance : [];
  const pagination = r.pagination as Record<string, unknown> | undefined;

  const total = Number(pagination?.total ?? attendance.length) || 0;
  const totalPages = Number(pagination?.totalPages ?? 1) || 1;

  const scheduleClass = schedule?.class as Record<string, unknown> | undefined;
  const scheduleLocation = schedule?.location as
    | Record<string, unknown>
    | undefined;

  const className = String(
    (scheduleClass?.name ?? classNameFallback) || "—",
  );
  const location = String(scheduleLocation?.name ?? "—");
  const date = typeof schedule?.date === "string" ? schedule.date : "—";
  const time =
    typeof schedule?.startTime === "string" && schedule.startTime
      ? schedule.startTime
      : undefined;

  const rows: ClassAttendanceTableRow[] = attendance.map((item, i) => {
    if (item == null || typeof item !== "object") {
      return { id: `row-${i}`, className, member: "—", date, time, status: "—", location };
    }
    const a = item as Record<string, unknown>;
    const id = String(a.id ?? `row-${i}`);
    const member = memberNameFromUnknown(a.member);
    const status = String(a.status ?? "—");
    const checkedIn = a.checkedInAt != null ? "Yes" : "No";
    return { id, className, member, date, time, status, location, checkedIn };
  });

  return { rows, total, totalPages };
}

export const useClassAttendanceListQuery = (
  params: ClassAttendanceListQuery,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: classAttendanceQueryKeys.list(params),
    queryFn: async () => {
      const raw = await classAttendanceApi.listAttendance(params);
      return normalizeAttendanceResponse(raw);
    },
    enabled: options?.enabled ?? true,
  });

export const useScheduleAttendanceQuery = (
  classScheduleId: string,
  params: ScheduleAttendanceQuery,
  classNameFallback: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: classAttendanceQueryKeys.schedule(classScheduleId, params),
    queryFn: async () => {
      const raw = await classAttendanceApi.getScheduleAttendance(
        classScheduleId,
        params,
      );
      return normalizeAttendanceResponse(raw, classNameFallback);
    },
    enabled: (options?.enabled ?? true) && Boolean(classScheduleId),
  });

export const useClassesQuery = (
  locationId?: string,
  options?: { enabled?: boolean },
) =>
  useQuery<Class[]>({
    queryKey: classesQueryKeys.list(locationId),
    queryFn: () => classesApi.getClasses(locationId),
    enabled: options?.enabled ?? true,
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

export const useAddClassScheduleAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      classId: string;
      classScheduleId: string;
      payload: AddClassAttendancePayload;
    }) =>
      classAttendanceApi.addAttendance(
        variables.classScheduleId,
        variables.payload,
      ),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: classesQueryKeys.detail(variables.classId),
      });
      await queryClient.invalidateQueries({
        queryKey: classesQueryKeys.report(variables.classId),
      });
      await queryClient.invalidateQueries({
        queryKey: classesQueryKeys.all,
      });
      await queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === classAttendanceQueryKeys.all[0],
      });
      await queryClient.refetchQueries({
        predicate: (q) => q.queryKey[0] === classAttendanceQueryKeys.all[0],
      });
    },
  });
};
