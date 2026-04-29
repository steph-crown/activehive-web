import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeSelectProps = {
  value: string; // "HH:mm" 24-hour format, or ""
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

function parse24h(time: string): {
  hour: string;
  minute: string;
  period: "AM" | "PM";
} | null {
  if (!time?.includes(":")) return null;
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return null;
  const period: "AM" | "PM" = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const roundedMin = Math.round(m / 5) * 5;
  const minute = String(roundedMin >= 60 ? 0 : roundedMin).padStart(2, "0");
  return { hour: String(hour12), minute, period };
}

function to24h(hour: string, minute: string, period: string): string {
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

export function TimeSelect({
  value,
  onChange,
  disabled,
  className,
}: TimeSelectProps) {
  const parsed = parse24h(value);
  const hour = parsed?.hour ?? "";
  const minute = parsed?.minute ?? "";
  const period = parsed?.period ?? "AM";

  const emit = (h: string, m: string, p: string) => {
    if (!h || !m) return;
    onChange(to24h(h, m, p));
  };

  return (
    <div className={cn("flex gap-1.5", className)}>
      <Select
        value={hour}
        onValueChange={(h) => emit(h, minute || "00", period)}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 flex-1">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h.padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={minute}
        onValueChange={(m) => emit(hour || "12", m, period)}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 flex-1">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={period}
        onValueChange={(p) => emit(hour || "12", minute || "00", p)}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
