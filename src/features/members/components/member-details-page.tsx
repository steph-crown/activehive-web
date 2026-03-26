import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCreditCard,
  IconCalendar,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useMembersQuery } from "../services";

export function MemberDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: members, isLoading } = useMembersQuery();

  const member = useMemo(
    () => members?.find((item) => item.id === id || item.memberId === id),
    [id, members],
  );

  const fullName = member
    ? `${member.member.firstName} ${member.member.lastName}`
    : "Member";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">{fullName}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isLoading
                ? "Loading member profile..."
                : "Member profile overview and activity"}
            </p>
          </div>
          <Button
            onClick={() =>
              navigate(`/dashboard/members/${id}/edit`)
            }
          >
            <IconEdit className="h-4 w-4" />
            Edit Member
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-3">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none xl:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Profile</h2>
            {member ? (
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <IconMail className="size-4 text-muted-foreground" />
                  <span>{member.member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="size-4 text-muted-foreground" />
                  <span>{member.member.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="size-4 text-muted-foreground" />
                  <span>{member.location.locationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCreditCard className="size-4 text-muted-foreground" />
                  <span>{member.membershipPlan.name}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Member profile not found in current dataset.
              </p>
            )}
          </Card>

          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <h2 className="mb-4 text-lg font-semibold">Membership</h2>
            {member ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="capitalize">{member.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span>{member.membershipPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Start</span>
                  <span>{new Date(member.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">End</span>
                  <span>{new Date(member.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No membership data.</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-3">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <h3 className="mb-3 text-base font-semibold">Emergency Contact</h3>
            <p className="text-sm text-muted-foreground">Jane Doe (Sibling)</p>
            <p className="text-sm text-muted-foreground">+2348000000000</p>
          </Card>
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <h3 className="mb-3 text-base font-semibold">Health & Fitness</h3>
            <p className="text-sm text-muted-foreground">
              Goals: General Fitness, Endurance
            </p>
            <p className="text-sm text-muted-foreground">Conditions: None reported</p>
          </Card>
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
              <IconCalendar className="size-4" />
              Agreements
            </h3>
            <p className="text-sm text-muted-foreground">
              Terms accepted: Yes (dummy data)
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
