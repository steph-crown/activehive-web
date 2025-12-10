import { DashboardLayout } from "./dashboard-layout";

export function MembersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground mt-2">
            Manage your gym members and their information.
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              Members management coming soon...
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
