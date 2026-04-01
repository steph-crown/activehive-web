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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useCreateTrainerMutation } from "../services";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import * as React from "react";

const PROFILE_IMAGE_MAX_BYTES = 3 * 1024 * 1024;

function parseSpecialtiesFromCommaSeparated(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const emptyAddTrainerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  specializations: "",
  bio: "",
  profileImageUrl: "",
  locationIds: [] as string[],
};

type TrainerStatus = "Available" | "In Session" | "Off Today";

type Trainer = {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  members: number;
  rating: number;
  status: TrainerStatus;
  locationId: string;
  createdAt: string;
};

const trainersData: Trainer[] = [
  {
    id: "1",
    name: "Mike Ross",
    email: "mike.r@gym.com",
    specializations: ["Weight Training", "CrossFit"],
    members: 18,
    rating: 4.9,
    status: "Available",
    locationId: "1",
    createdAt: "2026-01-12",
  },
  {
    id: "2",
    name: "Lisa Park",
    email: "lisa.p@gym.com",
    specializations: ["Yoga", "Pilates"],
    members: 15,
    rating: 4.8,
    status: "In Session",
    locationId: "2",
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    name: "Carlos Diaz",
    email: "carlos.d@gym.com",
    specializations: ["Boxing", "HIIT"],
    members: 12,
    rating: 4.7,
    status: "Available",
    locationId: "1",
    createdAt: "2026-02-03",
  },
  {
    id: "4",
    name: "Anna Thompson",
    email: "anna.t@gym.com",
    specializations: ["Swimming", "Cardio"],
    members: 10,
    rating: 4.9,
    status: "Off Today",
    locationId: "3",
    createdAt: "2026-02-14",
  },
  {
    id: "5",
    name: "Ryan Cooper",
    email: "ryan.c@gym.com",
    specializations: ["CrossFit", "Strength"],
    members: 14,
    rating: 4.6,
    status: "Available",
    locationId: "2",
    createdAt: "2026-02-21",
  },
];

const statusVariant: Record<
  TrainerStatus,
  "default" | "secondary" | "outline"
> = {
  Available: "default",
  "In Session": "secondary",
  "Off Today": "outline",
};

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
  const [dateFilter, setDateFilter] = React.useState("");
  const [selectedTrainer, setSelectedTrainer] = React.useState<Trainer | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const filteredTrainers = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return trainersData.filter((trainer) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${trainer.name} ${trainer.email} ${trainer.specializations.join(" ")}`
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesLocation =
        locationFilter === "all" || trainer.locationId === locationFilter;
      const matchesDate =
        !dateFilter ||
        new Date(trainer.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString();
      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [dateFilter, locationFilter, searchQuery]);

  const toggleAddFormLocation = (locationId: string) => {
    setAddForm((prev) => ({
      ...prev,
      locationIds: prev.locationIds.includes(locationId)
        ? prev.locationIds.filter((id) => id !== locationId)
        : [...prev.locationIds, locationId],
    }));
  };

  const locationTriggerLabel = React.useMemo(() => {
    if (locationsLoading) return "Loading…";
    const list = locations ?? [];
    if (list.length === 0) return "No locations";
    if (addForm.locationIds.length === 0) return "Select locations";
    if (addForm.locationIds.length === 1) {
      const name = list.find((l) => l.id === addForm.locationIds[0])
        ?.locationName;
      return name ?? "1 selected";
    }
    return `${addForm.locationIds.length} locations selected`;
  }, [locationsLoading, locations, addForm.locationIds]);

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
        specialties: parseSpecialtiesFromCommaSeparated(addForm.specializations),
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
            dateValue={dateFilter}
            onDateChange={setDateFilter}
          />

          {filteredTrainers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No trainers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTrainers.map((trainer) => {
                const initials = trainer.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <button
                    key={trainer.id}
                    type="button"
                    className="rounded-md border border-[#F4F4F4] bg-white p-5 text-left shadow-none transition hover:shadow-sm cursor-pointer"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setIsViewOpen(true);
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">
                            {trainer.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {trainer.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusVariant[trainer.status]}>
                        {trainer.status}
                      </Badge>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {trainer.specializations.map((specialization) => (
                        <span
                          key={`${trainer.id}-${specialization}`}
                          className="rounded bg-muted px-2 py-0.5 text-xs"
                        >
                          {specialization}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{trainer.members} members</span>
                      <span>★ {trainer.rating.toFixed(1)}</span>
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
          <form onSubmit={(e) => void handleAddTrainer(e)} className="space-y-4">
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
              <Input
                id="trainer-specializations"
                placeholder="Comma-separated (e.g. Yoga, Strength Training, HIIT)"
                value={addForm.specializations}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, specializations: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-locations-trigger">Locations</Label>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    id="trainer-locations-trigger"
                    type="button"
                    disabled={
                      locationsLoading || (locations ?? []).length === 0
                    }
                    className={cn(
                      "border-input bg-background flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm shadow-xs outline-none transition-[color,box-shadow]",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    <span className="truncate">{locationTriggerLabel}</span>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="max-h-64 min-w-[var(--radix-dropdown-menu-trigger-width)] w-[var(--radix-dropdown-menu-trigger-width)]"
                  align="start"
                >
                  {(locations ?? []).map((loc) => (
                    <DropdownMenuCheckboxItem
                      key={loc.id}
                      checked={addForm.locationIds.includes(loc.id)}
                      onCheckedChange={() => toggleAddFormLocation(loc.id)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {loc.locationName}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Label htmlFor="trainer-profile-photo">Profile photo (optional)</Label>
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
              {selectedTrainer?.name ?? "Trainer Profile"}
            </DialogTitle>
            <DialogDescription>
              Trainer details and specialization info.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{selectedTrainer.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-semibold">
                    {selectedTrainer.members}
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-lg font-semibold">
                    ★ {selectedTrainer.rating}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedTrainer.specializations.map((item) => (
                    <span
                      key={`${selectedTrainer.id}-${item}`}
                      className="rounded bg-muted px-2 py-0.5 text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
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
