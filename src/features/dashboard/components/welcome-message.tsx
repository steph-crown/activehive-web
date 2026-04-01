import type { ReactNode } from "react";
import { useProfileQuery } from "../services";
import { WelcomeMessageSkeleton } from "./dashboard-skeleton";

type WelcomeMessageProps = {
  endAdornment?: ReactNode;
};

export function WelcomeMessage({ endAdornment }: Readonly<WelcomeMessageProps>) {
  const { data: profile, isLoading } = useProfileQuery();

  if (isLoading || !profile) {
    return <WelcomeMessageSkeleton />;
  }

  const firstName = profile.firstName || "User";
  const greeting = getGreeting();

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-semibold">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's what's happening with your gym today.
        </p>
      </div>
      {endAdornment}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
