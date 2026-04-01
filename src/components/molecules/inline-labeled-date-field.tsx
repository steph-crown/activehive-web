import { cn } from "@/lib/utils";

export type InlineLabeledDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function InlineLabeledDateField({
  id,
  label,
  value,
  onChange,
  className,
}: Readonly<InlineLabeledDateFieldProps>) {
  return (
    <div
      className={cn(
        "border-input bg-background flex h-10 min-w-[10.75rem] items-center gap-2 rounded-md border px-2.5 shadow-xs transition-[color,box-shadow] sm:min-w-[10rem] sm:px-3",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className,
      )}
    >
      <label
        htmlFor={id}
        className="text-muted-foreground shrink-0 cursor-pointer text-sm font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm shadow-none outline-none",
          "text-foreground placeholder:text-muted-foreground",
          "focus-visible:ring-0",
          "[color-scheme:light] dark:[color-scheme:dark]",
          "[&::-webkit-calendar-picker-indicator]:ml-0.5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60",
        )}
      />
    </div>
  );
}
