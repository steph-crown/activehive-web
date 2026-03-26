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
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useLocationsQuery } from "@/features/locations/services";
import { useToast } from "@/hooks/use-toast";
import { IconPlus } from "@tabler/icons-react";
import * as React from "react";

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
  const { showSuccess } = useToast();
  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
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

  const handleAddTrainer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAddOpen(false);
    showSuccess("Trainer added", "Trainer has been added successfully.");
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
          <form onSubmit={handleAddTrainer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input required />
            </div>
            <div className="space-y-2">
              <Label>Specializations</Label>
              <Input placeholder="Weight Training, Yoga, HIIT" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={3} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Trainer</Button>
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
