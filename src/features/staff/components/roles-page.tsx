import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { RolesTab } from "./roles-tab";

export function RolesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Roles</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage staff roles and their permissions.
            </p>
          </div>
        </div> */}

        <div className="px-4 lg:px-6">
          <RolesTab />
        </div>
      </div>
    </DashboardLayout>
  );
}
