import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";

type InvoiceRow = {
  id: string;
  invoice: string;
  member: string;
  amount: string;
  issued: string;
  due: string;
  status: "paid" | "pending" | "overdue";
  location: string;
};

const data: InvoiceRow[] = [
  {
    id: "inv-1",
    invoice: "INV-1001",
    member: "Sarah Johnson",
    amount: "₦45,000",
    issued: "Mar 01, 2026",
    due: "Mar 08, 2026",
    status: "paid",
    location: "Downtown",
  },
  {
    id: "inv-2",
    invoice: "INV-1002",
    member: "Emma Wilson",
    amount: "₦120,000",
    issued: "Mar 10, 2026",
    due: "Mar 17, 2026",
    status: "pending",
    location: "Westside",
  },
  {
    id: "inv-3",
    invoice: "INV-1003",
    member: "James Brown",
    amount: "₦15,000",
    issued: "Mar 05, 2026",
    due: "Mar 12, 2026",
    status: "overdue",
    location: "Downtown",
  },
];

const columns: ColumnDef<InvoiceRow>[] = [
  { accessorKey: "invoice", header: "Invoice" },
  { accessorKey: "member", header: "Member" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "issued", header: "Issued" },
  { accessorKey: "due", header: "Due" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "destructive";
      if (status === "paid") {
        variant = "default";
      } else if (status === "pending") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export default function Page() {
  return (
    <ScheduleStyleTablePage
      title="Invoices"
      description="Manage issued invoices and due payments."
      columns={columns}
      data={data}
      emptyMessage="No invoices found."
    />
  );
}

