import type {
  LocationOperatingHoursDay,
  PutLocationOperatingHoursPayload,
} from "../types";

function normalizeHhMm(value: string | undefined, fallback: string): string {
  const s = value?.trim() ?? "";
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  return fallback;
}

/**
 * GET may return [] or partial days; PUT requires all 7 (`dayOfWeek` 0–6, Sun–Sat).
 */
export function mergeOperatingHoursApi(
  api: LocationOperatingHoursDay[],
): LocationOperatingHoursDay[] {
  const byDay = new Map<number, LocationOperatingHoursDay>();
  for (const row of api) {
    if (
      typeof row.dayOfWeek === "number" &&
      row.dayOfWeek >= 0 &&
      row.dayOfWeek <= 6
    ) {
      byDay.set(row.dayOfWeek, row);
    }
  }
  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const existing = byDay.get(dayOfWeek);
    if (existing) {
      return {
        dayOfWeek,
        isOpen: Boolean(existing.isOpen),
        openingTime: normalizeHhMm(existing.openingTime, "06:00"),
        closingTime: normalizeHhMm(existing.closingTime, "22:00"),
      };
    }
    return {
      dayOfWeek,
      isOpen: false,
      openingTime: "06:00",
      closingTime: "22:00",
    };
  });
}

export function toPutOperatingHoursPayload(
  schedule: LocationOperatingHoursDay[],
): PutLocationOperatingHoursPayload {
  const sorted = [...schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  return {
    operatingHours: sorted.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      isOpen: d.isOpen,
      openingTime: normalizeHhMm(d.openingTime, "06:00"),
      closingTime: normalizeHhMm(d.closingTime, "22:00"),
    })),
  };
}
