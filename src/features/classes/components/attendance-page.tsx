import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { IconFilter } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";

import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useMembersQuery } from "@/features/members/services";
import {
  formatDisplayDate,
  formatDisplayDateTime,
} from "@/lib/display-datetime";
import {
  useClassAttendanceListQuery,
  useClassQuery,
  useClassesQuery,
  useScheduleAttendanceQuery,
} from "../services";
import type { ClassAttendanceTableRow } from "../types";
import {
  formatScheduleDateOnly,
  formatScheduleTimeRange12h,
} from "../utils/format-schedule-display";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
];

function formatAttendanceCellDate(value: string): string {
  if (!value || value === "—") return "—";
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return value.includes("T")
    ? formatDisplayDateTime(value)
    : formatDisplayDate(value);
}

function patchAttendanceSearchParams(
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  patch: { classId?: string | null; classScheduleId?: string | null },
) {
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      if (patch.classId !== undefined) {
        if (patch.classId) next.set("classId", patch.classId);
        else next.delete("classId");
      }
      if (patch.classScheduleId !== undefined) {
        if (patch.classScheduleId)
          next.set("classScheduleId", patch.classScheduleId);
        else next.delete("classScheduleId");
      }
      return next;
    },
    { replace: true },
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  options,
  widthClass = "w-[200px]",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  widthClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={`h-10 border-[#F4F4F4] bg-white ${widthClass}`}
        >
          <div className="flex items-center gap-2">
            <IconFilter className="size-4 shrink-0" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type AttendancePageProps = {
  /** Lock the table to one class (e.g. class detail tab). */
  fixedClassId?: string;
  /** Omit dashboard chrome and page title (embed under another screen). */
  embedded?: boolean;
};

