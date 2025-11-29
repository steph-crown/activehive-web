import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBrandingStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

export function BrandingStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const primaryColorRef = useRef<HTMLInputElement | null>(null);
  const secondaryColorRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: submitBranding, isPending } = useBrandingStepMutation();
  const [primaryColor, setPrimaryColor] = useState("#FF5733");
  const [secondaryColor, setSecondaryColor] = useState("#1B1C1D");

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const logo = formData.get("logo") as File | null;

    if (!primaryColor || !logo || logo.size === 0) {
      showError("Error", "Primary color and logo are required.");
      return;
    }

    try {
      await submitBranding({
        sessionId,
        primaryColor,
        secondaryColor: secondaryColor || undefined,
        logo,
      });
      setStepStatus(2, "completed");
      showSuccess("Branding saved", "Let's upload your documents next.");

      // Reset form state
      setPrimaryColor("#FF5733");
      setSecondaryColor("#1B1C1D");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (event.currentTarget) {
        event.currentTarget.reset();
      }

      navigate("/compliance-documents");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save branding.";
      showError("Error", message);
    }
  };

  const handleSkip = () => {
    setStepStatus(2, "skipped");
    navigate("/compliance-documents");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Step 2 · Gym branding</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Pick the colors for your workspace and upload the logo we’ll show on
          invoices and emails.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="primaryColor">Primary color</Label>
          <div className="relative">
            <Input
              ref={primaryColorRef}
              id="primaryColor"
              name="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              required
            />
            <button
              type="button"
              onClick={() => primaryColorRef.current?.click()}
              className="flex items-center gap-3 w-full h-12 px-4 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div
                className="size-8 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-sm text-muted-foreground">
                Click to select color
              </span>
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="secondaryColor">
            Secondary color{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <Input
              ref={secondaryColorRef}
              id="secondaryColor"
              name="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
            />
            <button
              type="button"
              onClick={() => secondaryColorRef.current?.click()}
              className="flex items-center gap-3 w-full h-12 px-4 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div
                className="size-8 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: secondaryColor }}
              />
              <span className="text-sm text-muted-foreground">
                Click to select color
              </span>
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="logo">Gym logo</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.webp"
            ref={fileInputRef}
            required
          />
          <p className="text-muted-foreground text-xs">
            PNG, JPG, GIF, or WebP · max 5MB
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Saving..." : "Save & continue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </form>
  );
}
