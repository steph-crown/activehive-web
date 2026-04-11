/**
 * Display-only: API / inputs often use `HH:mm` or `HH:mm:ss` (24h).
 * Renders a stable 12-hour clock with AM/PM for US-style UI.
 */
export function formatTimeTo12h(time: string | null | undefined): string {
  if (time == null) return "—";
  const t = String(time).trim();
  if (!t) return "—";

  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(t);
  if (!m) return t;

  let hour = Number.parseInt(m[1] ?? "0", 10);
  const minute = m[2] ?? "00";
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return t;

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${period}`;
}

export function formatScheduleTimeRange12h(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): string {
  return `${formatTimeTo12h(startTime)} – ${formatTimeTo12h(endTime)}`;
}

export function formatScheduleDateOnly(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatScheduleSessionLabel(schedule: {
  date: string;
  startTime: string;
  endTime: string;
}): string {
  const date = formatScheduleDateOnly(schedule.date);
  return `${date} · ${formatScheduleTimeRange12h(schedule.startTime, schedule.endTime)}`;
}
