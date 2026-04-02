import * as React from "react";
import { IconMinus } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ALL_PERMISSION_CODES,
  type PermissionFeatureGroup,
} from "../constants/permission-groups";

type PermissionsSelectProps = {
  groups: PermissionFeatureGroup[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export function PermissionsSelect({
  groups,
  value,
  onChange,
  disabled = false,
  className,
}: Readonly<PermissionsSelectProps>) {
  const selectedSet = React.useMemo(() => new Set(value), [value]);
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const setPermission = React.useCallback(
    (code: string, checked: boolean) => {
      const next = new Set(value);
      if (checked) next.add(code);
      else next.delete(code);
      onChange([...next]);
    },
    [onChange, value],
  );

  const toggleFeature = React.useCallback(
    (permissionCodes: string[], shouldSelectAll: boolean) => {
      const next = new Set(value);
      for (const code of permissionCodes) {
        if (shouldSelectAll) next.add(code);
        else next.delete(code);
      }
      onChange([...next]);
    },
    [onChange, value],
  );

  const selectedCount = value.length;
  const totalCount = ALL_PERMISSION_CODES.length;

  return (
    <div className={cn("rounded-md border border-[#F4F4F4] bg-white", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F4F4F4] px-3 py-2.5">
        <p className="text-sm font-medium">
          {selectedCount}/{totalCount} permissions selected
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 border-[#F4F4F4]"
            onClick={() => onChange(ALL_PERMISSION_CODES)}
            disabled={disabled || selectedCount === totalCount}
          >
            Select all
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 border-[#F4F4F4]"
            onClick={() => onChange([])}
            disabled={disabled || selectedCount === 0}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full"
        >
          {groups.map((group) => {
            const groupCodes = group.permissions.map((permission) => permission.code);
            const selectedInGroup = groupCodes.filter((code) =>
              selectedSet.has(code),
            ).length;
            const allSelected = selectedInGroup === groupCodes.length;
            const noneSelected = selectedInGroup === 0;
            const indeterminate = !allSelected && !noneSelected;

            return (
              <AccordionItem
                key={group.key}
                value={group.key}
                className="border-b border-[#F4F4F4] px-3"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex w-full items-center justify-between gap-3 pr-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Checkbox
                        checked={indeterminate ? "indeterminate" : allSelected}
                        disabled={disabled}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={(checked) => {
                          const shouldSelectAll = checked === true;
                          toggleFeature(groupCodes, shouldSelectAll);
                        }}
                        aria-label={`Select all permissions in ${group.label}`}
                      />
                      <span className="truncate text-sm font-medium">
                        {group.label}
                      </span>
                    </div>

                    <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
                      <span>
                        {selectedInGroup}/{groupCodes.length} selected
                      </span>
                      {indeterminate ? <IconMinus className="size-3" /> : null}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-3">
                  <div className="space-y-2">
                    {group.permissions.map((permission) => (
                      <label
                        key={permission.code}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-md border border-transparent px-2 py-1.5",
                          "hover:border-[#F4F4F4] hover:bg-muted/30",
                          disabled && "cursor-not-allowed opacity-60",
                        )}
                      >
                        <Checkbox
                          checked={selectedSet.has(permission.code)}
                          disabled={disabled}
                          onCheckedChange={(checked) =>
                            setPermission(permission.code, checked === true)
                          }
                          aria-label={permission.name}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {permission.name}
                          </span>
                          <span className="text-muted-foreground block text-xs">
                            {permission.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
