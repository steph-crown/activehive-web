import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DefaultFacility } from "./constants";
import type { FacilityItem } from "./types";

type FacilitiesStepProps = {
  allFacilities: DefaultFacility[];
  selectedFacilities: FacilityItem[];
  onToggleFacility: (facility: DefaultFacility) => void;
  onAddCustomFacility: (facility: FacilityItem) => void;
  onRemoveCustomFacility: (name: string) => void;
  customFacilities: FacilityItem[];
};

export function FacilitiesStep({
  allFacilities,
  selectedFacilities,
  onToggleFacility,
  onAddCustomFacility,
  onRemoveCustomFacility,
  customFacilities,
}: FacilitiesStepProps) {
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const isSelected = (name: string) =>
    selectedFacilities.some((f) => f.name === name);

  const handleAdd = () => {
    const name = customName.trim();
    const description = customDescription.trim();
    if (!name) return;
    onAddCustomFacility({ name, description });
    setCustomName("");
    setCustomDescription("");
  };

  return (
    <div className="grid gap-6 rounded-md border border-[#F4F4F4] bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold">Facilities</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Select all facilities available at this location.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {allFacilities.map((facility) => {
          const selected = isSelected(facility.name);
          return (
            <button
              type="button"
              key={facility.name}
              onClick={() => onToggleFacility(facility)}
              className={`rounded-md border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-[#E6E6E6] hover:border-primary/40"
              }`}
            >
              <p className="text-sm font-medium">{facility.name}</p>
              {facility.description && (
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                  {facility.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-[#F4F4F4] pt-4">
        <p className="mb-3 text-sm font-medium">Add custom facility</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="grid gap-1.5">
            <Label className="text-xs">Name *</Label>
            <Input
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              placeholder="e.g. Pilates Room"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Description</Label>
            <Input
              value={customDescription}
              onChange={(event) => setCustomDescription(event.target.value)}
              placeholder="e.g. Dedicated pilates and core training space"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAdd}
              disabled={!customName.trim()}
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {customFacilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {customFacilities.map((f) => (
              <div
                key={f.name}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  isSelected(f.name)
                    ? "border-primary bg-primary/10"
                    : "border-[#E6E6E6]"
                }`}
              >
                <button
                  type="button"
                  className="text-left"
                  onClick={() =>
                    onToggleFacility({ name: f.name, description: f.description })
                  }
                >
                  <span className="font-medium">{f.name}</span>
                  {f.description && (
                    <span className="text-muted-foreground ml-1 text-xs">
                      — {f.description}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive ml-1 shrink-0"
                  onClick={() => onRemoveCustomFacility(f.name)}
                  aria-label={`Remove ${f.name}`}
                >
                  <IconX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
