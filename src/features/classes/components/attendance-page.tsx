import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";

type AttendanceRecord = {
  id: string;
  className: string;
  member: string;
  date: string;
  status: "present" | "absent" | "late";
  location: string;
};

// const attendanceData: AttendanceRecord[] = [
//   {
//     id: "att-001",
//     className: "Morning Yoga",
//     member: "Sarah Johnson",
//     date: "Mar 20, 2026",
//     status: "present",
//     location: "Downtown",
//   },
//   {
//     id: "att-002",
//     className: "HIIT Basics",
//     member: "Mike Chen",
//     date: "Mar 20, 2026",
//     status: "late",
//     location: "Westside",
//   },
//   {
//     id: "att-003",
//     className: "Strength Training",
//     member: "Emma Wilson",
//     date: "Mar 20, 2026",
//     status: "absent",
//     location: "Downtown",
//   },
// ];

const columns: ColumnDef<AttendanceRecord>[] = [
  { accessorKey: "className", header: "Class" },
  { accessorKey: "member", header: "Member" },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "destructive";
      if (status === "present") {
        variant = "default";
      } else if (status === "late") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export function AttendancePage() {
  return (
    <ScheduleStyleTablePage
      title="Attendance"
      description="View class attendance records."
      columns={columns}
      data={[]}
      emptyMessage="No attendance records found."
    />
  );
}
