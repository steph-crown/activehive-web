import { IconMail, IconPlus } from "@tabler/icons-react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Campaign = {
  id: string;
  title: string;
  date: string;
  recipients: number;
  openRate: string;
  status: "Sent" | "Draft";
  actionLabel: string;
};

const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    title: "March Newsletter",
    date: "Mar 10, 2026",
    recipients: 272,
    openRate: "68%",
    status: "Sent",
    actionLabel: "View Details",
  },
  {
    id: "cmp-2",
    title: "New Year Promo",
    date: "Jan 2, 2026",
    recipients: 250,
    openRate: "72%",
    status: "Sent",
    actionLabel: "View Details",
  },
  {
    id: "cmp-3",
    title: "Spring Sale",
    date: "",
    recipients: 0,
    openRate: "—",
    status: "Draft",
    actionLabel: "Edit",
  },
];

export default function Page() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Email Campaigns</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Send email campaigns to members
            </p>
          </div>
          <Button>
            <IconPlus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="gap-4 border-[#F4F4F4] bg-white p-4 shadow-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-[#EEF5FF] text-[#3572D4]">
                      <IconMail className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase">{campaign.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {campaign.date || "—"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={campaign.status === "Sent" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Recipients</p>
                    <p className="font-semibold">{campaign.recipients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Open Rate</p>
                    <p className="font-semibold">{campaign.openRate}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  {campaign.actionLabel}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

