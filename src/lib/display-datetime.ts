/**
 * App-wide display formats for dates and times (tables, detail views, tooltips).
 * Date: "12th Jul, 2024"
 * Time: "02:34am"
 * Combined: "12th Jul, 2024 [02:34am]"
 */

function toDate(input: string | Date | null | undefined): Date | null {
  if (input == null || input === "") return null;
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function displayOrdinalDay(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** Calendar date only: `12th Jul, 2024` */
export function formatDisplayDate(
  input: string | Date | null | undefined,
): string {
  const d = toDate(input);
  if (!d) return "—";
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${displayOrdinalDay(day)} ${month}, ${year}`;
}

/** Time only (from a full datetime): `02:34am` */
export function formatDisplayTime(
  input: string | Date | null | undefined,
): string {
  const d = toDate(input);
  if (!d) return "—";
  let h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "pm" : "am";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}${period}`;
}

/** Date + time: `12th Jul, 2024 [02:34am]` */
export function formatDisplayDateTime(
  input: string | Date | null | undefined,
): string {
  const d = toDate(input);
  if (!d) return "—";
  return `${formatDisplayDate(d)} [${formatDisplayTime(d)}]`;
}

/**
 * Local calendar key `YYYY-MM-DD` for filter comparisons (avoids locale string mismatches).
 */
export function localCalendarDateKey(
  input: string | Date | null | undefined,
): string | null {
  const d = toDate(input);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 24h clock fragment only (`09:00`, `09:00:00`) → `09:00am` style (no space before am/pm).
 */
export function formatClockString12h(clock: string | null | undefined): string {
  if (clock == null) return "—";
  const t = String(clock).trim();
  if (!t) return "—";
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(t);
  if (!m) return t;
  let hour = Number.parseInt(m[1] ?? "0", 10);
  const minute = m[2] ?? "00";
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return t;
  const period = hour >= 12 ? "pm" : "am";
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${minute}${period}`;
}
