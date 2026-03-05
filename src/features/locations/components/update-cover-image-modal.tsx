import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useUploadCoverImageMutation } from "../services";

const coverImageSchema = yup.object({
  image: yup
    .mixed<File>()
    .required("Cover image is required")
    .test("fileSize", "Image must be 5MB or less", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return false;
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      return validTypes.includes(value.type);
    }),
});

type CoverImageFormValues = yup.InferType<typeof coverImageSchema>;

interface UpdateCoverImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  onSuccess: () => void;
}

export function UpdateCoverImageModal({
  open,
  onOpenChange,
  locationId,
  onSuccess,
}: UpdateCoverImageModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: uploadCoverImage, isPending } =
    useUploadCoverImageMutation(locationId);

  const form = useForm<CoverImageFormValues>({
    resolver: yupResolver(coverImageSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const onSubmit = async (data: CoverImageFormValues) => {
    try {
      await uploadCoverImage(data.image);
      showSuccess("Success", "Cover image updated successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update cover image.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Cover Image</DialogTitle>
          <DialogDescription>
            Upload a new cover image for this location. This will be the main
            image shown across the app.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Cover image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, GIF, or WebP, max 5MB
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save cover image"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

