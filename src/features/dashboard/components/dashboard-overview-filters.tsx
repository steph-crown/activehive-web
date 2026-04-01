import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DashboardOverviewFiltersProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearRange: () => void;
};

export function DashboardOverviewFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearRange,
}: Readonly<DashboardOverviewFiltersProps>) {
  const hasCustomRange = Boolean(startDate.trim() || endDate.trim());

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-2 sm:max-w-md sm:items-end">
      <p className="text-muted-foreground text-right text-xs font-medium">
        {hasCustomRange ? "Custom range" : "Forever (all time)"}
      </p>
      <div className="flex flex-wrap items-end justify-end gap-3">
        <div className="grid min-w-[9.5rem] gap-1.5">
          <Label
            htmlFor="dashboard-range-start"
            className="text-muted-foreground text-xs font-medium"
          >
            Start date
          </Label>
          <Input
            id="dashboard-range-start"
            type="date"
            className="h-10"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div className="grid min-w-[9.5rem] gap-1.5">
          <Label
            htmlFor="dashboard-range-end"
            className="text-muted-foreground text-xs font-medium"
          >
            End date
          </Label>
          <Input
            id="dashboard-range-end"
            type="date"
            className="h-10"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
        {hasCustomRange ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 shrink-0"
            onClick={onClearRange}
          >
            Reset to forever
          </Button>
        ) : null}
      </div>
    </div>
  );
}
