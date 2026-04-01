import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { IconAlertTriangle, IconBolt } from "@tabler/icons-react";
import { Clock3, TriangleAlert, TrendingUp, UsersRound } from "lucide-react";

import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryMetricCard } from "@/features/dashboard/components/summary-metric-card";
import type { CheckInListItem } from "../types";
import { useCheckInsQuery } from "../services";
import { QuickCheckInDialog } from "./quick-check-in-dialog";

function formatCheckInDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCheckInTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function memberDisplayName(member: CheckInListItem["member"]) {
  const name = `${member.firstName} ${member.lastName}`.trim();
  return name || member.email;
}

export function CheckInPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [quickCheckInOpen, setQuickCheckInOpen] = useState(false);
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const deferredSearch = useDeferredValue(searchQuery.trim());

  const listParams = useMemo(
    () => ({
      locationId: locationFilter === "all" ? undefined : locationFilter,
      status: "checked_in" as const,
      dateFrom: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
      dateTo: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
      search: deferredSearch || undefined,
      page,
      limit,
      sortBy: "checkInTime",
      sortOrder,
    }),
    [
      locationFilter,
      dateFrom,
      dateTo,
      deferredSearch,
      page,
      limit,
      sortOrder,
    ],
  );

  useEffect(() => {
    setPage(1);
  }, [locationFilter, dateFrom, dateTo, deferredSearch, sortOrder]);

  const { data: checkInsResponse, isLoading, isError } =
    useCheckInsQuery(listParams);

  const rows = checkInsResponse?.data ?? [];
  const totalItems = checkInsResponse?.total ?? 0;
  const totalPages = checkInsResponse?.totalPages ?? 0;

  const columns: ColumnDef<CheckInListItem>[] = useMemo(
    () => [
      {
        id: "member",
        accessorFn: (row) => memberDisplayName(row.member),
        header: "Member",
        cell: ({ row }) => {
          const member = row.original.member;
          const incomplete =
            member.onboardingCompleted === false || member.status === "pending";
          return (
            <div className="flex items-center gap-1.5 font-medium">
              <span>{memberDisplayName(member)}</span>
              {incomplete ? (
                <IconAlertTriangle className="size-3.5 text-[#DC5959]" />
              ) : null}
            </div>
          );
        },
      },
      {
        id: "date",
        accessorFn: (row) => row.checkInTime,
        header: "Date",
        cell: ({ row }) => formatCheckInDate(row.original.checkInTime),
      },
      {
        id: "checkIn",
        accessorFn: (row) => row.checkInTime,
        header: "Check-In",
        cell: ({ row }) => formatCheckInTime(row.original.checkInTime),
      },
      {
        id: "checkOut",
        accessorFn: (row) => row.checkOutTime,
        header: "Check-Out",
        cell: ({ row }) =>
          row.original.checkOutTime
            ? formatCheckInTime(row.original.checkOutTime)
            : "—",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const raw = row.original.status;
          const label =
            raw === "checked_in"
              ? "Checked in"
              : raw.replace(/_/g, " ");
          return (
            <Badge
              variant="secondary"
              className="rounded-full bg-[#E7F8EE] px-2 py-0 text-[11px] text-[#1EA85D]"
            >
              {label}
            </Badge>
          );
        },
      },
      {
        id: "staff",
        accessorKey: "checkedInBy",
        header: "Staff",
        cell: () => "—",
      },
      {
        id: "location",
        accessorFn: (row) => row.location.locationName,
        header: "Location",
        cell: ({ row }) => row.original.location.locationName,
      },
    ],
    [],
  );

  const sortSelect = (
    <Select
      value={sortOrder}
      onValueChange={(value) => setSortOrder(value as "ASC" | "DESC")}
    >
      <SelectTrigger className="h-10 min-w-[220px] border-[#F4F4F4] bg-white">
        <SelectValue placeholder="Sort by check-in time" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DESC">Newest check-ins first</SelectItem>
        <SelectItem value="ASC">Oldest check-ins first</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Check-In</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Track daily gym attendance
            </p>
          </div>
          <Button onClick={() => setQuickCheckInOpen(true)}>
            <IconBolt className="h-4 w-4" />
            Quick Check-In
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <SummaryMetricCard
            title="Today's Attendance"
            value="47"
            icon={<UsersRound className="size-6 fill-current stroke-[1.8]" />}
            iconBgVar="#F2EEFF"
            iconColorVar="#7E52FF"
            valueColorVar="#7E52FF"
            percentChange={12}
            isPositive={true}
            comparisonText="vs last week"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]"
          />
          <SummaryMetricCard
            title="Peak Hour"
            value="7-8 AM"
            icon={<Clock3 className="size-6 fill-current stroke-[1.8]" />}
            iconBgVar="#ECECFF"
            iconColorVar="#4342FF"
            valueColorVar="#4342FF"
            percentChange={0}
            isPositive={true}
            comparisonText="Typical rush period"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]"
          />
          <SummaryMetricCard
            title="Weekly Average"
            value="42"
            icon={<TrendingUp className="size-6 fill-current stroke-[1.8]" />}
            iconBgVar="#FFEFE6"
            iconColorVar="#FF5B04"
            valueColorVar="#FF5B04"
            percentChange={5}
            isPositive={true}
            comparisonText="vs last month"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]"
          />
          <SummaryMetricCard
            title="Incomplete Check-ins"
            value="2"
            icon={
              <TriangleAlert className="size-6 fill-current stroke-[1.8]" />
            }
            iconBgVar="#FBEAEA"
            iconColorVar="#D32F2F"
            valueColorVar="#D32F2F"
            percentChange={2}
            isPositive={false}
            comparisonText="needs attention"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]"
          />
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name, email, or member ID..."
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
            dateValue={dateFrom}
            onDateChange={setDateFrom}
            dateToValue={dateTo}
            onDateToChange={setDateTo}
            actionNode={sortSelect}
          />

          {isError ? (
            <p className="text-destructive mb-2 text-sm">
              Could not load check-ins. Please try again.
            </p>
          ) : null}

          <DataTable
            data={rows}
            columns={columns}
            getRowId={(row) => row.id}
            emptyMessage="No check-ins found."
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

      <QuickCheckInDialog
        open={quickCheckInOpen}
        onOpenChange={setQuickCheckInOpen}
      />
    </DashboardLayout>
  );
}
