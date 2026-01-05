import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useMembersQuery } from "../services";
import type { Member } from "../types";
import { CreateMemberModal } from "./create-member-modal";

const membersColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName;
      return (
        <div className="font-medium">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string | undefined;
      return (
        <div className="text-sm">{phone || "N/A"}</div>
      );
    },
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
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isEmailVerified") as boolean;
      return (
        <Badge variant={isVerified ? "default" : "secondary"}>
          {isVerified ? "Verified" : "Unverified"}
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
];

export function MembersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: members, isLoading, refetch } = useMembersQuery();

  const handleModalSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground mt-2">
              Manage your gym members and their information.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <BlockLoader />
            </div>
          ) : (
            <DataTable
              data={members || []}
              columns={membersColumns}
              enableTabs={false}
              getRowId={(row) => row.id}
              emptyMessage="No members found."
            />
          )}
        </div>
      </div>

      <CreateMemberModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}
