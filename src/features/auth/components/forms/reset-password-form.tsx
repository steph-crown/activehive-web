import { useState, type ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import { useResetPasswordMutation } from "../../services";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;

type ResetPasswordFormProps = ComponentProps<"form"> & {
  token: string;
};

export function ResetPasswordForm({
  className,
  token,
  ...props
}: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      showSuccess(
        "Password updated",
        "You can now sign in with your new password.",
      );
      form.reset();
      navigate("/login", { replace: true });
    } catch (error) {
      showError(
        "Could not reset password",
        getApiErrorMessage(
          error,
          "This link may have expired. Request a new reset email.",
        ),
      );
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Choose a strong password. This link expires after one hour.
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-11"
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-foreground"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pr-11"
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-foreground"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full hover:scale-105"
            size="lg"
            loading={isPending}
          >
            Reset password
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
}
