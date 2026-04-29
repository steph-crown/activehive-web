import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDisplayDate, localCalendarDateKey } from "@/lib/display-datetime";

interface DatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
}

function parseLocalDate(value: string): Date | undefined {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => isNaN(n))) return undefined;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? parseLocalDate(value) : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDisplayDate(date) : <span>{placeholder}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onChange(localCalendarDateKey(selectedDate) ?? undefined);
            } else {
              onChange(undefined);
            }
            setOpen(false);
          }}
          disabled={minDate ? { before: minDate } : undefined}
          initialFocus
        />
      </DialogContent>
    </Dialog>
  );
}
