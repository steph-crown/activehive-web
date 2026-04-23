import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconUserPlus,
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
import { useLocationsQuery } from "@/features/locations/services";
import { membershipPlansApi, useMembershipPlansQuery } from "@/features/membership-plans/services";
import { useTrainersQuery } from "@/features/trainers/services";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { formatNgn } from "@/lib/format-ngn";
import { useCreateMemberMutation, useMembersQuery } from "../services";

const STEPS = [
  "Basic Info",
  "Membership",
  "Gym Assignment",
  "Profile & Compliance",
] as const;

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Flexibility",
  "Endurance",
  "Strength Training",
] as const;

type ProfileOption = "fill" | "invite" | null;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  membershipPlanId: string;
  startDate: string;
  endDate: string;
  promoCode: string;
  trainer: string;
  locationId: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  medicalConditions: string;
  injuries: string;
  allergies: string;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  membershipPlanId: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  promoCode: "",
  trainer: "",
  locationId: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  medicalConditions: "",
  injuries: "",
  allergies: "",
};

function addDurationToDate(startDate: string, duration: string) {
  if (!startDate || !duration) return "";

  const date = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  const normalized = duration.toLowerCase();
  const quantityMatch = normalized.match(/(\d+)/);
  const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;

  if (normalized.includes("quarter")) {
    date.setMonth(date.getMonth() + quantity * 3);
  } else if (normalized.includes("month")) {
    date.setMonth(date.getMonth() + quantity);
  } else if (normalized.includes("year")) {
    date.setFullYear(date.getFullYear() + quantity);
  } else if (normalized.includes("week")) {
    date.setDate(date.getDate() + quantity * 7);
  } else if (normalized.includes("day")) {
    date.setDate(date.getDate() + quantity);
  } else {
    return "";
  }

  return date.toISOString().split("T")[0];
}

function formatPlanPriceNgn(value: string | number): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return String(value);
  return formatNgn(n, { decimals: true });
}

type AddMemberPageProps = {
  mode?: "create" | "edit";
  memberId?: string;
};

