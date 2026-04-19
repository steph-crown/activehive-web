import { InlineLabeledDateField } from "@/components/molecules/inline-labeled-date-field";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

type DashboardOverviewFiltersProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearRange: () => void;
  /** Primary Export action — rendered to the right of Reset. */
  onExportClick?: () => void | Promise<void>;
  exportLoading?: boolean;
};

export function DashboardOverviewFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearRange,
  onExportClick,
  exportLoading = false,
}: Readonly<DashboardOverviewFiltersProps>) {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch lg:max-w-max lg:items-end lg:self-end">
      {/* From / To / Reset / Export stay on one row; start-aligned when stacked below title (sm/md), end-aligned beside title (lg+). */}
      <div className="-mx-1 flex max-w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto px-1 sm:gap-3 lg:justify-end">
        <InlineLabeledDateField
          id="dashboard-range-start"
          label="From"
          value={startDate}
          onChange={onStartDateChange}
        />
        <InlineLabeledDateField
          id="dashboard-range-end"
          label="To"
          value={endDate}
          onChange={onEndDateChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 shrink-0"
          onClick={onClearRange}
        >
          Reset
        </Button>
        {onExportClick != null ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-10 shrink-0"
            loading={exportLoading}
            onClick={() => void onExportClick()}
          >
            <IconDownload className="size-4" />
            Export
          </Button>
        ) : null}
      </div>
    </div>
  );
}
