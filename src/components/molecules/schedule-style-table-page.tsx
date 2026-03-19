import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/molecules/data-table";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
};

export function ScheduleStyleTablePage<T extends WithLocation>({
  title,
  description,
  columns,
  data,
  emptyMessage,
}: Readonly<ScheduleStyleTablePageProps<T>>) {
  const [locationFilter, setLocationFilter] = useState("all");

  const locations = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.location) unique.add(item.location);
    });
    return Array.from(unique);
  }, [data]);

  const filteredData = useMemo(() => {
    if (locationFilter === "all") return data;
    return data.filter((item) => item.location === locationFilter);
  }, [data, locationFilter]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>

        <div className="px-4 lg:px-6">
          <div className="space-y-4">
            <div className="w-max">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DataTable
              data={filteredData}
              columns={columns}
              getRowId={(row) => row.id}
              emptyMessage={emptyMessage}
              enableDragAndDrop={false}
              enableColumnVisibility={false}
              enableRowSelection={false}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
