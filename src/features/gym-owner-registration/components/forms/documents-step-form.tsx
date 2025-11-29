/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useDocumentsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";
import {
  documentsSchema,
  type DocumentsFormValues,
} from "@/features/gym-owner-registration/schema";

// type DocumentsFormValues = yup.InferType<typeof documentsSchema>;
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

  const form = useForm<DocumentsFormValues>({
    resolver: yupResolver(documentsSchema) as any,
    // defaultValues: {
    //   additionalDocuments: [],
    // },
  });

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: DocumentsFormValues) => {
    try {
      await submitDocuments({
        sessionId,
        taxIdDocument: data.taxIdDocument,
        governmentId: data.governmentId,
        addressProof: data.addressProof,
        addressProofDate: data.addressProofDate,
        additionalDocuments: (data.additionalDocuments || []).filter(
          (file: any) => file && file.size > 0
        ),
      });
      setStepStatus(3, "completed");
      showSuccess("Documents uploaded", "Next, let's add your locations.");
      Object.values(fileRefs.current).forEach((input) => {
        if (input) input.value = "";
      });
      form.reset();
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
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Step 3 · Compliance documents</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Upload the required docs to verify your business. We accept PNG,
            JPG, or PDF files up to 10MB.
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="taxIdDocument"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value: _unused, ...field } }) => (
              <FormItem>
                <FormLabel>Tax ID / EIN document</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    ref={(ref) => {
                      fileRefs.current.taxIdDocument = ref;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="governmentId"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value: _unused, ...field } }) => (
              <FormItem>
                <FormLabel>Government-issued ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    ref={(ref) => {
                      fileRefs.current.governmentId = ref;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressProof"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value: _unused, ...field } }) => (
              <FormItem>
                <FormLabel>Address proof</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    ref={(ref) => {
                      fileRefs.current.addressProof = ref;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressProofDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date on the address proof</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalDocuments"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value: _unused, ...field } }) => (
              <FormItem>
                <FormLabel>Additional documents (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    multiple
                    ref={(ref) => {
                      fileRefs.current.additionalDocuments = ref;
                    }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      onChange(files);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
    </Form>
  );
}
