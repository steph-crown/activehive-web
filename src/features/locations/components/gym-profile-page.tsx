import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import type { GymOwnerProfile, GymOwnerProfilePatchPayload } from "../types";
import {
  useGymProfileQuery,
  usePatchGymProfileMutation,
} from "../services";

type GymProfileForm = {
  gymName: string;
  businessRegistrationNumber: string;
  description: string;
  gymEmail: string;
  gymPhone: string;
  website: string;
  instagram: string;
  facebook: string;
  twitterX: string;
  logoUrl: string;
};

function profileToForm(profile: GymOwnerProfile): GymProfileForm {
  return {
    gymName: profile.gymName ?? "",
    businessRegistrationNumber: profile.businessRegistrationNumber ?? "",
    description: profile.description ?? "",
    gymEmail: profile.gymEmail ?? "",
    gymPhone: profile.gymPhone ?? "",
    website: profile.website ?? "",
    instagram: profile.instagram ?? "",
    facebook: profile.facebook ?? "",
    twitterX: profile.twitterX ?? "",
    logoUrl: profile.logoUrl ?? "",
  };
}

function formToPatchPayload(form: GymProfileForm): GymOwnerProfilePatchPayload {
  return {
    gymName: form.gymName,
    businessRegistrationNumber: form.businessRegistrationNumber,
    description: form.description,
    gymEmail: form.gymEmail,
    gymPhone: form.gymPhone,
    website: form.website,
    instagram: form.instagram,
    facebook: form.facebook,
    twitterX: form.twitterX,
    logoUrl: form.logoUrl,
  };
}

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "number";
  textarea?: boolean;
  disabled?: boolean;
};

function ProfileField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  disabled = false,
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
          disabled={disabled}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export function GymProfilePage() {
  const { data: profile, isLoading, isError, error } = useGymProfileQuery();
  const patchMutation = usePatchGymProfileMutation();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<GymProfileForm | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const { upload, isUploading } = useUpload();

  useEffect(() => {
    if (!profile) return;
    setFormData((prev) => (prev === null ? profileToForm(profile) : prev));
  }, [profile]);

  const updateField = (field: keyof GymProfileForm, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const uploadedUrl = await upload(file, "gym/profile/logo");
      updateField("logoUrl", uploadedUrl);
    } catch {
      showError(
        "Upload failed",
        "We could not upload the logo. Try again or use a smaller image.",
      );
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData(profileToForm(profile));
  };

  const handleSave = () => {
    if (!formData) return;
    patchMutation.mutate(formToPatchPayload(formData), {
      onSuccess: (updated) => {
        setFormData(profileToForm(updated));
        showSuccess("Profile updated", "Your gym profile was saved.");
      },
      onError: (err) => {
        showError(
          "Could not save",
          getApiErrorMessage(err, "Something went wrong while saving."),
        );
      },
    });
  };

  const loading = isLoading;
  const saving = patchMutation.isPending;
  const fieldsDisabled = saving || isUploading;
  const canEdit = formData !== null && !loading && !isError;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-medium">Gym Profile</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Access and manage all gym information and branding in one place.
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6">
          {loading ? (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <div className="grid gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
              </div>
            </Card>
          ) : isError ? (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <p className="text-muted-foreground text-sm">
                {getApiErrorMessage(
                  error,
                  "Could not load gym profile. Try again later.",
                )}
              </p>
            </Card>
          ) : (
            <Card className="gap-6 border-[#F4F4F4] bg-white p-6 shadow-none">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <Card className="gap-4 border-[#F4F4F4] p-5 shadow-none">
                      <ProfileField
                        label="Gym Name"
                        required
                        value={formData?.gymName ?? ""}
                        onChange={(value) => updateField("gymName", value)}
                        placeholder="Enter gym name"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Business Registration #"
                        value={formData?.businessRegistrationNumber ?? ""}
                        onChange={(value) =>
                          updateField("businessRegistrationNumber", value)
                        }
                        placeholder="Enter registration number"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Description"
                        value={formData?.description ?? ""}
                        onChange={(value) =>
                          updateField("description", value)
                        }
                        placeholder="Enter gym description"
                        textarea
                        disabled={!canEdit || fieldsDisabled}
                      />
                    </Card>
                  </div>

                  <div className="grid gap-4">
                    <h2 className="text-lg font-semibold">Contact & Social</h2>
                    <Card className="gap-4 border-[#F4F4F4] p-5 shadow-none">
                      <ProfileField
                        label="Gym Email"
                        value={formData?.gymEmail ?? ""}
                        onChange={(value) => updateField("gymEmail", value)}
                        placeholder="Enter gym email"
                        type="email"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Gym Phone"
                        value={formData?.gymPhone ?? ""}
                        onChange={(value) => updateField("gymPhone", value)}
                        placeholder="Enter gym phone"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Website"
                        value={formData?.website ?? ""}
                        onChange={(value) => updateField("website", value)}
                        placeholder="Enter website URL"
                        type="url"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Instagram"
                        value={formData?.instagram ?? ""}
                        onChange={(value) => updateField("instagram", value)}
                        placeholder="Enter Instagram handle"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Facebook"
                        value={formData?.facebook ?? ""}
                        onChange={(value) => updateField("facebook", value)}
                        placeholder="Enter Facebook profile"
                        disabled={!canEdit || fieldsDisabled}
                      />
                      <ProfileField
                        label="Twitter / X"
                        value={formData?.twitterX ?? ""}
                        onChange={(value) => updateField("twitterX", value)}
                        placeholder="Enter X handle"
                        disabled={!canEdit || fieldsDisabled}
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
                          {formData?.logoUrl ? (
                            <AvatarImage
                              src={formData.logoUrl}
                              alt="Gym logo"
                            />
                          ) : null}
                          <AvatarFallback>GYM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!canEdit || isUploading || saving}
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
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={!canEdit || saving || isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!canEdit || saving || isUploading}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
