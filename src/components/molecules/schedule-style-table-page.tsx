import { useMemo, useState, type ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/molecules/data-table";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { formatDisplayDate } from "@/lib/display-datetime";

type WithLocation = {
  id: string;
  location?: string;
};

type ScheduleStyleTablePageProps<T extends WithLocation> = {
  title: string;
  description: string;
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage: string;
  /** Rendered in the page header row (e.g. primary action). */
  headerActions?: ReactNode;
  /** When true, shows a skeleton instead of the data table. */
  isLoading?: boolean;
};

export function ScheduleStyleTablePage<T extends WithLocation>({
  title,
  description,
  columns,
  data,
  emptyMessage,
  headerActions,
  isLoading = false,
}: Readonly<ScheduleStyleTablePageProps<T>>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const locationOptions = useMemo(
    () =>
      (locations ?? []).map((location) => ({
        value: location.id,
        label: location.locationName,
      })),
    [locations],
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const selectedLocationName =
        locationFilter === "all"
          ? undefined
          : locations?.find((location) => location.id === locationFilter)
              ?.locationName;

      const matchesLocation =
        !selectedLocationName || item.location === selectedLocationName;

      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(normalizedSearch),
        );

      if (!dateFilter) {
        return matchesLocation && matchesSearch;
      }

      const needle = formatDisplayDate(`${dateFilter}T12:00:00`);
      const matchesDate =
        needle !== "—" &&
        Object.values(item).some((value) => String(value).includes(needle));

      return matchesLocation && matchesSearch && matchesDate;
    });
  }, [data, dateFilter, locationFilter, locations, searchQuery]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">{title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>
          {headerActions ? (
            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              {headerActions}
            </div>
          ) : null}
        </div>

        <div className="px-4 lg:px-6">
          <div className="space-y-4">
            <TableFilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={`Search ${title.toLowerCase()}...`}
              locationValue={locationFilter}
              onLocationChange={setLocationFilter}
              locations={locationOptions}
              locationDisabled={locationsLoading}
              dateValue={dateFilter}
              onDateChange={setDateFilter}
            />

            {isLoading ? (
              <div className="space-y-3 rounded-md border border-[#F4F4F4] p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={`table-skel-${i}`} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <DataTable
                data={filteredData}
                columns={columns}
                getRowId={(row) => row.id}
                emptyMessage={emptyMessage}
                enableDragAndDrop={false}
                enableColumnVisibility={false}
                enableRowSelection={false}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
