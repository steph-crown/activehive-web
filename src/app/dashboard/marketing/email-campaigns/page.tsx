import { useState } from "react";
import { IconMail, IconPlus } from "@tabler/icons-react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
  const { showSuccess } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCampaign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreateModalOpen(false);
    showSuccess("Campaign created", "Email campaign has been saved as draft.");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Email Campaigns</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Send email campaigns to members
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="gap-4 rounded-md border-[#F4F4F4] bg-white p-5 shadow-none transition-all hover:shadow-[0_16px_34px_-26px_rgba(0,0,0,0.24)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <IconMail className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase">{campaign.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {campaign.date || "—"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      campaign.status === "Sent" ? "default" : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-md bg-[#FAFAFA] p-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Recipients</p>
                    <p className="font-bebas text-2xl leading-none">{campaign.recipients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Open Rate</p>
                    <p className="font-bebas text-2xl leading-none">{campaign.openRate}</p>
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

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bebas tracking-wide">
              NEW EMAIL CAMPAIGN
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Campaign Name *</Label>
              <Input placeholder="e.g. April Newsletter" required />
            </div>
            <div className="space-y-1.5">
              <Label>Subject Line *</Label>
              <Input placeholder="Your email subject" required />
            </div>
            <div className="space-y-1.5">
              <Label>Recipients</Label>
              <Select>
                <SelectTrigger className="!h-10 w-full">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Members</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Message *</Label>
              <Textarea placeholder="Write your email content..." rows={5} required />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Draft</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
