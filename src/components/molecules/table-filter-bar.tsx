import type { ReactNode } from "react";
import { useEffect } from "react";
import { IconCalendar, IconDownload, IconFilter, IconSearch } from "@tabler/icons-react";
import { InlineLabeledDateField } from "@/components/molecules/inline-labeled-date-field";
import { useLocationStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type TableFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  locationValue: string;
  onLocationChange: (value: string) => void;
  locations: Option[];
  locationDisabled?: boolean;
  showMethodFilter?: boolean;
  methodValue?: string;
  onMethodChange?: (value: string) => void;
  methodOptions?: Option[];
  dateValue?: string;
  onDateChange?: (value: string) => void;
  /** When set with `onDateToChange`, shows a second date field for the end of the range. */
  dateToValue?: string;
  onDateToChange?: (value: string) => void;
  actionLabel?: string;
  onActionClick?: () => void;
  actionNode?: ReactNode;
};

export function TableFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  locationValue,
  onLocationChange,
  locations,
  locationDisabled = false,
  showMethodFilter = false,
  methodValue = "all",
  onMethodChange,
  methodOptions = [],
  dateValue,
  onDateChange,
  dateToValue,
  onDateToChange,
  actionLabel = "Export",
  onActionClick,
  actionNode,
}: Readonly<TableFilterBarProps>) {
  const { selectedLocationId } = useLocationStore();
  const showLocationDropdown = selectedLocationId === null;

  useEffect(() => {
    if (
      selectedLocationId != null &&
      locationValue !== selectedLocationId
    ) {
      onLocationChange(selectedLocationId);
    }
  }, [selectedLocationId, locationValue, onLocationChange]);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[260px] flex-1">
        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 border-[#F4F4F4] bg-white pl-9"
        />
      </div>

      {showLocationDropdown ? (
        <Select
          value={locationValue}
          onValueChange={onLocationChange}
          disabled={locationDisabled}
        >
          <SelectTrigger className="h-10 w-[180px] border-[#F4F4F4] bg-white">
            <div className="flex items-center gap-2">
              <IconFilter className="size-4" />
              <SelectValue placeholder="All Locations" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {showMethodFilter ? (
        <Select value={methodValue} onValueChange={onMethodChange}>
          <SelectTrigger className="h-10 w-[180px] border-[#F4F4F4] bg-white">
            <div className="flex items-center gap-2">
              <IconFilter className="size-4" />
              <SelectValue placeholder="All Methods" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {methodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {onDateToChange != null ? (
        <>
          <InlineLabeledDateField
            id="filter-date-from"
            label="From"
            value={dateValue ?? ""}
            onChange={(value) => onDateChange?.(value)}
            className="border-[#F4F4F4] bg-white shadow-none"
          />
          <InlineLabeledDateField
            id="filter-date-to"
            label="To"
            value={dateToValue ?? ""}
            onChange={onDateToChange}
            className="border-[#F4F4F4] bg-white shadow-none"
          />
        </>
      ) : onDateChange != null ? (
        <div className="relative">
          <Label htmlFor="filter-date" className="sr-only">
            Date
          </Label>
          <Input
            id="filter-date"
            type="date"
            value={dateValue ?? ""}
            onChange={(event) => onDateChange(event.target.value)}
            className="h-10 w-[145px] border-[#F4F4F4] bg-white pr-9"
          />
          <IconCalendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
      ) : null}

      {actionNode ?? (
        <Button
          variant="outline"
          className="h-10 border-[#F4F4F4]"
          onClick={onActionClick}
        >
          <IconDownload className="mr-1 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
