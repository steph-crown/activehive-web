import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FacilitiesStepProps = {
  allFacilities: string[];
  selectedFacilities: string[];
  onToggleFacility: (facility: string) => void;
  customFacility: string;
  onCustomFacilityChange: (value: string) => void;
  onAddCustomFacility: () => void;
};

export function FacilitiesStep({
  allFacilities,
  selectedFacilities,
  onToggleFacility,
  customFacility,
  onCustomFacilityChange,
  onAddCustomFacility,
}: FacilitiesStepProps) {
  return (
    <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
      <h2 className="text-lg font-semibold">Facilities</h2>
      <p className="text-muted-foreground text-sm">
        Select all facilities available at your gym.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {allFacilities.map((facility) => {
          const selected = selectedFacilities.includes(facility);
          return (
            <button
              type="button"
              key={facility}
              onClick={() => onToggleFacility(facility)}
              className={`rounded-md border px-4 py-3 text-left ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-[#E6E6E6]"
              }`}
            >
              {facility}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={customFacility}
          onChange={(event) => onCustomFacilityChange(event.target.value)}
          placeholder="Add custom facility"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAddCustomFacility}
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
