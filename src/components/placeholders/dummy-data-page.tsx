import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

type DummyDataPageProps = {
  title: string;
  description?: string;
};

export function DummyDataPage({
  title,
  description = "This section is using dummy data for now.",
}: DummyDataPageProps) {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="text-muted-foreground mt-2 text-sm">{description}</p>
            </div>
            <Badge variant="outline">Dummy data</Badge>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardContent className="space-y-3 py-6">
              <p className="text-sm text-muted-foreground">
                Coming soon. Once backend support is ready, this page will be
                wired to real APIs and loading states.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

