import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDocumentsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

export function DocumentsStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: submitDocuments, isPending } =
    useDocumentsStepMutation();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const taxIdDocument = formData.get("taxIdDocument") as File | null;
    const governmentId = formData.get("governmentId") as File | null;
    const addressProof = formData.get("addressProof") as File | null;
    const addressProofDate = formData.get("addressProofDate")?.toString() ?? "";
    const additionalDocuments = Array.from(
      (formData.getAll("additionalDocuments") as File[]) ?? []
    ).filter((file) => file && file.size > 0);

    if (!taxIdDocument || !governmentId || !addressProof || !addressProofDate) {
      showError("Error", "All required documents must be provided.");
      return;
    }

    try {
      await submitDocuments({
        sessionId,
        taxIdDocument,
        governmentId,
        addressProof,
        addressProofDate,
        additionalDocuments,
      });
      setStepStatus(3, "completed");
      showSuccess("Documents uploaded", "Next, let's add your locations.");
      Object.values(fileRefs.current).forEach((input) => {
        if (input) input.value = "";
      });
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
      navigate("/gym-locations");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload documents.";
      showError("Error", message);
    }
  };

  const handleSkip = () => {
    setStepStatus(3, "skipped");
    navigate("/gym-locations");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Step 3 · Compliance documents</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Upload the required docs to verify your business. We accept PNG, JPG,
          or PDF files up to 10MB.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="taxIdDocument">Tax ID / EIN document</Label>
          <Input
            id="taxIdDocument"
            name="taxIdDocument"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            ref={(ref) => {
              fileRefs.current.taxIdDocument = ref;
            }}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="governmentId">Government-issued ID</Label>
          <Input
            id="governmentId"
            name="governmentId"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            ref={(ref) => {
              fileRefs.current.governmentId = ref;
            }}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="addressProof">Address proof</Label>
          <Input
            id="addressProof"
            name="addressProof"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            ref={(ref) => {
              fileRefs.current.addressProof = ref;
            }}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="addressProofDate">Date on the address proof</Label>
          <Input
            id="addressProofDate"
            name="addressProofDate"
            type="date"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="additionalDocuments">
            Additional documents (optional)
          </Label>
          <Input
            id="additionalDocuments"
            name="additionalDocuments"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            multiple
            ref={(ref) => {
              fileRefs.current.additionalDocuments = ref;
            }}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Uploading..." : "Save & continue"}
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
