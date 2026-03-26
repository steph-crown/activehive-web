import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DaySchedule = {
  day: DayKey;
  label: string;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
};

const defaultSchedule: DaySchedule[] = [
  {
    day: "monday",
    label: "Monday",
    isOpen: true,
    openingTime: "06:00",
    closingTime: "22:00",
  },
  {
    day: "tuesday",
    label: "Tuesday",
    isOpen: true,
    openingTime: "06:00",
    closingTime: "22:00",
  },
  {
    day: "wednesday",
    label: "Wednesday",
    isOpen: true,
    openingTime: "06:00",
    closingTime: "22:00",
  },
  {
    day: "thursday",
    label: "Thursday",
    isOpen: true,
    openingTime: "06:00",
    closingTime: "22:00",
  },
  {
    day: "friday",
    label: "Friday",
    isOpen: true,
    openingTime: "06:00",
    closingTime: "22:00",
  },
  {
    day: "saturday",
    label: "Saturday",
    isOpen: true,
    openingTime: "08:00",
    closingTime: "20:00",
  },
  {
    day: "sunday",
    label: "Sunday",
    isOpen: false,
    openingTime: "08:00",
    closingTime: "18:00",
  },
];

function formatSummary(schedule: DaySchedule) {
  if (!schedule.isOpen) {
    return "Closed";
  }
  return `Open • ${schedule.openingTime} - ${schedule.closingTime}`;
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
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("monday");
  const timeOptions = useMemo(() => createTimeOptions(), []);

  const updateDay = (day: DayKey, update: Partial<DaySchedule>) => {
    setSchedule((prev) =>
      prev.map((item) => (item.day === day ? { ...item, ...update } : item)),
    );
  };

  const handleCancel = () => {
    setSchedule(defaultSchedule);
  };

  const handleSave = () => {
    console.log("Save operating hours", { locationId: id, schedule });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-medium">Operating Hours</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Set opening days and hours for this location.
          </p>
        </div>

        <div className="px-4 lg:px-6">
          <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
            <Accordion
              type="single"
              collapsible
              value={openAccordionItem}
              onValueChange={setOpenAccordionItem}
              className="w-full"
            >
              {schedule.map((item) => (
                <AccordionItem
                  key={item.day}
                  value={item.day}
                  className="border-b border-[#F4F4F4]"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center justify-between pr-4">
                      <span className="text-sm font-semibold">
                        {item.label}
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
                            updateDay(item.day, { isOpen: checked })
                          }
                          aria-label={`${item.label} open status`}
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
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <span className="text-sm font-medium">From</span>
                            <Select
                              value={item.openingTime}
                              onValueChange={(value) =>
                                updateDay(item.day, { openingTime: value })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select opening time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={`${item.day}-open-${time}`}
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
                                updateDay(item.day, { closingTime: value })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select closing time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={`${item.day}-close-${time}`}
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
                          This location is marked as closed for {item.label}.
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
