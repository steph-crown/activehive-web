import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import type { OperatingHoursLocationState } from "../constants/operating-hours-nav";
import { useLocationsQuery } from "../services";
import type { GymLocation } from "../types";
import { UpdateCoverImageModal } from "./update-cover-image-modal";

const getImageUrl = (imagePath: string): string => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
    "https://activehiveapi.onrender.com";
  return imagePath.startsWith("http") ? imagePath : `${baseURL}/${imagePath}`;
};

export function LocationsPage() {
  const navigate = useNavigate();
  const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState<
    string | null
  >(null);
  const { data: locations, isLoading, refetch } = useLocationsQuery();

  const handleCoverSuccess = () => {
    refetch();
    setIsCoverModalOpen(false);
  };

  const handleOpenCoverModal = (location: GymLocation) => {
    setSelectedLocationId(location.id);
    setIsCoverModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Locations</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your gym locations and their information.
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/locations/new")}>
            <IconPlus className="h-4 w-4 " />
            Add Location
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card
                  key={`location-skeleton-${idx}`}
                  className="overflow-hidden rounded-md border-[#F4F4F4] bg-white p-0 shadow-none"
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-44" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-md bg-[#FAFAFA] p-3">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !locations || locations.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No locations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {locations.map((location) => {
                const coverImage = location.coverImage || location.images?.[0];
                return (
                  <Card
                    key={location.id}
                    className="overflow-hidden rounded-md border-[#F4F4F4] bg-white p-0 shadow-none"
                  >
                    {coverImage ? (
                      <img
                        src={getImageUrl(coverImage)}
                        alt={location.locationName}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex h-40 items-center justify-center text-sm">
                        No cover image
                      </div>
                    )}

                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold">
                            {location.locationName}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {location.address.street}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {location.address.city}, {location.address.state}{" "}
                            {location.address.zipCode}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <IconDotsVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/dashboard/locations/${location.id}`)
                              }
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/locations/${location.id}/operating-hours`,
                                  {
                                    state: {
                                      operatingHoursFrom: "locations",
                                    } satisfies OperatingHoursLocationState,
                                  },
                                )
                              }
                            >
                              Operating hours
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenCoverModal(location)}
                            >
                              Update cover image
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            location.isHeadquarters ? "default" : "secondary"
                          }
                        >
                          {location.isHeadquarters ? "Headquarters" : "Branch"}
                        </Badge>
                        <Badge
                          variant={location.isActive ? "default" : "secondary"}
                        >
                          {location.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 rounded-md bg-[#FAFAFA] p-3">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Active Members
                          </p>
                          <p className="font-bebas text-2xl leading-none">
                            {location.metrics.activeMembers}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Monthly Revenue
                          </p>
                          <p className="font-bebas text-2xl leading-none">
                            ${location.metrics.monthlyRevenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedLocationId && (
        <UpdateCoverImageModal
          open={isCoverModalOpen}
          onOpenChange={setIsCoverModalOpen}
          locationId={selectedLocationId}
          onSuccess={handleCoverSuccess}
        />
      )}
    </DashboardLayout>
  );
}
