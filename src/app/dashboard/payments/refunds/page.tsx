import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";

type RefundRow = {
  id: string;
  refundId: string;
  member: string;
  amount: string;
  reason: string;
  status: "approved" | "pending" | "rejected";
  date: string;
  location: string;
};

const data: RefundRow[] = [
  {
    id: "ref-1",
    refundId: "RFD-5511",
    member: "Mike Chen",
    amount: "₦15,000",
    reason: "Duplicate charge",
    status: "approved",
    date: "18th Mar, 2026",
    location: "Westside",
  },
  {
    id: "ref-2",
    refundId: "RFD-5512",
    member: "Lisa Park",
    amount: "₦45,000",
    reason: "Membership cancellation",
    status: "pending",
    date: "19th Mar, 2026",
    location: "Downtown",
  },
  {
    id: "ref-3",
    refundId: "RFD-5513",
    member: "Tom Harris",
    amount: "₦15,000",
    reason: "Billing error",
    status: "rejected",
    date: "17th Mar, 2026",
    location: "Downtown",
  },
];

const columns: ColumnDef<RefundRow>[] = [
  { accessorKey: "refundId", header: "Refund ID" },
  { accessorKey: "member", header: "Member" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "reason", header: "Reason" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "destructive";
      if (status === "approved") {
        variant = "default";
      } else if (status === "pending") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "date", header: "Date" },
];

export default function Page() {
  return (
    <ScheduleStyleTablePage
      title="Refunds"
      description="Track refund requests and payout decisions."
      columns={columns}
      data={data}
      emptyMessage="No refunds found."
    />
  );
}

