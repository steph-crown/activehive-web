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
import { useUploadLocationImageMutation } from "../services";

const uploadImageSchema = yup.object({
  image: yup
    .mixed<File>()
    .required("Image is required")
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

type UploadImageFormValues = yup.InferType<typeof uploadImageSchema>;

interface UploadLocationImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  onSuccess: () => void;
}

export function UploadLocationImageModal({
  open,
  onOpenChange,
  locationId,
  onSuccess,
}: UploadLocationImageModalProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: uploadImage, isPending } =
    useUploadLocationImageMutation(locationId);

  const form = useForm<UploadImageFormValues>({
    resolver: yupResolver(uploadImageSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const onSubmit = async (data: UploadImageFormValues) => {
    try {
      await uploadImage(data.image);
      showSuccess("Success", "Image uploaded successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload image.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Location Image</DialogTitle>
          <DialogDescription>
            Upload an image for this location. Multiple images can be added.
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
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
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
                {isPending ? "Uploading..." : "Upload Image"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
