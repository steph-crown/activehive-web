import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { RolesTab } from "./roles-tab";

export function RolesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <RolesTab />
      </div>
    </DashboardLayout>
  );
}