export function AddMemberPage({
  mode = "create",
  memberId,
}: Readonly<AddMemberPageProps>) {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [step, setStep] = useState(0);
  const [profileOption, setProfileOption] = useState<ProfileOption>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: members } = useMembersQuery();
  const { data: membershipPlans, isLoading: plansLoading } =
    useMembershipPlansQuery(form.locationId || undefined);
  const { data: trainers = [], isLoading: trainersLoading } = useTrainersQuery(
    form.locationId ? { locationId: form.locationId } : {},
  );
  const { mutateAsync: createMember, isPending } = useCreateMemberMutation();
  const [promoValidation, setPromoValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const selectedMember = useMemo(
    () =>
      mode === "edit"
        ? members?.find(
            (item) => item.id === memberId || item.memberId === memberId,
          )
        : undefined,
    [memberId, members, mode],
  );

  const selectedPlan = useMemo(
    () => membershipPlans?.find((plan) => plan.id === form.membershipPlanId),
    [membershipPlans, form.membershipPlanId],
  );

  const trainerDisplayName = (t: (typeof trainers)[number]) => {
    const name = `${t.firstName} ${t.lastName}`.trim();
    return name || t.email;
  };

  useEffect(() => {
    if (!selectedPlan || !form.startDate) {
      setForm((prev) => ({ ...prev, endDate: "" }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      endDate: addDurationToDate(prev.startDate, selectedPlan.duration),
    }));
  }, [form.startDate, selectedPlan]);

  useEffect(() => {
    const promoCode = form.promoCode.trim();
    const planId = form.membershipPlanId;

    if (!promoCode || !planId) {
      setPromoValidation(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingPromo(true);
      try {
        const result = await membershipPlansApi.validatePromoCode(planId, promoCode);
        setPromoValidation(result);
      } catch {
        setPromoValidation({ valid: false, message: "Failed to validate promo code." });
      } finally {
        setIsValidatingPromo(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.promoCode, form.membershipPlanId]);

  useEffect(() => {
    if (mode !== "edit" || !selectedMember) return;
    setForm((prev) => ({
      ...prev,
      firstName: selectedMember.member.firstName,
      lastName: selectedMember.member.lastName,
      email: selectedMember.member.email,
      phoneNumber: selectedMember.member.phoneNumber || "",
      membershipPlanId: selectedMember.membershipPlanId,
      startDate: selectedMember.startDate.slice(0, 10),
      endDate: selectedMember.endDate.slice(0, 10),
      locationId: selectedMember.location.id,
      promoCode: "SUMMER2024",
      gender: "prefer-not",
      address: "No 10, ActiveHive street",
      trainer: "none",
      emergencyContactName: "Jane Doe",
      emergencyContactRelationship: "Sibling",
      emergencyContactPhone: "+2348000000000",
      medicalConditions: "None reported",
      injuries: "None reported",
      allergies: "None reported",
    }));
    setProfileOption("fill");
    setTermsAccepted(true);
    setSelectedGoals(["General Fitness"]);
  }, [mode, selectedMember]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (locationId: string) => {
    setForm((prev) => ({
      ...prev,
      locationId,
    }));
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal],
    );
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName.trim()) {
        showError("Missing field", "First name is required.");
        return false;
      }
      if (!form.lastName.trim()) {
        showError("Missing field", "Last name is required.");
        return false;
      }
      if (!form.email.trim()) {
        showError("Missing field", "Email is required.");
        return false;
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
      if (!isEmailValid) {
        showError("Invalid field", "Enter a valid email address.");
        return false;
      }
    }

    if (step === 1) {
      if (!form.membershipPlanId) {
        showError("Missing field", "Membership plan is required.");
        return false;
      }
      if (!form.startDate) {
        showError("Missing field", "Start date is required.");
        return false;
      }
    }

    if (step === 2 && !form.locationId) {
      showError("Missing field", "Assigned branch is required.");
      return false;
    }

    return true;
  };

  const submitMember = async () => {
    try {
      if (mode === "edit") {
        showSuccess("Saved", "Member profile update is currently UI-only.");
        navigate(
          memberId ? `/dashboard/members/${memberId}` : "/dashboard/members",
        );
        return;
      }

      await createMember({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        membershipPlanId: form.membershipPlanId,
        ...(form.phoneNumber.trim() && {
          phoneNumber: form.phoneNumber.trim(),
        }),
        ...(form.dateOfBirth.trim() && {
          dateOfBirth: form.dateOfBirth.trim(),
        }),
        ...(form.locationId.trim() && { locationId: form.locationId.trim() }),
        ...(form.startDate.trim() && { startDate: form.startDate.trim() }),
        ...(form.promoCode.trim() && { promoCode: form.promoCode.trim() }),
      });

      showSuccess("Success", "Member created successfully.");
      navigate("/dashboard/members");
    } catch (error) {
      showError("Error", getApiErrorMessage(error, "Failed to create member."));
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-medium">
            {mode === "edit" ? "Edit Member" : "Add Member"}
          </h1>
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
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChange={(event) =>
                      setField("firstName", event.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={form.lastName}
                    onChange={(event) =>
                      setField("lastName", event.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phoneNumber}
                    onChange={(event) =>
                      setField("phoneNumber", event.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) =>
                      setField("dateOfBirth", event.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Select
                    value={form.gender || undefined}
                    onValueChange={(value) => setField("gender", value)}
                  >
                    <SelectTrigger className="!h-10 w-full shadow-xs">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Membership Assignment</h2>
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Membership Plan *</Label>
                  <Select
                    value={form.membershipPlanId || undefined}
                    onValueChange={(value) =>
                      setField("membershipPlanId", value)
                    }
                    disabled={plansLoading || mode === "edit"}
                  >
                    <SelectTrigger className="h-10 w-full shadow-xs">
                      <SelectValue placeholder="Select a membership plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plansLoading ? (
                        <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                          Loading plans…
                        </div>
                      ) : membershipPlans && membershipPlans.length > 0 ? (
                        membershipPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {formatPlanPriceNgn(plan.price)} [
                            {plan.duration}]
                          </SelectItem>
                        ))
                      ) : (
                        <div className="max-w-xs p-2">
                          <p className="text-muted-foreground px-2 py-1.5 text-sm leading-snug">
                            {form.locationId
                              ? "No membership plans for this location yet."
                              : "No membership plans yet. Create one to continue."}
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            className="text-primary h-auto w-full justify-start px-2 py-2 text-sm font-medium underline-offset-4 hover:underline"
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const params = new URLSearchParams();
                              params.set("createPlan", "1");
                              params.set("returnTo", "/dashboard/members/new");
                              navigate(
                                `/dashboard/membership-plans?${params.toString()}`,
                              );
                            }}
                          >
                            Create a membership plan
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Promo Code</Label>
                  <Input
                    value={form.promoCode}
                    onChange={(event) =>
                      setField("promoCode", event.target.value)
                    }
                    placeholder="SUMMER2024"
                    disabled={mode === "edit"}
                  />
                  {isValidatingPromo && (
                    <p className="text-muted-foreground text-xs">Validating…</p>
                  )}
                  {!isValidatingPromo && promoValidation && !promoValidation.valid && (
                    <p className="text-destructive text-sm">{promoValidation.message}</p>
                  )}
                  {!isValidatingPromo && promoValidation?.valid && (
                    <p className="text-sm text-green-600">{promoValidation.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      setField("startDate", event.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} disabled />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
              <h2 className="text-lg font-semibold">Gym Assignment</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Assigned Trainer</Label>
                  <Select
                    value={form.trainer || undefined}
                    onValueChange={(value) => setField("trainer", value)}
                    disabled={trainersLoading}
                  >
                    <SelectTrigger className="h-10 w-full shadow-xs">
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Trainer</SelectItem>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainerDisplayName(trainer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Assigned Branch *</Label>
                  <Select
                    value={form.locationId || undefined}
                    onValueChange={handleLocationChange}
                    disabled={locationsLoading}
                  >
                    <SelectTrigger className="h-10 w-full shadow-xs">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              {mode === "create" && !profileOption && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setProfileOption("fill")}
                    className="rounded-md border border-[#F4F4F4] bg-white p-6 text-left transition hover:border-primary"
                  >
                    <h3 className="text-lg font-semibold">Fill Profile Now</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Complete emergency contact, health and agreements before
                      creating.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileOption("invite")}
                    className="rounded-md border border-[#F4F4F4] bg-white p-6 text-left transition hover:border-primary"
                  >
                    <h3 className="text-lg font-semibold">Send Invite Link</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Create account now and let member complete profile from
                      invite.
                    </p>
                  </button>
                </div>
              )}

              {profileOption === "invite" && (
                <div className="rounded-md border border-[#F4F4F4] bg-white p-6">
                  <h3 className="text-lg font-semibold">Send Member Invite</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    This will create the member and send onboarding invite
                    email.
                  </p>
                  <div className="mt-4">
                    <Button onClick={submitMember} loading={isPending}>
                      <IconMail className="h-4 w-4" />
                      Send Invite Link
                    </Button>
                    <Button
                      variant="ghost"
                      className="ml-2"
                      onClick={() => setProfileOption(null)}
                    >
                      Choose another option
                    </Button>
                  </div>
                </div>
              )}

              {profileOption === "fill" && (
                <>
                  <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
                    <h2 className="text-lg font-semibold">Emergency Contact</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label>Contact Name *</Label>
                        <Input
                          value={form.emergencyContactName}
                          onChange={(event) =>
                            setField("emergencyContactName", event.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Relationship *</Label>
                        <Input
                          value={form.emergencyContactRelationship}
                          onChange={(event) =>
                            setField(
                              "emergencyContactRelationship",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone *</Label>
                        <Input
                          value={form.emergencyContactPhone}
                          onChange={(event) =>
                            setField(
                              "emergencyContactPhone",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
                    <h2 className="text-lg font-semibold">Health & Fitness</h2>
                    <div className="grid gap-2">
                      <Label>Fitness Goals</Label>
                      <div className="flex flex-wrap gap-2">
                        {FITNESS_GOALS.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={`rounded-md border px-3 py-1.5 text-sm ${
                              selectedGoals.includes(goal)
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Medical Conditions</Label>
                      <textarea
                        rows={2}
                        value={form.medicalConditions}
                        onChange={(event) =>
                          setField("medicalConditions", event.target.value)
                        }
                        className="border-input w-full rounded-md border px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Injuries</Label>
                      <textarea
                        rows={2}
                        value={form.injuries}
                        onChange={(event) =>
                          setField("injuries", event.target.value)
                        }
                        className="border-input w-full rounded-md border px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Allergies</Label>
                      <textarea
                        rows={2}
                        value={form.allergies}
                        onChange={(event) =>
                          setField("allergies", event.target.value)
                        }
                        className="border-input w-full rounded-md border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-md border border-[#F4F4F4] bg-white p-6">
                    <h2 className="text-lg font-semibold">Agreements</h2>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="member-terms"
                        checked={termsAccepted}
                        onCheckedChange={(value) =>
                          setTermsAccepted(Boolean(value))
                        }
                      />
                      <Label
                        htmlFor="member-terms"
                        className="text-sm leading-5"
                      >
                        I confirm the member has accepted the gym terms and
                        privacy policy.
                      </Label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 0) {
                  navigate("/dashboard/members");
                  return;
                }
                setStep((prev) => prev - 1);
              }}
            >
              <IconChevronLeft className="h-4 w-4" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            ) : profileOption === "fill" ? (
              <Button
                onClick={submitMember}
                disabled={!termsAccepted || isPending}
              >
                <IconUserPlus className="h-4 w-4" />
                {isPending
                  ? "Saving..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Member"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
