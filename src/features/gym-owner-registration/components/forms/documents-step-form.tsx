/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { NIGERIA_GOVERNMENT_ID_TYPES } from "@/features/gym-owner-registration/constants/nigeria-government-id-types";
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

  const RequiredAsterisk = () => (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );

  const OptionalLabelClassName =
    "italic font-light text-muted-foreground";

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
      const additionalDocuments =
        (data.additionalDocuments || []).filter(
          (file): file is File => !!file && (file as File).size > 0,
        );

      await submitDocuments({
        sessionId,
        companyRegNo: data.companyRegNo,
        governmentId: data.governmentId,
        governmentIdType: data.governmentIdType,
        addressProof: data.addressProof,
        addressProofDate: data.addressProofDate,
        additionalDocuments,
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
            JPG, PDF, and DOCX files up to 5MB.
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="companyRegNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company registration number (RC No.) <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your company registration number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="governmentIdType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Type of government ID <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your government ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIA_GOVERNMENT_ID_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>
                  Government-issued ID <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx"
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
                <FormLabel>
                  Address proof <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx"
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
                <FormLabel>
                  Date on the address proof <RequiredAsterisk />
                </FormLabel>
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
                <FormLabel className={OptionalLabelClassName}>
                  Additional documents (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx"
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
