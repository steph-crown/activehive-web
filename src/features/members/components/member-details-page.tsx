import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useMemberByIdQuery } from "../services";
import type { GymMemberDetail } from "../types";
import { MemberDetailTabPanels } from "./member-detail-tab-panels";

function dash(v: string | null | undefined): string {
  if (v == null) return "—";
  const s = String(v).trim();
  return s.length ? s : "—";
}

function displayFullName(d: GymMemberDetail): string {
  const o = d.member.fullNameOverride?.trim();
  if (o) return o;
  const n = `${d.member.firstName} ${d.member.lastName}`.trim();
  return n || "—";
}

function displayTrainer(d: GymMemberDetail): string {
  if (d.assignedTrainerName?.trim()) return d.assignedTrainerName.trim();
  const t = d.trainer;
  if (!t) return "—";
  if (t.fullName?.trim()) return t.fullName.trim();
  const n = `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim();
  return n || "—";
}

function LabeledRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function formatAccountStatusLabel(status: string): string {
  const t = status.trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function AccountStatusBadge({ status }: { status: string }) {
  const s = status.trim().toLowerCase();
  const label = formatAccountStatusLabel(status);
  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit font-medium",
        s === "active" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50",
        s === "pending" &&
          "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50",
        s === "inactive" &&
          "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/10",
        s !== "active" &&
          s !== "pending" &&
          s !== "inactive" &&
          "border-border",
      )}
    >
      {label}
    </Badge>
  );
}

const TAB_ITEMS = [
  { value: "overview", label: "Overview" },
  { value: "gym-profile", label: "Gym Profile" },
  { value: "health", label: "Health & Safety" },
  { value: "membership", label: "Membership" },
  { value: "attendance", label: "Attendance" },
  { value: "payments", label: "Payments" },
  { value: "documents", label: "Documents" },
] as const;

export function MemberDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: detail, isLoading, isError, error } = useMemberByIdQuery(id);

  const pageTitle = detail ? displayFullName(detail) : "Member";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between gap-4 px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">{pageTitle}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isLoading
                ? "Loading member…"
                : "Member details, membership, and activity"}
            </p>
          </div>
          <Button
            onClick={() => id && navigate(`/dashboard/members/${id}/edit`)}
            disabled={!id}
          >
            Edit member
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
            <Card className="rounded-md border-[#F4F4F4] p-6 shadow-none">
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </Card>
          </div>
        )}

        {isError && (
          <div className="px-4 lg:px-6">
            <Card className="rounded-md border-destructive/30 bg-destructive/5 p-6 shadow-none">
              <p className="text-destructive text-sm font-medium">
                {error instanceof Error
                  ? error.message
                  : "Could not load this member."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard/members")}
              >
                Back to members
              </Button>
            </Card>
          </div>
        )}

        {detail && !isLoading && (
          <>
            <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
              <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
                <h2 className="text-lg font-semibold">Member details</h2>
                {/* <p className="text-muted-foreground mb-4 text-xs">
                  Core contact and assignment for this member at your gym.
                </p> */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <LabeledRow
                    label="Full name"
                    value={displayFullName(detail)}
                  />
                  <LabeledRow label="Email" value={dash(detail.member.email)} />
                  <LabeledRow
                    label="Phone"
                    value={dash(detail.member.phoneNumber)}
                  />
                  <LabeledRow
                    label="Gender"
                    value={dash(detail.member.gender)}
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-foreground">
                      Account status
                    </p>
                    {detail.memberAccountStatus?.trim() ? (
                      <AccountStatusBadge
                        status={detail.memberAccountStatus}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                  <LabeledRow
                    label="Location"
                    value={dash(detail.location?.locationName)}
                  />
                  <LabeledRow label="Trainer" value={displayTrainer(detail)} />
                </div>
              </Card>

              <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
                <h2 className="text-lg font-semibold">Membership</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="capitalize">{detail.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-right font-medium">
                      {dash(detail.membershipPlan?.name)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Start</span>
                    <span>
                      {new Date(detail.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">End</span>
                    <span>{new Date(detail.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="px-4 lg:px-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-muted text-muted-foreground flex h-auto min-h-9 w-full flex-wrap justify-start gap-1 rounded-lg p-[3px]">
                  {TAB_ITEMS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <MemberDetailTabPanels detail={detail} />
              </Tabs>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
