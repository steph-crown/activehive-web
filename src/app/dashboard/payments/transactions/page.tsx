import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";

type TransactionRow = {
  id: string;
  transactionId: string;
  member: string;
  plan: string;
  amount: string;
  status: "successful" | "pending" | "failed";
  date: string;
  location: string;
};

const data: TransactionRow[] = [
  {
    id: "trx-1",
    transactionId: "TXN-90821",
    member: "Sarah Johnson",
    plan: "Monthly",
    amount: "₦45,000",
    status: "successful",
    date: "20th Mar, 2026",
    location: "Downtown",
  },
  {
    id: "trx-2",
    transactionId: "TXN-90822",
    member: "Emma Wilson",
    plan: "Quarterly",
    amount: "₦120,000",
    status: "pending",
    date: "20th Mar, 2026",
    location: "Westside",
  },
  {
    id: "trx-3",
    transactionId: "TXN-90823",
    member: "James Brown",
    plan: "Weekly",
    amount: "₦15,000",
    status: "failed",
    date: "19th Mar, 2026",
    location: "Downtown",
  },
];

const columns: ColumnDef<TransactionRow>[] = [
  { accessorKey: "transactionId", header: "Transaction ID" },
  { accessorKey: "member", header: "Member" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "destructive";
      if (status === "successful") {
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
      title="Transactions"
      description="Track payment activity across members."
      columns={columns}
      data={data}
      emptyMessage="No transactions found."
    />
  );
}

