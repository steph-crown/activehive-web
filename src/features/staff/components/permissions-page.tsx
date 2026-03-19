import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { PermissionsTab } from "./permissions-tab";

export function PermissionsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PermissionsTab />
      </div>
    </DashboardLayout>
  );
}

