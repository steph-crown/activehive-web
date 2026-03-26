import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import {
  IconDots,
  IconEdit,
  IconEye,
  IconPlus,
  IconQrcode,
  IconUserOff,
} from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useMembersQuery } from "../services";
import type { MemberSubscription } from "../types";

export function MembersPage() {
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  const [suspendTarget, setSuspendTarget] = React.useState<MemberSubscription | null>(
    null,
  );
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const effectiveLocationId =
    locationFilter === "all" ? undefined : locationFilter;

  const { data: members, isLoading } = useMembersQuery(effectiveLocationId);

  const membersColumns = React.useMemo<ColumnDef<MemberSubscription>[]>(
    () => [
      {
        accessorKey: "member.firstName",
        header: "Name",
        cell: ({ row }) => {
          const member = row.original.member;
          return (
            <div className="font-medium">
              {member.firstName} {member.lastName}
            </div>
          );
        },
      },
      {
        accessorKey: "member.email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-sm">{row.original.member.email}</div>
        ),
      },
      {
        accessorKey: "member.phoneNumber",
        header: "Phone",
        cell: ({ row }) => {
          const phone = row.original.member.phoneNumber;
          return <div className="text-sm">{phone || "N/A"}</div>;
        },
      },
      {
        accessorKey: "membershipPlan.name",
        header: "Membership Plan",
        cell: ({ row }) => (
          <div className="text-sm">{row.original.membershipPlan.name}</div>
        ),
      },
      {
        accessorKey: "location.locationName",
        header: "Location",
        cell: ({ row }) => (
          <div className="text-sm">{row.original.location.locationName}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const variant =
            status === "active"
              ? "default"
              : status === "pending"
                ? "secondary"
                : "destructive";
          return (
            <Badge variant={variant} className="capitalize">
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const member = row.original.member;
          const fullName = `${member.firstName} ${member.lastName}`;

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => showSuccess("Check-in", `${fullName} has been checked in`)}
              >
                <IconQrcode className="size-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <IconDots className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/dashboard/members/${row.original.id}`)}
                  >
                    <IconEye className="mr-2 size-4" />
                    View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/dashboard/members/${row.original.id}/edit`)}
                  >
                    <IconEdit className="mr-2 size-4" />
                    Edit member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => setSuspendTarget(row.original)}
                  >
                    <IconUserOff className="mr-2 size-4" />
                    Suspend
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [navigate, showSuccess],
  );

  const filteredMembers = React.useMemo(() => {
    const rows = members || [];
    return rows.filter((member) => {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${member.member.firstName} ${member.member.lastName} ${member.member.email} ${member.membershipPlan.name}`
          .toLowerCase()
          .includes(normalizedSearch);

      if (!dateFilter) return matchesSearch;
      const selectedDate = new Date(dateFilter).toLocaleDateString();
      const rowDate = new Date(member.createdAt).toLocaleDateString();
      return matchesSearch && rowDate === selectedDate;
    });
  }, [dateFilter, members, searchQuery]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Members</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym members and their information.
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/members/new")}>
            <IconPlus className="h-4 w-4 " />
            Add Member
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search members..."
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
            dateValue={dateFilter}
            onDateChange={setDateFilter}
          />

          <DataTable
            data={filteredMembers}
            columns={membersColumns}
            enableTabs={false}
            getRowId={(row) => row.id}
            emptyMessage="No members found."
            isLoading={isLoading}
          />
        </div>
      </div>
      <Dialog open={!!suspendTarget} onOpenChange={() => setSuspendTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend member?</DialogTitle>
            <DialogDescription>
              This is a UI-only action for now.{" "}
              {suspendTarget
                ? `${suspendTarget.member.firstName} ${suspendTarget.member.lastName} will be marked as suspended in the interface.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!suspendTarget) return;
                showSuccess(
                  "Member suspended",
                  `${suspendTarget.member.firstName} ${suspendTarget.member.lastName} has been suspended.`,
                );
                setSuspendTarget(null);
              }}
            >
              Confirm Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
