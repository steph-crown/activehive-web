import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useUpload } from "@/hooks/use-upload";

type GymProfileForm = {
  gymName: string;
  businessRegistrationNumber: string;
  description: string;
  yearEstablished: string;
  gymEmail: string;
  gymPhone: string;
  website: string;
  instagram: string;
  facebook: string;
  twitterX: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  coverImageUrl: string;
};

const defaultGymProfile: GymProfileForm = {
  gymName: "ActiveHive Fitness Center",
  businessRegistrationNumber: "RC-892311",
  description:
    "Modern fitness space focused on strength, cardio, and functional training with expert coaching.",
  yearEstablished: "2019",
  gymEmail: "hello@activehive.com",
  gymPhone: "+234 803 111 2233",
  website: "https://activehive.com",
  instagram: "@activehivefit",
  facebook: "facebook.com/activehivefit",
  twitterX: "@activehivefit",
  primaryColor: "#FABE12",
  secondaryColor: "#121212",
  logoUrl: "",
  coverImageUrl: "",
};

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "number";
  textarea?: boolean;
};

function ProfileField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
}: Readonly<FieldProps>) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-[#3C3C3C]">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export function GymProfilePage() {
  const [formData, setFormData] = useState<GymProfileForm>(defaultGymProfile);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const { upload, isUploading } = useUpload();

  const updateField = (field: keyof GymProfileForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return;
    const uploadedUrl = await upload(file, "gym/profile/logo");
    updateField("logoUrl", uploadedUrl);
  };

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    const uploadedUrl = await upload(file, "gym/profile/cover");
    updateField("coverImageUrl", uploadedUrl);
  };

  const handleCancel = () => {
    setFormData(defaultGymProfile);
  };

  const handleSave = () => {
    console.log("Save gym profile settings", formData);
  };

  const handleRestoreColors = () => {
    updateField("primaryColor", defaultGymProfile.primaryColor);
    updateField("secondaryColor", defaultGymProfile.secondaryColor);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Gym Profile</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Access and manage all gym information and branding in one place.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <Card className="gap-4 border-[#F4F4F4] p-5 shadow-none">
                    <ProfileField
                      label="Gym Name"
                      required
                      value={formData.gymName}
                      onChange={(value) => updateField("gymName", value)}
                      placeholder="Enter gym name"
                    />
                    <ProfileField
                      label="Business Registration #"
                      value={formData.businessRegistrationNumber}
                      onChange={(value) =>
                        updateField("businessRegistrationNumber", value)
                      }
                      placeholder="Enter registration number"
                    />
                    <ProfileField
                      label="Description"
                      value={formData.description}
                      onChange={(value) => updateField("description", value)}
                      placeholder="Enter gym description"
                      textarea
                    />
                    <ProfileField
                      label="Year Established"
                      value={formData.yearEstablished}
                      onChange={(value) =>
                        updateField("yearEstablished", value)
                      }
                      placeholder="e.g. 2019"
                      type="number"
                    />
                  </Card>
                </div>

                <div className="grid gap-4">
                  <h2 className="text-lg font-semibold">Contact & Social</h2>
                  <Card className="gap-4 border-[#F4F4F4] p-5 shadow-none">
                    <ProfileField
                      label="Gym Email"
                      value={formData.gymEmail}
                      onChange={(value) => updateField("gymEmail", value)}
                      placeholder="Enter gym email"
                      type="email"
                    />
                    <ProfileField
                      label="Gym Phone"
                      value={formData.gymPhone}
                      onChange={(value) => updateField("gymPhone", value)}
                      placeholder="Enter gym phone"
                    />
                    <ProfileField
                      label="Website"
                      value={formData.website}
                      onChange={(value) => updateField("website", value)}
                      placeholder="Enter website URL"
                      type="url"
                    />
                    <ProfileField
                      label="Instagram"
                      value={formData.instagram}
                      onChange={(value) => updateField("instagram", value)}
                      placeholder="Enter Instagram handle"
                    />
                    <ProfileField
                      label="Facebook"
                      value={formData.facebook}
                      onChange={(value) => updateField("facebook", value)}
                      placeholder="Enter Facebook profile"
                    />
                    <ProfileField
                      label="Twitter / X"
                      value={formData.twitterX}
                      onChange={(value) => updateField("twitterX", value)}
                      placeholder="Enter X handle"
                    />
                  </Card>
                </div>
              </div>

              <div className="grid h-fit gap-4">
                <h2 className="text-lg font-semibold">Branding</h2>
                <Card className="gap-5 border-[#F4F4F4] p-5 shadow-none">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium text-[#3C3C3C]">
                      Gym Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <Avatar className="size-20 border border-[#F4F4F4]">
                        {formData.logoUrl ? (
                          <AvatarImage src={formData.logoUrl} alt="Gym logo" />
                        ) : null}
                        <AvatarFallback>GYM</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <Button
                          variant="outline"
                          disabled={isUploading}
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                        <p className="text-muted-foreground text-xs">
                          PNG or JPG (2MB max)
                        </p>
                      </div>
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg"
                      onChange={(event) =>
                        void handleLogoUpload(event.target.files?.[0])
                      }
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-3">
                    <label className="text-sm font-medium text-[#3C3C3C]">
                      Cover Image
                    </label>
                    <div className="grid gap-3">
                      <div className="h-32 overflow-hidden rounded-md border border-[#F4F4F4] bg-muted">
                        {formData.coverImageUrl ? (
                          <img
                            src={formData.coverImageUrl}
                            alt="Gym cover"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                            No cover image uploaded
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        disabled={isUploading}
                        onClick={() => coverInputRef.current?.click()}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg"
                      onChange={(event) =>
                        void handleCoverUpload(event.target.files?.[0])
                      }
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-[#3C3C3C]">
                        Color Palette
                      </h3>
                      <button
                        type="button"
                        onClick={handleRestoreColors}
                        className="text-sm font-medium underline"
                      >
                        Restore to default
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-[#696969]">
                          Primary Color
                        </label>
                        <Input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(event) =>
                            updateField("primaryColor", event.target.value)
                          }
                          className="h-10 p-1"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-[#696969]">
                          Secondary Color
                        </label>
                        <Input
                          type="color"
                          value={formData.secondaryColor}
                          onChange={(event) =>
                            updateField("secondaryColor", event.target.value)
                          }
                          className="h-10 p-1"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
