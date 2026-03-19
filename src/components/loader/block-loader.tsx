import { Skeleton } from "@/components/ui/skeleton";

export function BlockLoader() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-6">
        <Skeleton className="h-10 w-64 mx-auto" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {["block-loader-card-0", "block-loader-card-1", "block-loader-card-2", "block-loader-card-3"].map(
            (key) => (
              <div
                // Stable-ish key; this loader is purely presentational.
                key={key}
                className="space-y-3 rounded-lg border p-4"
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
