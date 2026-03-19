import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { PermissionsTab } from "./permissions-tab";

export function PermissionsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Permissions</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage staff permissions and access control.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6 mt-6">
          <PermissionsTab />
        </div>
      </div>
    </DashboardLayout>
  );
}

