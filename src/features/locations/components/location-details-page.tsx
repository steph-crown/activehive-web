import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import type { OperatingHoursLocationState } from "../constants/operating-hours-nav";
import {
  useLocationQuery,
  useFacilitiesQuery,
  useDeleteLocationImageMutation,
} from "../services";
import { UploadLocationImageModal } from "./upload-location-image-modal";
import { UpdateCoverImageModal } from "./update-cover-image-modal";
import { formatDisplayDate } from "@/lib/display-datetime";
import { formatNgn } from "@/lib/format-ngn";

export function LocationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false);
  const { data: location, isLoading, refetch } = useLocationQuery(id || "");
  const { data: facilities } = useFacilitiesQuery(id || "");
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteLocationImageMutation(id || "");

  const handleUploadSuccess = () => {
    refetch();
    setIsUploadModalOpen(false);
  };

  const handleCoverSuccess = () => {
    refetch();
    setIsCoverModalOpen(false);
  };

  const handleDeleteImage = async (imageIndex: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteImage(imageIndex);
      showSuccess("Success", "Image deleted successfully!");
      refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete image.";
      showError("Error", message);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!location) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Location not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const locationData = location.location;
  const metrics = location.metrics;

  const getImageUrl = (imagePath: string): string => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
      "https://activehiveapi.onrender.com";
    return imagePath.startsWith("http") ? imagePath : `${baseURL}/${imagePath}`;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6 space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/locations")}
            className="mb-2"
          >
            ← Back to Locations
          </Button>

          {locationData.coverImage && (
            <div className="relative overflow-hidden rounded-xl border bg-muted">
              <img
                src={getImageUrl(locationData.coverImage)}
                alt="Location cover"
                className="h-48 w-full object-cover md:h-64"
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium">
                {locationData.locationName}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Location Details
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/locations/${id}/operating-hours`, {
                    state: {
                      operatingHoursFrom: "location-detail",
                    } satisfies OperatingHoursLocationState,
                  })
                }
              >
                Operating hours
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCoverModalOpen(true)}
              >
                Update cover image
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-4 lg:px-6">
          <Card
            className="cursor-pointer rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none transition-colors hover:bg-accent/30"
            onClick={() => navigate(`/dashboard/locations/${id}/facilities`)}
          >
            <CardContent className="space-y-3 p-0">
              <p className="text-sm text-muted-foreground">Facilities</p>
              <p className="font-bebas text-4xl leading-none">{facilities?.length || 0}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>View facilities</span>
                <IconChevronRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none">
            <CardContent className="space-y-3 p-0">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="font-bebas text-4xl leading-none">{metrics.totalMembers || 0}</p>
              <p className="text-xs text-muted-foreground">All members</p>
            </CardContent>
          </Card>

          <Card className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none">
            <CardContent className="space-y-3 p-0">
              <p className="text-sm text-muted-foreground">Active Members</p>
              <p className="font-bebas text-4xl leading-none">{metrics.activeMembers || 0}</p>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none">
            <CardContent className="space-y-3 p-0">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="font-bebas text-4xl leading-none">
                {formatNgn(metrics.monthlyRevenue || 0)}
              </p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Location Name</p>
                  <p className="mt-1 text-sm">{locationData.locationName}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <div className="mt-1">
                    <Badge variant={locationData.isHeadquarters ? "default" : "secondary"}>
                      {locationData.isHeadquarters ? "Headquarters" : "Branch"}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4 md:col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="mt-1 text-sm">{locationData.fullAddress}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge variant={locationData.isActive ? "default" : "secondary"}>
                      {locationData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Subscription Plan</p>
                  <div className="mt-1">
                    <Badge variant="outline">{metrics.subscriptionPlan || "N/A"}</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm">{locationData.email}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-1 text-sm">{locationData.phone}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="mt-1 text-sm">
                    {formatDisplayDate(locationData.createdAt)}
                  </p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Updated At</p>
                  <p className="mt-1 text-sm">
                    {formatDisplayDate(locationData.updatedAt)}
                  </p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4 md:col-span-2">
                  <p className="text-xs text-muted-foreground">Location ID</p>
                  <p className="mt-1 break-all font-mono text-xs">{locationData.id}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Account Name</p>
                  <p className="mt-1 text-sm">{locationData.paymentAccount.accountName}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Bank Name</p>
                  <p className="mt-1 text-sm">{locationData.paymentAccount.bankName}</p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="mt-1 text-sm capitalize">
                    {locationData.paymentAccount.accountType}
                  </p>
                </div>
                <div className="rounded-md border border-[#F4F4F4] bg-white p-4">
                  <p className="text-xs text-muted-foreground">Account Number</p>
                  <p className="mt-1 text-sm">
                    ****{locationData.paymentAccount.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-5">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[
                  { label: "Total Members", value: metrics.totalMembers || 0 },
                  { label: "Active Members", value: metrics.activeMembers || 0 },
                  { label: "Total Trainers", value: metrics.totalTrainers || 0 },
                  { label: "Active Trainers", value: metrics.activeTrainers || 0 },
                  { label: "Total Classes", value: metrics.totalClasses || 0 },
                  { label: "Active Classes", value: metrics.activeClasses || 0 },
                  {
                    label: "Monthly Revenue",
                    value: formatNgn(metrics.monthlyRevenue || 0),
                  },
                  { label: "Today's Check-ins", value: metrics.todaysCheckIns || 0 },
                  { label: "Average Attendance", value: metrics.averageAttendance || 0 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-[#F4F4F4] bg-white p-4"
                  >
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-2 font-bebas text-2xl leading-none">{item.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-5">
              <div className="space-y-4">
                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <IconPlus className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                {locationData.images && locationData.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {locationData.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-md border border-[#F4F4F4]"
                      >
                        <img
                          src={getImageUrl(imageUrl)}
                          alt={`Location image ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleDeleteImage(index.toString())}
                          disabled={isDeleting}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <UploadLocationImageModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        locationId={id || ""}
        onSuccess={handleUploadSuccess}
      />
      <UpdateCoverImageModal
        open={isCoverModalOpen}
        onOpenChange={setIsCoverModalOpen}
        locationId={id || ""}
        onSuccess={handleCoverSuccess}
      />
    </DashboardLayout>
  );
}
