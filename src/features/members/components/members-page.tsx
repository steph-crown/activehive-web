import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { CreateMemberModal } from "./create-member-modal";

export function MembersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleModalSuccess = () => {
    setIsCreateModalOpen(false);
    // TODO: Refetch members data when query is implemented
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
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              Members management coming soon...
            </p>
          </div>
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
