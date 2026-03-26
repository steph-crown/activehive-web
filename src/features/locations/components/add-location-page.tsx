import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { useCreateLocationMutation } from "../services";
import type { CreateLocationPayload } from "../types";

const STEPS = [
  "Basic Information",
  "Facilities",
  "Gallery",
  "Payment",
] as const;

const DEFAULT_FACILITIES = [
  "Weight Training",
  "Cardio Area",
  "CrossFit",
  "Yoga Studio",
  "Group Classes",
  "Boxing Area",
  "Swimming Pool",
  "Sauna",
  "Locker Rooms",
  "Parking",
  "Juice Bar",
] as const;

type FormState = {
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  coverImage: File | null;
  paymentAccount: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: "checking" | "savings";
  };
};

const initialForm: FormState = {
  locationName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  phone: "",
  email: "",
  isHeadquarters: false,
  coverImage: null,
  paymentAccount: {
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
  },
};

export function AddLocationPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { mutateAsync: createLocation, isPending } =
    useCreateLocationMutation();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryVideos, setGalleryVideos] = useState<File[]>([]);

  const allFacilities = useMemo(
    () => [...DEFAULT_FACILITIES, ...customFacilities],
    [customFacilities],
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setPaymentField = <K extends keyof FormState["paymentAccount"]>(
    key: K,
    value: FormState["paymentAccount"][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      paymentAccount: {
        ...prev.paymentAccount,
        [key]: value,
      },
    }));
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
      if (!form.paymentAccount.routingNumber.trim())
        return (
          showError("Missing field", "Routing number is required."),
          false
        );
      if (!form.paymentAccount.bankName.trim())
        return (showError("Missing field", "Bank name is required."), false);
    }
    return true;
  };

  const handleAddCustomFacility = () => {
    const value = customFacility.trim();
    if (!value) return;
    if (!allFacilities.includes(value)) {
      setCustomFacilities((prev) => [...prev, value]);
    }
    if (!selectedFacilities.includes(value)) {
      setSelectedFacilities((prev) => [...prev, value]);
    }
    setCustomFacility("");
  };

  const handleCreateLocation = async () => {
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
        routingNumber: form.paymentAccount.routingNumber.trim(),
        bankName: form.paymentAccount.bankName.trim(),
        accountType: form.paymentAccount.accountType,
      },
    };

    await createLocation(payload);
    showSuccess("Success", "Location created successfully.");
    navigate("/dashboard/locations");
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
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div className="grid gap-2">
                <Label>Location Name *</Label>
                <Input
                  value={form.locationName}
                  onChange={(event) =>
                    setField("locationName", event.target.value)
                  }
                  placeholder="Downtown Branch"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Address *</Label>
                  <Input
                    value={form.address}
                    onChange={(event) =>
                      setField("address", event.target.value)
                    }
                    placeholder="456 Oak Avenue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>City *</Label>
                  <Input
                    value={form.city}
                    onChange={(event) => setField("city", event.target.value)}
                    placeholder="Los Angeles"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>State *</Label>
                  <Input
                    value={form.state}
                    onChange={(event) => setField("state", event.target.value)}
                    placeholder="CA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Zip Code *</Label>
                  <Input
                    value={form.zipCode}
                    onChange={(event) =>
                      setField("zipCode", event.target.value)
                    }
                    placeholder="90001"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Country *</Label>
                  <Input
                    value={form.country}
                    onChange={(event) =>
                      setField("country", event.target.value)
                    }
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={(event) => setField("phone", event.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    placeholder="downtown@gym.com"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setField("coverImage", event.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="is-headquarters"
                  checked={form.isHeadquarters}
                  onCheckedChange={(checked) =>
                    setField("isHeadquarters", Boolean(checked))
                  }
                />
                <Label htmlFor="is-headquarters" className="leading-6">
                  Set as Headquarters
                </Label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Facilities</h2>
              <p className="text-muted-foreground text-sm">
                Select all facilities available at your gym.
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {allFacilities.map((facility) => {
                  const selected = selectedFacilities.includes(facility);
                  return (
                    <button
                      type="button"
                      key={facility}
                      onClick={() =>
                        setSelectedFacilities((prev) =>
                          prev.includes(facility)
                            ? prev.filter((item) => item !== facility)
                            : [...prev, facility],
                        )
                      }
                      className={`rounded-md border px-4 py-3 text-left ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-[#E6E6E6]"
                      }`}
                    >
                      {facility}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={customFacility}
                  onChange={(event) => setCustomFacility(event.target.value)}
                  placeholder="Add custom facility"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddCustomFacility}
                >
                  <IconPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Gallery</h2>
              <p className="text-muted-foreground text-sm">
                Upload location images and videos.
              </p>

              <div className="grid gap-2">
                <Label>Pictures</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setGalleryImages(Array.from(event.target.files || []))
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Selected: {galleryImages.length} image(s).
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Videos</Label>
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(event) =>
                    setGalleryVideos(Array.from(event.target.files || []))
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Selected: {galleryVideos.length} video(s).
                </p>
              </div>

              <p className="text-muted-foreground text-xs">
                Gallery uploads are UI-only for now (not sent to create location
                API).
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Payment Account</h2>

              <div className="grid gap-2">
                <Label>Account Name *</Label>
                <Input
                  value={form.paymentAccount.accountName}
                  onChange={(event) =>
                    setPaymentField("accountName", event.target.value)
                  }
                  placeholder="My Gym Account"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Account Number *</Label>
                  <Input
                    value={form.paymentAccount.accountNumber}
                    onChange={(event) =>
                      setPaymentField("accountNumber", event.target.value)
                    }
                    placeholder="1234567890"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Routing Number *</Label>
                  <Input
                    value={form.paymentAccount.routingNumber}
                    onChange={(event) =>
                      setPaymentField("routingNumber", event.target.value)
                    }
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Bank Name *</Label>
                  <Input
                    value={form.paymentAccount.bankName}
                    onChange={(event) =>
                      setPaymentField("bankName", event.target.value)
                    }
                    placeholder="Chase Bank"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Account Type *</Label>
                  <Select
                    value={form.paymentAccount.accountType}
                    onValueChange={(value) =>
                      setPaymentField(
                        "accountType",
                        value as "checking" | "savings",
                      )
                    }
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
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
                loading={isPending}
                onClick={async () => {
                  if (!validateStep()) return;
                  try {
                    await handleCreateLocation();
                  } catch (error) {
                    const message =
                      error instanceof Error
                        ? error.message
                        : "Failed to create location.";
                    showError("Error", message);
                  }
                }}
              >
                Create Location
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