export function AttendancePage({
  fixedClassId,
  embedded = false,
}: AttendancePageProps = {}) {
  const isClassLocked = Boolean(fixedClassId);
  const simplifiedEmbed = Boolean(embedded && isClassLocked);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery({
    enabled: !simplifiedEmbed,
  });

  const [locationFilter, setLocationFilter] = useState("all");
  const [classFilter, setClassFilter] = useState(
    () =>
      (isClassLocked ? fixedClassId : searchParams.get("classId")) ?? "all",
  );
  const [scheduleFilter, setScheduleFilter] = useState(() => {
    const sid = searchParams.get("classScheduleId");
    return sid && sid.length > 0 ? sid : "all";
  });

  const [memberFilter, setMemberFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasCheckedInFilter, setHasCheckedInFilter] = useState<
    "all" | "yes" | "no"
  >("all");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sessionDate, setSessionDate] = useState("");

  const [memberSearch, setMemberSearch] = useState("");
  const deferredMemberSearch = useDeferredValue(memberSearch.trim());

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (isClassLocked) {
      const sid = searchParams.get("classScheduleId");
      setScheduleFilter(sid && sid.length > 0 ? sid : "all");
      return;
    }
    const cid = searchParams.get("classId");
    const sid = searchParams.get("classScheduleId");
    if (sid && sid.length > 0 && (!cid || cid.length === 0)) {
      patchAttendanceSearchParams(setSearchParams, { classScheduleId: null });
      setClassFilter("all");
      setScheduleFilter("all");
      return;
    }
    setClassFilter(cid && cid.length > 0 ? cid : "all");
    setScheduleFilter(sid && sid.length > 0 ? sid : "all");
  }, [searchParams, setSearchParams, isClassLocked]);

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  const { data: classes = [], isLoading: classesLoading } = useClassesQuery(
    effectiveLocationId,
    { enabled: !isClassLocked },
  );

  const resolvedClassKey =
    fixedClassId ?? (classFilter !== "all" ? classFilter : "");
  const { data: classDetail, isLoading: classDetailLoading } =
    useClassQuery(resolvedClassKey);

  const { data: members = [], isLoading: membersLoading } = useMembersQuery(
    effectiveLocationId,
    { enabled: !simplifiedEmbed },
  );

  const scheduleView = scheduleFilter !== "all";

  const classOptions = useMemo(
    () => [
      { value: "all", label: "All classes" },
      ...classes.map((c) => ({ value: c.id, label: c.name })),
    ],
    [classes],
  );

  const scheduleOptions = useMemo(() => {
    if (!resolvedClassKey) {
      return [{ value: "all", label: "Select a class first" }];
    }
    const schedules = classDetail?.schedules ?? [];
    return [
      { value: "all", label: "All sessions (this class)" },
      ...schedules.map((s) => ({
        value: s.id,
        label: `${formatScheduleDateOnly(s.date)} · ${formatScheduleTimeRange12h(s.startTime, s.endTime)}`,
      })),
    ];
  }, [classDetail?.schedules, resolvedClassKey]);

  const memberOptions = useMemo(
    () => [
      // { value: "all", label: "All members" },
      ...members.map((m) => ({
        value: m.memberId,
        label:
          `${m.member.firstName} ${m.member.lastName}`.trim() || m.member.email,
      })),
    ],
    [members],
  );

  useEffect(() => {
    if (!scheduleView || !classDetail) return;
    const exists = classDetail.schedules.some((s) => s.id === scheduleFilter);
    if (!exists) {
      setScheduleFilter("all");
      if (isClassLocked) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("classScheduleId");
            return next;
          },
          { replace: true },
        );
      } else {
        patchAttendanceSearchParams(setSearchParams, {
          classScheduleId: null,
        });
      }
    }
  }, [
    classDetail,
    scheduleFilter,
    scheduleView,
    setSearchParams,
    isClassLocked,
  ]);

  const listParams = useMemo(() => {
    const core = {
      page,
      limit,
      classId: resolvedClassKey || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };
    if (simplifiedEmbed) return core;
    return {
      ...core,
      locationId: locationFilter === "all" ? undefined : locationFilter,
      memberId: memberFilter === "all" ? undefined : memberFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
    };
  }, [
    page,
    limit,
    resolvedClassKey,
    dateFrom,
    dateTo,
    simplifiedEmbed,
    locationFilter,
    memberFilter,
    statusFilter,
  ]);

  const scheduleParams = useMemo(() => {
    const core = { page, limit };
    if (simplifiedEmbed) {
      return {
        ...core,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
    }
    return {
      ...core,
      date: sessionDate || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      hasCheckedIn:
        hasCheckedInFilter === "all" ? undefined : hasCheckedInFilter === "yes",
      memberSearch: deferredMemberSearch || undefined,
    };
  }, [
    page,
    limit,
    simplifiedEmbed,
    dateFrom,
    dateTo,
    sessionDate,
    statusFilter,
    hasCheckedInFilter,
    deferredMemberSearch,
  ]);

  const classNameFallback = classDetail?.name ?? "";

  const listQuery = useClassAttendanceListQuery(listParams, {
    enabled: !scheduleView,
  });

  const scheduleQuery = useScheduleAttendanceQuery(
    scheduleView ? scheduleFilter : "",
    scheduleParams,
    classNameFallback,
    { enabled: scheduleView },
  );

  const activeQuery = scheduleView ? scheduleQuery : listQuery;
  const rows = activeQuery.data?.rows ?? [];
  const totalItems = activeQuery.data?.total ?? 0;
  const totalPages = activeQuery.data?.totalPages ?? 1;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  useEffect(() => {
    setPage(1);
  }, [
    locationFilter,
    resolvedClassKey,
    scheduleFilter,
    memberFilter,
    statusFilter,
    hasCheckedInFilter,
    dateFrom,
    dateTo,
    sessionDate,
    deferredMemberSearch,
    scheduleView,
    simplifiedEmbed,
  ]);

  const selectedSchedule = useMemo(() => {
    if (scheduleFilter === "all" || !classDetail) return null;
    return classDetail.schedules.find((s) => s.id === scheduleFilter) ?? null;
  }, [classDetail, scheduleFilter]);

  const handleClassChange = (value: string) => {
    if (isClassLocked) return;
    setClassFilter(value);
    setScheduleFilter("all");
    patchAttendanceSearchParams(setSearchParams, {
      classId: value !== "all" ? value : null,
      classScheduleId: null,
    });
  };

  const handleScheduleChange = (value: string) => {
    setScheduleFilter(value);
    if (isClassLocked) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value !== "all") next.set("classScheduleId", value);
          else next.delete("classScheduleId");
          return next;
        },
        { replace: true },
      );
    } else {
      patchAttendanceSearchParams(setSearchParams, {
        classScheduleId: value !== "all" ? value : null,
      });
    }
  };

  const columns = useMemo<ColumnDef<ClassAttendanceTableRow>[]>(() => {
    const base: ColumnDef<ClassAttendanceTableRow>[] = [
      ...(!simplifiedEmbed
        ? [
            {
              accessorKey: "className",
              header: "Class",
              cell: ({ row }) => (
                <div className="text-sm font-medium">
                  {row.original.className}
                </div>
              ),
            } satisfies ColumnDef<ClassAttendanceTableRow>,
          ]
        : []),
      {
        accessorKey: "member",
        header: "Member",
        cell: ({ row }) => <div className="text-sm">{row.original.member}</div>,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="text-sm">
            {formatAttendanceCellDate(row.original.date)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status.toLowerCase();
          let variant: "default" | "secondary" | "destructive" = "secondary";
          if (status === "present") variant = "default";
          else if (status === "absent") variant = "destructive";
          return (
            <Badge variant={variant} className="capitalize">
              {row.original.status}
            </Badge>
          );
        },
      },
      ...(!simplifiedEmbed
        ? [
            {
              accessorKey: "location",
              header: "Location",
              cell: ({ row }) => (
                <div className="text-sm">{row.original.location}</div>
              ),
            } satisfies ColumnDef<ClassAttendanceTableRow>,
          ]
        : []),
    ];

    if (scheduleView) {
      const checkedInCol: ColumnDef<ClassAttendanceTableRow> = {
        id: "checkedIn",
        header: "Checked in",
        cell: ({ row }) => (
          <div className="text-sm">{row.original.checkedIn ?? "—"}</div>
        ),
      };
      base.splice(simplifiedEmbed ? 2 : 3, 0, checkedInCol);
    }

    return base;
  }, [scheduleView, simplifiedEmbed]);

  const contextBanner: ReactNode =
    simplifiedEmbed ? null : scheduleView && classDetail && selectedSchedule ? (
      <Card className="rounded-md border-[#F4F4F4] bg-white shadow-none">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs font-medium">
            Attendance for session
          </p>
          <p className="text-lg font-semibold">{classDetail.name}</p>
          <p className="text-muted-foreground text-sm">
            {formatScheduleDateOnly(selectedSchedule.date)} ·{" "}
            {formatScheduleTimeRange12h(
              selectedSchedule.startTime,
              selectedSchedule.endTime,
            )}
          </p>
        </CardContent>
      </Card>
    ) : resolvedClassKey && classDetail && !scheduleView ? (
      <Card className="rounded-md border-[#F4F4F4] bg-white shadow-none">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs font-medium">
            Filtered by class
          </p>
          <p className="text-lg font-semibold">{classDetail.name}</p>
          <p className="text-muted-foreground text-sm">
            Showing all sessions for this class. Pick a session for
            schedule-specific filters, search, and checked-in status.
          </p>
        </CardContent>
      </Card>
    ) : null;

  const body = (
    <div
      className={
        embedded
          ? "flex flex-col gap-4"
          : "flex flex-col gap-4 py-4 md:gap-6 md:py-6"
      }
    >
      {!embedded ? (
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-medium">Attendance</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Class attendance across your gym or for a single scheduled session.
          </p>
        </div>
      ) : null}

      <div className={embedded ? "space-y-4" : "space-y-4 px-4 lg:px-6"}>
        {contextBanner}

        <div className="flex flex-wrap items-end gap-3">
          {!isClassLocked ? (
            <FilterSelect
              label="Class"
              value={classFilter}
              onChange={handleClassChange}
              disabled={classesLoading}
              options={classOptions}
              widthClass="min-w-[220px]"
            />
          ) : null}
          <FilterSelect
            label="Schedule"
            value={scheduleFilter}
            onChange={handleScheduleChange}
            disabled={!resolvedClassKey || classDetailLoading || !classDetail}
            options={scheduleOptions}
            widthClass="min-w-[280px]"
          />
          {simplifiedEmbed ? (
            <>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 w-[160px] border-[#F4F4F4] bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 w-[160px] border-[#F4F4F4] bg-white"
                />
              </div>
            </>
          ) : (
            <>
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
              />
              {scheduleView ? (
                <FilterSelect
                  label="Checked in"
                  value={hasCheckedInFilter}
                  onChange={(v) =>
                    setHasCheckedInFilter(v as "all" | "yes" | "no")
                  }
                  options={[
                    { value: "all", label: "All" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                />
              ) : null}
            </>
          )}
        </div>

        {!simplifiedEmbed ? (
          scheduleView ? (
            <TableFilterBar
              showSearch
              searchValue={memberSearch}
              onSearchChange={setMemberSearch}
              searchPlaceholder="Search by member name or email..."
              locationValue={locationFilter}
              onLocationChange={setLocationFilter}
              locations={(locations ?? []).map((loc) => ({
                value: loc.id,
                label: loc.locationName,
              }))}
              locationDisabled={locationsLoading}
              dateValue={sessionDate}
              onDateChange={setSessionDate}
              showExportButton={false}
            />
          ) : (
            <TableFilterBar
              showSearch={false}
              locationValue={locationFilter}
              onLocationChange={setLocationFilter}
              locations={(locations ?? []).map((loc) => ({
                value: loc.id,
                label: loc.locationName,
              }))}
              locationDisabled={locationsLoading}
              showMemberFilter
              memberValue={memberFilter}
              onMemberChange={setMemberFilter}
              memberOptions={memberOptions}
              memberDisabled={membersLoading}
              dateValue={dateFrom}
              onDateChange={setDateFrom}
              dateToValue={dateTo}
              onDateToChange={setDateTo}
              showExportButton={false}
            />
          )
        ) : null}

          {isError ? (
            <p className="text-destructive text-sm">
              Could not load attendance. Please try again.
            </p>
          ) : null}

          <DataTable
            data={rows}
            columns={columns}
            getRowId={(row) => row.id}
            emptyMessage="No attendance records found."
            enableDragAndDrop={false}
            enableColumnVisibility={false}
            enableRowSelection={false}
            defaultPageSize={limit}
            isLoading={isLoading}
            serverPagination={{
              totalItems,
              pageIndex: page - 1,
              pageSize: limit,
              pageCount: Math.max(1, totalPages),
              onPageChange: (pageIndex) => setPage(pageIndex + 1),
              onPageSizeChange: (next) => {
                setLimit(next);
                setPage(1);
              },
            }}
          />
      </div>
    </div>
  );

  if (embedded) return body;
  return <DashboardLayout>{body}</DashboardLayout>;
}
