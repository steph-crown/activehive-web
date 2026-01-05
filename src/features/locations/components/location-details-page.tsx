import { BlockLoader } from "@/components/loader/block-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useLocationQuery,
  useFacilitiesQuery,
  useDeleteLocationImageMutation,
} from "../services";
import { UploadLocationImageModal } from "./upload-location-image-modal";

export function LocationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const { data: location, isLoading, refetch } = useLocationQuery(id || "");
  const { data: facilities } = useFacilitiesQuery(id || "");
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteLocationImageMutation(id || "");

  const handleUploadSuccess = () => {
    refetch();
    setIsUploadModalOpen(false);
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
        <div className="flex items-center justify-center py-10">
          <BlockLoader />
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
        <div className="px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/locations")}
            className="mb-4"
          >
            ← Back to Locations
          </Button>
          <h1 className="text-3xl font-bold">{locationData.locationName}</h1>
          <p className="text-muted-foreground mt-2">Location Details</p>
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card
            className="@container/card cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate(`/dashboard/locations/${id}/facilities`)}
          >
            <CardHeader>
              <CardDescription>Facilities</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {facilities?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>View facilities</span>
                <IconChevronRight className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Members</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metrics.totalMembers || 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">All members</div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Active Members</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metrics.activeMembers || 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">Currently active</div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Monthly Revenue</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                ${(metrics.monthlyRevenue || 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">This month</div>
            </CardFooter>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>
                Complete details for this location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location Name
                  </p>
                  <p className="text-sm">{locationData.locationName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <Badge
                    variant={
                      locationData.isHeadquarters ? "default" : "secondary"
                    }
                  >
                    {locationData.isHeadquarters ? "Headquarters" : "Branch"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Address
                </p>
                <p className="text-sm">{locationData.fullAddress}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm">{locationData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm">{locationData.phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Payment Account
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Name
                    </p>
                    <p className="text-sm">
                      {locationData.paymentAccount.accountName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="text-sm">
                      {locationData.paymentAccount.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Type
                    </p>
                    <p className="text-sm capitalize">
                      {locationData.paymentAccount.accountType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Number
                    </p>
                    <p className="text-sm">
                      ****{locationData.paymentAccount.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Metrics
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Members
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.totalMembers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Members
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.activeMembers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Trainers
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.totalTrainers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Trainers
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.activeTrainers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Classes
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.totalClasses || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Classes
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.activeClasses || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </p>
                    <p className="text-sm font-semibold">
                      ${(metrics.monthlyRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Today's Check-ins
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.todaysCheckIns || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Attendance
                    </p>
                    <p className="text-sm font-semibold">
                      {metrics.averageAttendance || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Subscription Plan
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {metrics.subscriptionPlan || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={locationData.isActive ? "default" : "secondary"}
                  >
                    {locationData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-sm">
                    {new Date(locationData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Updated At
                  </p>
                  <p className="text-sm">
                    {new Date(locationData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location ID
                  </p>
                  <p className="text-xs font-mono">{locationData.id}</p>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Images
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                {locationData.images && locationData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {locationData.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border"
                      >
                        <img
                          src={getImageUrl(imageUrl)}
                          alt={`Location image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteImage(index.toString())}
                          disabled={isDeleting}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No images uploaded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadLocationImageModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        locationId={id || ""}
        onSuccess={handleUploadSuccess}
      />
    </DashboardLayout>
  );
}
