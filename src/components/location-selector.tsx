import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocationStore } from "@/store";
import { useLocationsQuery } from "@/features/locations/services";
import { IconMapPin, IconChevronDown } from "@tabler/icons-react";

export function LocationSelector() {
  const { selectedLocationId, setSelectedLocation } = useLocationStore();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();

  const selectedLocation = locations?.find(
    (loc) => loc.id === selectedLocationId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={locationsLoading}
        >
          <IconMapPin className="h-4 w-4" />
          <span>
            {selectedLocation ? selectedLocation.locationName : "Global"}
          </span>
          <IconChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setSelectedLocation(null)}
          className={!selectedLocationId ? "bg-accent" : ""}
        >
          Global
        </DropdownMenuItem>
        {locations?.map((location) => (
          <DropdownMenuItem
            key={location.id}
            onClick={() => setSelectedLocation(location.id)}
            className={
              selectedLocationId === location.id ? "bg-accent" : ""
            }
          >
            {location.locationName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
