"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (next: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  /**
   * When more than one option is selected, the trigger shows
   * `{count} {multipleSelectedText}` (default: `3 selected`).
   * Example: `locations selected` → `3 locations selected`.
   */
  multipleSelectedText?: string;
};

function toggleSelected(selected: string[], key: string) {
  return selected.includes(key)
    ? selected.filter((v) => v !== key)
    : [...selected, key];
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  emptyMessage = "No options",
  loading = false,
  disabled = false,
  id,
  className,
  triggerClassName,
  contentClassName,
  multipleSelectedText = "selected",
}: Readonly<MultiSelectProps>) {
  const reactId = React.useId();

  const triggerText = React.useMemo(() => {
    if (loading) return "Loading…";
    if (options.length === 0) return emptyMessage;
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      return options.find((o) => o.value === value[0])?.label ?? "1 selected";
    }
    return `${value.length} ${multipleSelectedText}`;
  }, [
    loading,
    options,
    value,
    placeholder,
    emptyMessage,
    multipleSelectedText,
  ]);

  const triggerDisabled = disabled || loading || options.length === 0;

  return (
    <div className={cn("w-full min-w-0", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={triggerDisabled}
            className={cn(
              "border-input bg-background flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm shadow-xs outline-none transition-[color,box-shadow]",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              triggerClassName,
            )}
          >
            <span className="truncate">{triggerText}</span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          portalled={false}
          className={cn(
            "min-w-[var(--radix-dropdown-menu-trigger-width)] w-[var(--radix-dropdown-menu-trigger-width)] p-0",
            contentClassName,
          )}
        >
          {/* Scroll region stays inside the dialog tree so wheel/trackpad events are not blocked by dialog scroll lock. */}
          <div className="max-h-64 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-1">
            {options.map((opt) => {
              const checkboxId = `${reactId}-${opt.value}`.replace(/:/g, "");
              const checked = value.includes(opt.value);
              return (
                <DropdownMenuItem
                  key={opt.value}
                  disabled={opt.disabled}
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer gap-2 rounded-sm px-2 py-1.5"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={checked}
                    disabled={opt.disabled}
                    onCheckedChange={() =>
                      onValueChange(toggleSelected(value, opt.value))
                    }
                    className="size-4 shrink-0 border-2 border-muted-foreground/45 bg-background shadow-sm data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={checkboxId}
                    className="flex-1 cursor-pointer text-left text-sm leading-snug font-normal"
                  >
                    {opt.label}
                  </label>
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
