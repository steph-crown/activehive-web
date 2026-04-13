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

function extractPaginatedPayload(raw: unknown): {
  items: unknown[];
  total: number;
  totalPages: number;
} {
  if (raw == null || typeof raw !== "object") {
    return { items: [], total: 0, totalPages: 0 };
  }
  const r = raw as Record<string, unknown>;
  const items = (Array.isArray(r.data)
    ? r.data
    : Array.isArray(r.items)
      ? r.items
      : Array.isArray(r.results)
        ? r.results
        : []) as unknown[];
  const total = Number(r.total ?? r.count ?? items.length) || 0;
  const limit = Number(r.limit ?? 20) || 20;
  const totalPages =
    Number(r.totalPages) ||
    (total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);
  return { items, total, totalPages };
}

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

function normalizeAttendanceRow(
  raw: unknown,
  rowIndex: number,
  fallbackClassName = "",
): ClassAttendanceTableRow {
  if (raw == null || typeof raw !== "object") {
    return {
      id: `row-${rowIndex}`,
      className: "—",
      member: "—",
      date: "—",
      status: "—",
      location: "—",
    };
  }
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? r.bookingId ?? `row-${rowIndex}`);
  const className = String(
    r.className ??
      (r.class as { name?: string } | undefined)?.name ??
      fallbackClassName ??
      "—",
  );
  const member =
    typeof r.memberName === "string"
      ? r.memberName
      : memberNameFromUnknown(r.member);
  const dateRaw = r.date ?? r.sessionDate ?? r.attendanceDate ?? r.checkInTime;
  const date =
    typeof dateRaw === "string"
      ? dateRaw
      : dateRaw instanceof Date
        ? dateRaw.toISOString()
        : "—";
  const status = String(
    r.status ?? r.bookingStatus ?? r.attendanceStatus ?? "—",
  );
  const loc =
    r.locationName ??
    (r.location as { locationName?: string } | undefined)?.locationName ??
    (typeof r.location === "string" ? r.location : undefined);
  const location = String(loc ?? "—");
  let checkedIn: string | undefined;
  if (r.hasCheckedIn === true) checkedIn = "Yes";
  else if (r.hasCheckedIn === false) checkedIn = "No";
  else if (typeof r.checkedIn === "boolean")
    checkedIn = r.checkedIn ? "Yes" : "No";

  return { id, className, member, date, status, location, checkedIn };
}

function normalizeClassAttendanceListResponse(
  raw: unknown,
): ClassAttendancePaginated {
  const { items, total, totalPages } = extractPaginatedPayload(raw);
  return {
    rows: items.map((item, i) => normalizeAttendanceRow(item, i)),
    total,
    totalPages,
  };
}

function normalizeScheduleAttendanceResponse(
  raw: unknown,
  classNameFallback: string,
): ClassAttendancePaginated {
  const { items, total, totalPages } = extractPaginatedPayload(raw);
  return {
    rows: items.map((item, i) =>
      normalizeAttendanceRow(item, i, classNameFallback),
    ),
    total,
    totalPages,
  };
}

export const useClassAttendanceListQuery = (
  params: ClassAttendanceListQuery,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: classAttendanceQueryKeys.list(params),
    queryFn: async () => {
      const raw = await classAttendanceApi.listAttendance(params);
      return normalizeClassAttendanceListResponse(raw);
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
      return normalizeScheduleAttendanceResponse(raw, classNameFallback);
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
    mutationFn: ({
      classId,
      classScheduleId,
      payload,
    }: {
      classId: string;
      classScheduleId: string;
      payload: AddClassAttendancePayload;
    }) => classAttendanceApi.addAttendance(classScheduleId, payload),
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
