import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Request password reset</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and we'll send you password reset instructions
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="ade@mail.com" required />
        </div>

        <Button type="submit" className="w-full hover:scale-105" size={"lg"}>
          Request reset
        </Button>
      </div>
    </form>
  );
}
