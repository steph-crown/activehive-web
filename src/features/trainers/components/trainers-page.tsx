import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import {
  useActiveTrainerSpecialtiesQuery,
  useCreateTrainerMutation,
  useTrainersQuery,
} from "../services";
import type { TrainerListItem } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";

const PROFILE_IMAGE_MAX_BYTES = 3 * 1024 * 1024;

const emptyAddTrainerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  specialtyIds: [] as string[],
  bio: "",
  profileImageUrl: "",
  locationIds: [] as string[],
};

function trainerDisplayName(t: TrainerListItem): string {
  const name = `${t.firstName} ${t.lastName}`.trim();
  return name || t.email;
}

function trainerInitials(t: TrainerListItem): string {
  const name = trainerDisplayName(t);
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function trainerSpecialtyTags(t: TrainerListItem): string[] {
  const fromArray = t.specialties ?? [];
  const spec = t.specialization?.trim();
  if (spec && !fromArray.includes(spec)) return [...fromArray, spec];
  return [...fromArray];
}

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  const s = status.toLowerCase();
  if (s === "active") return "default";
  if (s === "pending") return "secondary";
  if (s === "cancelled" || s === "suspended") return "destructive";
  return "outline";
}

function TrainersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-36 max-w-full" />
                <Skeleton className="h-3 w-48 max-w-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
          </div>
          <div className="mb-3 flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export function TrainersPage() {
  const { showSuccess, showError } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { mutateAsync: createTrainer, isPending: isCreatingTrainer } =
    useCreateTrainerMutation();
  const { upload: uploadProfileImage, isUploading: isProfileImageUploading } =
    useUpload();
  const profilePhotoInputRef = React.useRef<HTMLInputElement>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState(emptyAddTrainerForm);

  React.useEffect(() => {
    if (isAddOpen) {
      setAddForm(emptyAddTrainerForm);
    }
  }, [isAddOpen]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [selectedTrainer, setSelectedTrainer] =
    React.useState<TrainerListItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const listParams =
    locationFilter === "all" ? {} : { locationId: locationFilter };
  const {
    data: trainers = [],
    isLoading: trainersLoading,
    isError: trainersError,
    error: trainersErrorObj,
  } = useTrainersQuery(listParams);
  const {
    data: activeSpecialties,
    isLoading: specialtiesLoading,
    isError: specialtiesError,
  } = useActiveTrainerSpecialtiesQuery();

  const specialtyOptions = React.useMemo(() => {
    const list = [...(activeSpecialties ?? [])];
    list.sort((a, b) => a.displayOrder - b.displayOrder);
    return list.map((s) => ({ value: s.id, label: s.name }));
  }, [activeSpecialties]);

  const filteredTrainers = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return trainers.filter((trainer) => {
      if (normalizedSearch.length === 0) return true;
      const tags = trainerSpecialtyTags(trainer).join(" ");
      const haystack =
        `${trainerDisplayName(trainer)} ${trainer.email} ${tags}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [searchQuery, trainers]);

  const handleProfilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      showError("File too large", "Image must be 3 MB or smaller.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      showError("Invalid file", "Please choose an image file.");
      return;
    }
    try {
      const url = await uploadProfileImage(file, "trainers/profile");
      setAddForm((p) => ({ ...p, profileImageUrl: url }));
    } catch (error) {
      showError(
        "Upload failed",
        getApiErrorMessage(error, "Could not upload image."),
      );
    }
  };

  const handleAddTrainer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (addForm.locationIds.length === 0) {
      showError(
        "Locations required",
        "Select at least one location for this trainer.",
      );
      return;
    }
    try {
      await createTrainer({
        email: addForm.email.trim(),
        firstName: addForm.firstName.trim(),
        lastName: addForm.lastName.trim(),
        phoneNumber: addForm.phoneNumber.trim(),
        specialties: addForm.specialtyIds,
        bio: addForm.bio.trim(),
        locationIds: addForm.locationIds,
        ...(addForm.profileImageUrl.trim()
          ? { profileImage: addForm.profileImageUrl.trim() }
          : {}),
      });
      showSuccess("Trainer added", "Trainer has been added successfully.");
      setIsAddOpen(false);
    } catch (error) {
      showError(
        "Could not add trainer",
        getApiErrorMessage(error, "Something went wrong. Please try again."),
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">All Trainers</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage trainer profiles and assignments.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Add Trainer
          </Button>
        </div>

        <div className="px-4 lg:px-6">
          <TableFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search trainers..."
            locationValue={locationFilter}
            onLocationChange={setLocationFilter}
            locations={(locations ?? []).map((location) => ({
              value: location.id,
              label: location.locationName,
            }))}
            locationDisabled={locationsLoading}
          />

          {trainersLoading ? (
            <TrainersGridSkeleton />
          ) : trainersError ? (
            <div className="text-destructive text-sm">
              {getApiErrorMessage(
                trainersErrorObj,
                "Could not load trainers. Try again.",
              )}
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No trainers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTrainers.map((trainer) => {
                const tags = trainerSpecialtyTags(trainer);
                const locationNames =
                  trainer.trainerLocations?.map((l) => l.locationName) ?? [];
                return (
                  <button
                    key={trainer.id}
                    type="button"
                    className="cursor-pointer rounded-md border border-input/70 bg-white p-5 text-left shadow-none transition hover:border-primary hover:shadow-sm"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setIsViewOpen(true);
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {trainer.profileImage ? (
                          <img
                            src={trainer.profileImage}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                            {trainerInitials(trainer)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-semibold">
                            {trainerDisplayName(trainer)}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {trainer.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusBadgeVariant(trainer.status)}>
                        {trainer.status}
                      </Badge>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {tags.length === 0 ? (
                        <span className="text-muted-foreground text-xs">
                          No specialties listed
                        </span>
                      ) : (
                        tags.map((specialization) => (
                          <span
                            key={`${trainer.id}-${specialization}`}
                            className="bg-muted rounded px-2 py-0.5 text-xs"
                          >
                            {specialization}
                          </span>
                        ))
                      )}
                    </div>

                    <div className="text-muted-foreground text-sm">
                      {locationNames.length === 0
                        ? "No locations"
                        : locationNames.length === 1
                          ? locationNames[0]
                          : `${locationNames.length} locations`}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trainer</DialogTitle>
            <DialogDescription>Create a new trainer profile.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => void handleAddTrainer(e)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer-first-name">First Name</Label>
                <Input
                  id="trainer-first-name"
                  value={addForm.firstName}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainer-last-name">Last Name</Label>
                <Input
                  id="trainer-last-name"
                  value={addForm.lastName}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-email">Email</Label>
              <Input
                id="trainer-email"
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-phone">Phone</Label>
              <Input
                id="trainer-phone"
                value={addForm.phoneNumber}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, phoneNumber: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-specializations">Specializations</Label>
              <MultiSelect
                id="trainer-specializations"
                options={specialtyOptions}
                value={addForm.specialtyIds}
                onValueChange={(specialtyIds) =>
                  setAddForm((p) => ({ ...p, specialtyIds }))
                }
                placeholder={
                  specialtiesError
                    ? "Could not load specialties"
                    : "Select specialties"
                }
                emptyMessage="No specialties available"
                loading={specialtiesLoading}
                disabled={specialtiesError}
                multipleSelectedText="specialties selected"
              />
              {specialtiesError ? (
                <p className="text-destructive text-xs">
                  Specialties could not be loaded. Try again later.
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Optional. Choose one or more active specialties for this
                  trainer.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-locations-trigger">Locations</Label>
              <MultiSelect
                id="trainer-locations-trigger"
                options={(locations ?? []).map((loc) => ({
                  value: loc.id,
                  label: loc.locationName,
                }))}
                value={addForm.locationIds}
                onValueChange={(locationIds) =>
                  setAddForm((p) => ({ ...p, locationIds }))
                }
                placeholder="Select locations"
                emptyMessage="No locations"
                loading={locationsLoading}
                multipleSelectedText="locations selected"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-bio">Bio</Label>
              <Textarea
                id="trainer-bio"
                rows={3}
                value={addForm.bio}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, bio: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-profile-photo">
                Profile photo (optional)
              </Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={profilePhotoInputRef}
                  id="trainer-profile-photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => void handleProfilePhotoChange(e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  disabled={isProfileImageUploading || isCreatingTrainer}
                  onClick={() => profilePhotoInputRef.current?.click()}
                >
                  {isProfileImageUploading ? "Uploading…" : "Choose image"}
                </Button>
                {addForm.profileImageUrl ? (
                  <span className="text-muted-foreground max-w-[12rem] truncate text-xs">
                    Image ready
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    PNG, JPG, or WebP · max 3 MB
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isCreatingTrainer || isProfileImageUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isCreatingTrainer}
                disabled={isProfileImageUploading}
              >
                Add Trainer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTrainer
                ? trainerDisplayName(selectedTrainer)
                : "Trainer Profile"}
            </DialogTitle>
            <DialogDescription>
              Trainer details and specialization info.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer ? (
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="text-sm">{selectedTrainer.email}</p>
              </div>
              {selectedTrainer.phoneNumber ? (
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="text-sm">{selectedTrainer.phoneNumber}</p>
                </div>
              ) : null}
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <Badge
                  className="mt-1"
                  variant={statusBadgeVariant(selectedTrainer.status)}
                >
                  {selectedTrainer.status}
                </Badge>
              </div>
              {selectedTrainer.bio?.trim() ? (
                <div>
                  <p className="text-muted-foreground text-xs">Bio</p>
                  <p className="text-sm">{selectedTrainer.bio.trim()}</p>
                </div>
              ) : null}
              <div>
                <p className="text-muted-foreground mb-2 text-xs">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-1">
                  {trainerSpecialtyTags(selectedTrainer).length === 0 ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : (
                    trainerSpecialtyTags(selectedTrainer).map((item) => (
                      <span
                        key={`${selectedTrainer.id}-${item}`}
                        className="bg-muted rounded px-2 py-0.5 text-xs"
                      >
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>
              {(selectedTrainer.trainerLocations?.length ?? 0) > 0 ? (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Locations
                  </p>
                  <ul className="text-sm list-disc pl-4">
                    {selectedTrainer.trainerLocations!.map((loc) => (
                      <li key={loc.id}>{loc.locationName}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
