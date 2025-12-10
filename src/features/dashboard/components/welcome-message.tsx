import { useProfileQuery } from "../services";

export function WelcomeMessage() {
  const { data: profile, isLoading } = useProfileQuery();

  if (isLoading || !profile) {
    return (
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-semibold">Welcome!</h2>
      </div>
    );
  }

  const firstName = profile.firstName || "User";
  const greeting = getGreeting();

  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-2xl font-semibold">
        {greeting}, {firstName}! 👋
      </h2>
      <p className="text-muted-foreground mt-1">
        Here's what's happening with your gym today.
      </p>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
