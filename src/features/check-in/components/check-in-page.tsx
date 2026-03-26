import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  IconAlertTriangle,
  IconClockHour3,
  IconTrendingUp,
  IconBolt,
  IconUsers,
} from "@tabler/icons-react";

import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryMetricCard } from "@/features/dashboard/components/summary-metric-card";

type CheckInMethod = "QR Code" | "Manual" | "NFC";

type CheckInRecord = {
  id: string;
  member: string;
  date: string;
  checkIn: string;
  checkOut: string;
  method: CheckInMethod;
  staff: string;
  location: string;
  hasIncompleteProfile: boolean;
};

const checkInData: CheckInRecord[] = [
  {
    id: "1",
    member: "Sarah Johnson",
    date: "Mar 15, 2026",
    checkIn: "07:30 AM",
    checkOut: "09:00 AM",
    method: "QR Code",
    staff: "—",
    location: "Downtown",
    hasIncompleteProfile: false,
  },
  {
    id: "2",
    member: "Mike Chen",
    date: "Mar 15, 2026",
    checkIn: "08:15 AM",
    checkOut: "10:30 AM",
    method: "Manual",
    staff: "Anna M.",
    location: "Westside",
    hasIncompleteProfile: false,
  },
  {
    id: "3",
    member: "Emma Wilson",
    date: "Mar 15, 2026",
    checkIn: "09:00 AM",
    checkOut: "10:45 AM",
    method: "NFC",
    staff: "—",
    location: "Downtown",
    hasIncompleteProfile: true,
  },
  {
    id: "4",
    member: "James Brown",
    date: "Mar 15, 2026",
    checkIn: "10:30 AM",
    checkOut: "—",
    method: "Manual",
    staff: "Tom H.",
    location: "Eastside",
    hasIncompleteProfile: false,
  },
  {
    id: "5",
    member: "David Kim",
    date: "Mar 15, 2026",
    checkIn: "06:45 AM",
    checkOut: "08:15 AM",
    method: "QR Code",
    staff: "—",
    location: "Downtown",
    hasIncompleteProfile: false,
  },
  {
    id: "6",
    member: "Anna Martinez",
    date: "Mar 15, 2026",
    checkIn: "11:00 AM",
    checkOut: "12:30 PM",
    method: "Manual",
    staff: "Anna M.",
    location: "Eastside",
    hasIncompleteProfile: true,
  },
  {
    id: "7",
    member: "Tom Harris",
    date: "Mar 15, 2026",
    checkIn: "05:30 PM",
    checkOut: "—",
    method: "QR Code",
    staff: "—",
    location: "Downtown",
    hasIncompleteProfile: false,
  },
  {
    id: "8",
    member: "Lisa Park",
    date: "Mar 15, 2026",
    checkIn: "06:00 PM",
    checkOut: "07:30 PM",
    method: "NFC",
    staff: "—",
    location: "Westside",
    hasIncompleteProfile: false,
  },
];

