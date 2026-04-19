import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useForgotPasswordMutation } from "../../services";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: requestReset, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await requestReset({ email: data.email.trim() });
      showSuccess(
        "Check your email",
        "If an account exists for that address, we sent a link to reset your password.",
      );
      form.reset();
    } catch (error) {
      showError(
        "Request failed",
        getApiErrorMessage(
          error,
          "Could not send reset email. Please try again.",
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
          <h1 className="text-2xl font-bold">Request password reset</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and we&apos;ll send you a link to choose a new
            password
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ade@mail.com" {...field} />
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
            Send reset link
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
