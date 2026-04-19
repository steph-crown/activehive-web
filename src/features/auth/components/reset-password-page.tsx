import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "./forms/reset-password-form";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const token = useMemo(() => {
    const raw =
      searchParams.get("token") ??
      searchParams.get("resetToken") ??
      searchParams.get("t") ??
      "";
    return raw.trim();
  }, [searchParams]);

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Invalid or missing link</h1>
          <p className="text-muted-foreground max-w-md text-sm text-balance">
            This reset link is missing a token. Open the link from your email,
            or request a new password reset.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="default">
              <Link to="/forgot-password">Request reset email</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
