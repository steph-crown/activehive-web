import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMembersQuery } from "@/features/members/services";
import { cn } from "@/lib/utils";
import type { MemberSubscription } from "@/features/members/types";

type MemberSearchDropdownProps = {
  value: string;
  onValueChange: (memberId: string) => void;
  placeholder?: string;
  locationId?: string;
  disabled?: boolean;
  className?: string;
};

function memberLabel(sub: MemberSubscription): string {
  const name = `${sub.member.firstName} ${sub.member.lastName}`.trim();
  return name || sub.member.email;
}

export function MemberSearchDropdown({
  value,
  onValueChange,
  placeholder = "Search members…",
  locationId,
  disabled = false,
  className,
}: MemberSearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(inputValue.trim()), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (!value) setSelectedLabel("");
  }, [value]);

  const { data: members = [], isLoading } = useMembersQuery(locationId, {
    search: debouncedSearch || undefined,
    enabled: open,
  });

  const uniqueMembers = useMemo(() => {
    const seen = new Set<string>();
    return members.filter((m) => {
      if (seen.has(m.memberId)) return false;
      seen.add(m.memberId);
      return true;
    });
  }, [members]);

  const handleSelect = (sub: MemberSubscription) => {
    setSelectedLabel(memberLabel(sub));
    onValueChange(sub.memberId);
    setOpen(false);
    setInputValue("");
    setDebouncedSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLabel("");
    onValueChange("");
    setInputValue("");
    setDebouncedSearch("");
  };

  const hasValue = Boolean(value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            !hasValue && "text-muted-foreground",
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {hasValue ? selectedLabel || "Member selected" : placeholder}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {hasValue && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground rounded p-0.5"
              >
                <XIcon className="size-3.5" />
              </span>
            )}
            <ChevronDownIcon className="size-4 opacity-50" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-0"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <div className="border-b p-2">
          <Input
            autoFocus
            placeholder="Type to search…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {isLoading ? (
            <p className="text-muted-foreground px-2 py-3 text-center text-sm">
              Loading…
            </p>
          ) : uniqueMembers.length > 0 ? (
            uniqueMembers.map((sub) => (
              <DropdownMenuItem
                key={sub.memberId}
                onSelect={() => handleSelect(sub)}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">
                    {memberLabel(sub)}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {sub.member.email}
                  </span>
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-muted-foreground px-2 py-3 text-center text-sm">
              {debouncedSearch ? "No members found" : "Type to search members"}
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
