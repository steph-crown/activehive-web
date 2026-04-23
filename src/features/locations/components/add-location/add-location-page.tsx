import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { locationsQueryKeys, useCreateLocationMutation } from "../../services";
import type { CreateLocationPayload } from "../../types";

import { BasicInformationStep } from "./basic-information-step";
import {
  DEFAULT_FACILITIES,
  isAllowedGalleryImageFile,
  LOCATION_MEDIA_UPLOAD_FOLDER,
  STEPS,
} from "./constants";
import { FacilitiesStep } from "./facilities-step";
import { GalleryStep } from "./gallery-step";
import { PaymentStep } from "./payment-step";
import { initialForm, type FacilityItem, type FormState, type GalleryItem } from "./types";

export function AddLocationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToast();
  const { mutateAsync: createLocation } = useCreateLocationMutation();
  const { uploadMany, isUploading } = useUpload();
  const [isSaving, setIsSaving] = useState(false);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedFacilities, setSelectedFacilities] = useState<FacilityItem[]>([]);
  const [customFacilities, setCustomFacilities] = useState<FacilityItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const allFacilities = useMemo(
    () => [...DEFAULT_FACILITIES, ...customFacilities],
    [customFacilities],
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.locationName.trim())
        return (
          showError("Missing field", "Location name is required."),
          false
        );
      if (!form.address.trim())
        return (showError("Missing field", "Address is required."), false);
      if (!form.city.trim())
        return (showError("Missing field", "City is required."), false);
      if (!form.state.trim())
        return (showError("Missing field", "State is required."), false);
      if (!form.zipCode.trim())
        return (showError("Missing field", "Zip code is required."), false);
      if (!form.country.trim())
        return (showError("Missing field", "Country is required."), false);
      if (!form.phone.trim())
        return (showError("Missing field", "Phone is required."), false);
      if (!form.email.trim())
        return (showError("Missing field", "Email is required."), false);
    }
    if (step === 3) {
      if (!form.paymentAccount.accountName.trim())
        return (showError("Missing field", "Account name is required."), false);
      if (!form.paymentAccount.accountNumber.trim())
        return (
          showError("Missing field", "Account number is required."),
          false
        );
      if (!form.paymentAccount.bankCode.trim())
        return (showError("Missing field", "Bank code is required."), false);
      if (!form.paymentAccount.bankName.trim())
        return (showError("Missing field", "Bank name is required."), false);
    }
    return true;
  };

  const handleAddCustomFacility = (facility: FacilityItem) => {
    const name = facility.name.trim();
    if (!name) return;
    if (!customFacilities.some((f) => f.name === name)) {
      setCustomFacilities((prev) => [...prev, facility]);
    }
    if (!selectedFacilities.some((f) => f.name === name)) {
      setSelectedFacilities((prev) => [...prev, facility]);
    }
  };

  const handleRemoveCustomFacility = (name: string) => {
    setCustomFacilities((prev) => prev.filter((f) => f.name !== name));
    setSelectedFacilities((prev) => prev.filter((f) => f.name !== name));
  };

  const handleToggleFacility = (facility: FacilityItem) => {
    setSelectedFacilities((prev) =>
      prev.some((f) => f.name === facility.name)
        ? prev.filter((f) => f.name !== facility.name)
        : [...prev, facility],
    );
  };

  const handleAddGalleryFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const queue: File[] = [];
      let skipped = 0;
      for (const file of files) {
        if (isAllowedGalleryImageFile(file)) {
          queue.push(file);
        } else {
          skipped += 1;
        }
      }

      if (skipped > 0) {
        showError(
          "Some files skipped",
          "Only JPG, PNG, GIF, or WebP images can be added to the gallery.",
        );
      }
      if (!queue.length) {
        if (skipped === files.length) {
          showError(
            "Invalid files",
            "Please add JPG, PNG, GIF, or WebP images.",
          );
        }
        return;
      }

      setIsGalleryUploading(true);
      try {
        const urls = await uploadMany(queue, LOCATION_MEDIA_UPLOAD_FOLDER);
        const newItems: GalleryItem[] = urls.map((url) => ({
          id: crypto.randomUUID(),
          url,
        }));
        setGalleryItems((prev) => [...prev, ...newItems]);
      } catch (error) {
        showError(
          "Upload failed",
          getApiErrorMessage(error, "Failed to upload images."),
        );
      } finally {
        setIsGalleryUploading(false);
      }
    },
    [showError, uploadMany],
  );

  const removeGalleryItem = useCallback((id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleCreateLocation = async () => {
    setIsSaving(true);
    try {
      const galleryImageUrls = galleryItems.map((item) => item.url);

      const payload: CreateLocationPayload = {
        locationName: form.locationName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.trim(),
        country: form.country.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        isHeadquarters: form.isHeadquarters,
        paymentAccount: {
          accountName: form.paymentAccount.accountName.trim(),
          accountNumber: form.paymentAccount.accountNumber.trim(),
          bankName: form.paymentAccount.bankName.trim(),
          bankCode: form.paymentAccount.bankCode.trim(),
        },
        facilities: selectedFacilities,
        ...(galleryImageUrls.length > 0 && { galleryImages: galleryImageUrls }),
      };

      await createLocation(payload);
      await queryClient.invalidateQueries({ queryKey: locationsQueryKeys.all });
      showSuccess("Success", "Location created successfully.");
      navigate("/dashboard/locations");
    } catch (error) {
      showError(
        "Error",
        getApiErrorMessage(error, "Failed to create location."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-medium">Add Location</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Step {step + 1} of {STEPS.length} - {STEPS[step]}
          </p>
        </div>

        <div className="px-4 lg:px-6">
          <div className="w-full max-w-5xl">
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {STEPS.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-md border px-3 py-2 text-center ${
                    index <= step
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {step === 0 && (
              <BasicInformationStep form={form} setField={setField} />
            )}

            {step === 1 && (
              <FacilitiesStep
                allFacilities={allFacilities}
                selectedFacilities={selectedFacilities}
                onToggleFacility={handleToggleFacility}
                onAddCustomFacility={handleAddCustomFacility}
                onRemoveCustomFacility={handleRemoveCustomFacility}
                customFacilities={customFacilities}
              />
            )}

            {step === 2 && (
              <GalleryStep
                galleryItems={galleryItems}
                galleryInputRef={galleryInputRef}
                isGalleryDragging={isGalleryDragging}
                setIsGalleryDragging={setIsGalleryDragging}
                isGalleryUploading={isGalleryUploading}
                onAddGalleryFiles={handleAddGalleryFiles}
                onRemoveGalleryItem={removeGalleryItem}
              />
            )}

            {step === 3 && (
              <PaymentStep
                value={form.paymentAccount}
                onChange={(next) => setField("paymentAccount", next)}
              />
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 0) {
                    navigate("/dashboard/locations");
                    return;
                  }
                  setStep((prev) => prev - 1);
                }}
              >
                <IconChevronLeft className="h-4 w-4" />
                {step === 0 ? "Cancel" : "Back"}
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  disabled={step === 2 && isGalleryUploading}
                  onClick={() => {
                    if (!validateStep()) return;
                    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
                  }}
                >
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  loading={isSaving || isUploading}
                  onClick={async () => {
                    if (!validateStep()) return;
                    await handleCreateLocation();
                  }}
                >
                  Create Location
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
