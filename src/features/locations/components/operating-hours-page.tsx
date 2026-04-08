import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import type { LocationOperatingHoursDay } from "../types";
import {
  useLocationQuery,
  useOperatingHoursQuery,
  usePutOperatingHoursMutation,
} from "../services";
import {
  mergeOperatingHoursApi,
  toPutOperatingHoursPayload,
} from "../lib/merge-operating-hours";
import type { OperatingHoursLocationState } from "../constants/operating-hours-nav";

/** Monday → Sunday display order; `dayOfWeek` still 0–6 (Sun–Sat) for the API. */
const DISPLAY_ORDER: readonly number[] = [1, 2, 3, 4, 5, 6, 0];

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function formatSummary(row: LocationOperatingHoursDay) {
  if (!row.isOpen) {
    return "Closed";
  }
  return `Open · ${row.openingTime} – ${row.closingTime}`;
}

function createTimeOptions() {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of ["00", "30"]) {
      options.push(`${String(hour).padStart(2, "0")}:${minute}`);
    }
  }
  return options;
}

export function OperatingHoursPage() {
  const { id: locationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { showSuccess, showError } = useToast();
  const timeOptions = useMemo(() => createTimeOptions(), []);

  const { data: locationRes } = useLocationQuery(locationId ?? "");
  const {
    data: hoursData,
    isLoading: hoursLoading,
    isError: hoursError,
    error: hoursQueryError,
  } = useOperatingHoursQuery(locationId);
  const putHours = usePutOperatingHoursMutation(locationId ?? "");

  const [schedule, setSchedule] = useState<LocationOperatingHoursDay[]>([]);
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("1");

  const locationName = locationRes?.location?.locationName;

  const entry = (locationState as OperatingHoursLocationState | null)
    ?.operatingHoursFrom;
  const backHref =
    entry === "locations"
      ? "/dashboard/locations"
      : `/dashboard/locations/${locationId}`;
  const backLabel =
    entry === "locations"
      ? "Back to Locations"
      : `Back to ${locationName?.trim() ? locationName : "location"}`;

  useEffect(() => {
    if (hoursData !== undefined) {
      setSchedule(mergeOperatingHoursApi(hoursData));
    }
  }, [hoursData]);

  const orderedRows = useMemo(() => {
    return DISPLAY_ORDER.map((dw) =>
      schedule.find((s) => s.dayOfWeek === dw),
    ).filter((r): r is LocationOperatingHoursDay => r != null);
  }, [schedule]);

  const updateDay = (
    dayOfWeek: number,
    update: Partial<LocationOperatingHoursDay>,
  ) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, ...update } : item,
      ),
    );
  };

  const handleCancel = () => {
    if (hoursData !== undefined) {
      setSchedule(mergeOperatingHoursApi(hoursData));
    }
  };

  const handleSave = () => {
    if (!locationId) return;
    putHours.mutate(toPutOperatingHoursPayload(schedule), {
      onSuccess: () => {
        showSuccess("Saved", "Operating hours updated for this location.");
      },
      onError: (err) => {
        showError(
          "Could not save",
          getApiErrorMessage(err, "Failed to update operating hours."),
        );
      },
    });
  };

  if (!locationId) {
    return <Navigate to="/dashboard/locations" replace />;
  }

  const loading = hoursLoading;
  const hasError = hoursError;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="space-y-4 px-4 lg:px-6">
          <Button
            type="button"
            variant="ghost"
            className="w-fit -ml-2 has-[>svg]:px-2"
            onClick={() => navigate(backHref)}
          >
            ← {backLabel}
          </Button>
          <div>
            <h1 className="text-3xl font-medium">Operating hours</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {locationName ? (
                <>
                  Weekly schedule for{" "}
                  <span className="text-foreground font-medium">
                    {locationName}
                  </span>
                  . Changes apply to this location only.
                </>
              ) : (
                "Set opening days and times for this location."
              )}
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          {loading ? (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <Skeleton className="h-8 w-64" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </Card>
          ) : hasError ? (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <p className="text-destructive text-sm">
                {getApiErrorMessage(
                  hoursQueryError,
                  "Could not load operating hours.",
                )}
              </p>
            </Card>
          ) : (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <Accordion
                type="single"
                collapsible
                value={openAccordionItem}
                onValueChange={setOpenAccordionItem}
                className="w-full"
              >
                {orderedRows.map((item) => (
                  <AccordionItem
                    key={item.dayOfWeek}
                    value={String(item.dayOfWeek)}
                    className="border-b border-[#F4F4F4]"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex w-full items-center justify-between pr-4">
                        <span className="text-sm font-semibold">
                          {DAY_LABELS[item.dayOfWeek]}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {formatSummary(item)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={item.isOpen}
                            onCheckedChange={(checked) =>
                              updateDay(item.dayOfWeek, { isOpen: checked })
                            }
                            aria-label={`${DAY_LABELS[item.dayOfWeek]} open status`}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Open on this day
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {item.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>

                        {item.isOpen ? (
                          <div className="flex flex-wrap gap-4">
                            <div className="grid gap-2">
                              <span className="text-sm font-medium">From</span>
                              <Select
                                value={item.openingTime}
                                onValueChange={(value) =>
                                  updateDay(item.dayOfWeek, {
                                    openingTime: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[220px]">
                                  <SelectValue placeholder="Opening time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem
                                      key={`${item.dayOfWeek}-open-${time}`}
                                      value={time}
                                    >
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <span className="text-sm font-medium">To</span>
                              <Select
                                value={item.closingTime}
                                onValueChange={(value) =>
                                  updateDay(item.dayOfWeek, {
                                    closingTime: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[220px]">
                                  <SelectValue placeholder="Closing time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem
                                      key={`${item.dayOfWeek}-close-${time}`}
                                      value={time}
                                    >
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            This location is closed on{" "}
                            {DAY_LABELS[item.dayOfWeek]}.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={putHours.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={putHours.isPending}
                  disabled={schedule.length !== 7 || putHours.isPending}
                >
                  Save changes
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
