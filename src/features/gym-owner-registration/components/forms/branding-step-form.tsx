import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useBrandingStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";
import {
  brandingSchema,
  type BrandingFormValues,
} from "@/features/gym-owner-registration/schema";

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

  const form = useForm<BrandingFormValues>({
    // @ts-expect-error - Type inference issue with yup resolver and optional fields
    resolver: yupResolver(brandingSchema),
    defaultValues: {
      primaryColor: "#FF5733",
      secondaryColor: "#1B1C1D",
    },
  });

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: BrandingFormValues) => {
    try {
      await submitBranding({
        sessionId,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor || undefined,
        logo: data.logo,
      });
      setStepStatus(2, "completed");
      showSuccess("Branding saved", "Let's upload your documents next.");
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        // @ts-expect-error - Type inference issue with yup resolver
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Step 2 · Gym branding</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Pick the colors for your workspace and upload the logo we'll show on
            invoices and emails.
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            // @ts-expect-error - Type inference issue with yup resolver
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary color</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      ref={primaryColorRef}
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={() => primaryColorRef.current?.click()}
                      className="flex items-center gap-3 w-full h-12 px-4 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div
                        className="size-8 rounded-full border-2 border-border shadow-sm"
                        style={{ backgroundColor: field.value }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Click to select color
                      </span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // @ts-expect-error - Type inference issue with yup resolver
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Secondary color{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      ref={secondaryColorRef}
                      type="color"
                      value={field.value || "#1B1C1D"}
                      onChange={field.onChange}
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={() => secondaryColorRef.current?.click()}
                      className="flex items-center gap-3 w-full h-12 px-4 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div
                        className="size-8 rounded-full border-2 border-border shadow-sm"
                        style={{ backgroundColor: field.value || "#1B1C1D" }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Click to select color
                      </span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // @ts-expect-error - Type inference issue with yup resolver
            control={form.control}
            name="logo"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <FormLabel>Gym logo</FormLabel>
                <FormControl>
                  <Input
                    ref={(e) => {
                      fileInputRef.current = e;
                      if (typeof ref === "function") {
                        ref(e);
                      } else if (ref && "current" in ref) {
                        (
                          ref as React.MutableRefObject<HTMLInputElement | null>
                        ).current = e;
                      }
                    }}
                    name={name}
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                  />
                </FormControl>
                <p className="text-muted-foreground text-xs">
                  PNG, JPG, GIF, or WebP · max 5MB
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

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
    </Form>
  );
}
