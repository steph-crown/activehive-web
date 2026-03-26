import LogoIcon from "@/assets/logo.svg?react";
import { useEffect, useState } from "react";

export function BlockLoader() {
  const loadingTexts = [
    "Preparing your dashboard",
    "Syncing your gym data",
    "Almost ready",
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [loadingTexts.length]);

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-primary/10 p-5">
          <LogoIcon className="h-10 w-10 animate-pulse text-primary" />
        </div>
        <p className="font-bebas text-xl tracking-wide text-foreground">
          {loadingTexts[textIndex]}
          <span className="ml-1 inline-flex gap-0.5 align-middle">
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          </span>
        </p>
        <p className="text-muted-foreground text-xs">
          Loading your workspace experience
        </p>
      </div>
    </div>
  );
}
