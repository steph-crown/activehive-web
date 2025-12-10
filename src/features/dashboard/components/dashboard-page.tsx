import { BlockLoader } from "@/components/loader/block-loader";
import { DashboardLayout } from "./dashboard-layout";
import { WelcomeMessage } from "./welcome-message";
import { SectionCards } from "./section-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DashboardDocumentsTable } from "./dashboard-documents-table";
import { useDashboardDocumentsQuery } from "../services";

export function DashboardPage() {
  const { data, isLoading } = useDashboardDocumentsQuery();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <WelcomeMessage />
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        {isLoading || !data ? (
          <div className="flex items-center justify-center py-10">
            <BlockLoader />
          </div>
        ) : (
          <DashboardDocumentsTable data={data} />
        )}
      </div>
    </DashboardLayout>
  );
}
