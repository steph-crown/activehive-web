import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InlineDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function InlineLabeledDateField({
  id,
  label,
  value,
  onChange,
  className,
}: Readonly<InlineDateFieldProps>) {
  return (
    <div
      className={cn(
        "border-input bg-background flex h-10 min-w-[10.75rem] items-center gap-2 rounded-md border px-2.5 shadow-xs transition-[color,box-shadow] sm:min-w-[10rem] sm:px-3",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className,
      )}
    >
      <label
        htmlFor={id}
        className="text-muted-foreground shrink-0 cursor-pointer text-sm font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm shadow-none outline-none",
          "text-foreground placeholder:text-muted-foreground",
          "focus-visible:ring-0",
          "[color-scheme:light] dark:[color-scheme:dark]",
          /* Keep native picker usable; tuck indicator so layout stays compact */
          "[&::-webkit-calendar-picker-indicator]:ml-0.5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60",
        )}
      />
      {/* <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="text-muted-foreground -mr-0.5 shrink-0 cursor-pointer border-0 bg-transparent p-0.5"
        onClick={(e) => {
          e.preventDefault();
          openPicker();
        }}
      >
        <IconChevronDown className="size-4" stroke={2} />
      </button> */}
    </div>
  );
}

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
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch lg:max-w-max lg:items-end lg:self-end">
      {/* From / To / Reset stay on one row; start-aligned when stacked below title (sm/md), end-aligned beside title (lg+). */}
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
      </div>
    </div>
  );
}
