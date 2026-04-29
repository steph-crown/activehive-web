import * as React from "react";
import { Popover } from "radix-ui";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsed = parse24h(value);
  const [hour, setHour] = React.useState(parsed?.hour ?? "");
  const [minute, setMinute] = React.useState(parsed?.minute ?? "");
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    parsed?.period ?? "AM",
  );

  React.useEffect(() => {
    const p = parse24h(value);
    if (p) {
      setHour(p.hour);
      setMinute(p.minute);
      setPeriod(p.period);
    } else {
      setHour("");
      setMinute("");
      setPeriod("AM");
    }
  }, [value]);

  const emit = (h: string, m: string, p: "AM" | "PM") => {
    if (h && m) onChange(to24h(h, m, p));
  };

  const displayTime = parsed
    ? `${String(parsed.hour).padStart(2, "0")}:${parsed.minute} ${parsed.period}`
    : null;

  return (
    <Popover.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !displayTime && "text-muted-foreground",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime ?? "Pick a time"}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 rounded-md border bg-popover p-3 shadow-md outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex gap-3">
            <TimeColumn
              label="Hr"
              items={HOURS}
              selected={hour}
              onSelect={(h) => {
                setHour(h);
                emit(h, minute || "00", period);
              }}
              format={(v) => v.padStart(2, "0")}
            />
            <TimeColumn
              label="Min"
              items={MINUTES}
              selected={minute}
              onSelect={(m) => {
                setMinute(m);
                emit(hour || "12", m, period);
              }}
              format={(v) => v}
            />
            <div className="flex flex-col">
              <span className="mb-1 text-center text-xs text-muted-foreground">
                AM/PM
              </span>
              {(["AM", "PM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    emit(hour || "12", minute || "00", p);
                  }}
                  className={cn(
                    "mb-1 h-9 w-12 rounded-md text-sm font-medium transition-colors",
                    period === p
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function TimeColumn({
  label,
  items,
  selected,
  onSelect,
  format,
}: {
  label: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  format: (value: string) => string;
}) {
  const selectedRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const el = selectedRef.current;
      const container = containerRef.current;
      container.scrollTop =
        el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    }
  }, [selected]);

  return (
    <div className="flex flex-col">
      <span className="mb-1 text-center text-xs text-muted-foreground">
        {label}
      </span>
      <div
        ref={containerRef}
        className="flex h-36 flex-col overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <button
            key={item}
            ref={item === selected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "mb-0.5 h-9 w-12 shrink-0 rounded-md text-sm transition-colors",
              item === selected
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-muted",
            )}
          >
            {format(item)}
          </button>
        ))}
      </div>
    </div>
  );
}
