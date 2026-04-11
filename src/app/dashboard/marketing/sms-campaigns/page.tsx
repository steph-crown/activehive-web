import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduleStyleTablePage } from "@/components/molecules/schedule-style-table-page";

type SmsCampaignRow = {
  id: string;
  campaign: string;
  recipients: number;
  sent: string;
  status: "sent" | "scheduled" | "draft";
  location: string;
};

const data: SmsCampaignRow[] = [
  {
    id: "sms-1",
    campaign: "Weekend Flash Promo",
    recipients: 420,
    sent: "20th Mar, 2026",
    status: "sent",
    location: "Downtown",
  },
  {
    id: "sms-2",
    campaign: "Monthly Reminder",
    recipients: 310,
    sent: "22nd Mar, 2026",
    status: "scheduled",
    location: "Westside",
  },
  {
    id: "sms-3",
    campaign: "Class Slot Update",
    recipients: 180,
    sent: "—",
    status: "draft",
    location: "Downtown",
  },
];

const columns: ColumnDef<SmsCampaignRow>[] = [
  { accessorKey: "campaign", header: "Campaign" },
  { accessorKey: "recipients", header: "Recipients" },
  { accessorKey: "sent", header: "Sent" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "secondary";
      if (status === "sent") {
        variant = "default";
      } else if (status === "draft") {
        variant = "destructive";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Button variant="outline" size="sm">
          {status === "draft" ? "Edit" : "View"}
        </Button>
      );
    },
  },
];

export default function Page() {
  return (
    <ScheduleStyleTablePage
      title="SMS Campaigns"
      description="Create and monitor SMS campaign performance."
      columns={columns}
      data={data}
      emptyMessage="No SMS campaigns found."
    />
  );
}