export function CheckInPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [quickCheckInOpen, setQuickCheckInOpen] = useState(false);
  const [quickMethod, setQuickMethod] = useState("Manual");
  const [quickLocation, setQuickLocation] = useState("Downtown");
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const filteredData = useMemo(() => {
    return checkInData.filter((record) => {
      const matchesSearch = record.member
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesMethod =
        methodFilter === "all" || record.method === methodFilter;
      const selectedLocationName =
        locationFilter === "all"
          ? undefined
          : locations?.find((location) => location.id === locationFilter)
              ?.locationName;
      const matchesLocation =
        !selectedLocationName || record.location === selectedLocationName;

      if (!dateFilter) {
        return matchesSearch && matchesMethod && matchesLocation;
      }

      const formattedDate = new Date(dateFilter).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      const matchesDate = record.date.includes(formattedDate);

      return matchesSearch && matchesMethod && matchesLocation && matchesDate;
    });
  }, [dateFilter, locationFilter, locations, methodFilter, searchQuery]);

  const columns: ColumnDef<CheckInRecord>[] = useMemo(
    () => [
      {
        accessorKey: "member",
        header: "Member",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-medium">
            <span>{row.original.member}</span>
            {row.original.hasIncompleteProfile && (
              <IconAlertTriangle className="size-3.5 text-[#DC5959]" />
            )}
          </div>
        ),
      },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "checkIn", header: "Check-In" },
      { accessorKey: "checkOut", header: "Check-Out" },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => {
          const method = row.original.method;
          let badgeClass = "bg-[#FFF8E0] text-[#A57800]";
          if (method === "QR Code") {
            badgeClass = "bg-[#E8F1FF] text-[#3572D4]";
          } else if (method === "NFC") {
            badgeClass = "bg-[#E7F8EE] text-[#1EA85D]";
          }
          return (
            <Badge
              variant="secondary"
              className={`rounded-full px-2 py-0 text-[11px] ${badgeClass}`}
            >
              {method}
            </Badge>
          );
        },
      },
      { accessorKey: "staff", header: "Staff" },
      { accessorKey: "location", header: "Location" },
    ],
    [],
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
            helperText="+12% from last week"
            helperTextClass="text-[#16A34A]"
            icon={<IconUsers className="size-6" stroke={1.8} />}
            valueColorClass="text-[#7E52FF]"
            iconBgClass="bg-[#F2EEFF]"
            iconColorClass="text-[#7E52FF]"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]"
          />
          <SummaryMetricCard
            title="Peak Hour"
            value="7-8 AM"
            helperText="Typical rush period"
            helperTextClass="text-[#959595]"
            icon={<IconClockHour3 className="size-6" stroke={1.8} />}
            valueColorClass="text-[#4342FF]"
            iconBgClass="bg-[#ECECFF]"
            iconColorClass="text-[#4342FF]"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]"
          />
          <SummaryMetricCard
            title="Weekly Average"
            value="42"
            helperText="+5% from last month"
            helperTextClass="text-[#16A34A]"
            icon={<IconTrendingUp className="size-6" stroke={1.8} />}
            valueColorClass="text-[#FF5B04]"
            iconBgClass="bg-[#FFEFE6]"
            iconColorClass="text-[#FF5B04]"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]"
          />
          <SummaryMetricCard
            title="Incomplete Check-ins"
            value="2"
            helperText="Missing required info"
            helperTextClass="text-[#DC5959]"
            icon={<IconAlertTriangle className="size-6" stroke={1.8} />}
            valueColorClass="text-[#D32F2F]"
            iconBgClass="bg-[#FBEAEA]"
            iconColorClass="text-[#D32F2F]"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]"
          />
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by member name..."
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
            showMethodFilter
            methodValue={methodFilter}
            onMethodChange={setMethodFilter}
            methodOptions={[
              { value: "Manual", label: "Manual" },
              { value: "QR Code", label: "QR Code" },
              { value: "NFC", label: "NFC" },
            ]}
            dateValue={dateFilter}
            onDateChange={setDateFilter}
          />

          <DataTable
            data={filteredData}
            columns={columns}
            getRowId={(row) => row.id}
            emptyMessage="No check-ins found."
            enableDragAndDrop={false}
            enableColumnVisibility={false}
            enableRowSelection={false}
            defaultPageSize={8}
          />
        </div>
      </div>

      <Dialog open={quickCheckInOpen} onOpenChange={setQuickCheckInOpen}>
        <DialogContent className="max-w-2xl border-[#F4F4F4]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase">
              Quick Check-In
            </DialogTitle>
            <DialogDescription>
              Search member and record an attendance check-in.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Member Name or ID *</label>
              <Input placeholder="Search member..." />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Check-In Method</label>
              <Select value={quickMethod} onValueChange={setQuickMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="QR Code">QR Code</SelectItem>
                  <SelectItem value="NFC">NFC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={quickLocation} onValueChange={setQuickLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Downtown">Downtown</SelectItem>
                  <SelectItem value="Westside">Westside</SelectItem>
                  <SelectItem value="Eastside">Eastside</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
              <IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                Members with incomplete profiles will receive a warning during
                check-in.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setQuickCheckInOpen(false)}
            >
              Cancel
            </Button>
            <Button>Check In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
