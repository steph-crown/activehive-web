import {
  formatClockString12h,
  formatDisplayDate,
} from "@/lib/display-datetime";

/** @deprecated Use formatClockString12h from `@/lib/display-datetime`. */
export const formatTimeTo12h = formatClockString12h;

export function formatScheduleTimeRange12h(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): string {
  return `${formatClockString12h(startTime)} – ${formatClockString12h(endTime)}`;
}

export function formatScheduleDateOnly(isoDate: string): string {
  return formatDisplayDate(isoDate);
}

export function formatScheduleSessionLabel(schedule: {
  date: string;
  startTime: string;
  endTime: string;
}): string {
  return `${formatDisplayDate(schedule.date)} [${formatScheduleTimeRange12h(schedule.startTime, schedule.endTime)}]`;
}
