import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "bg-transparent border-[1.5px] border-[#eee] text-[#121212] shadow-none hover:bg-[#121212]/5 hover:text-[#121212] focus-visible:ring-[3px] focus-visible:ring-[#121212]/20 dark:bg-transparent dark:border-[#121212] dark:text-[#121212] dark:hover:bg-[#121212]/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-md px-5 py-2 ",
        sm: "h-8 rounded-md gap-1.5 px-3 ",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  // Ignore whitespace-only text nodes so `asChild` + Slot sees exactly one element (Radix requirement).
  const childList = React.Children.toArray(children).filter((node) => {
    if (node == null) return false;
    if (typeof node === "boolean") return false;
    if (typeof node === "string") return node.trim().length > 0;
    return true;
  });
  const soleChild = childList.length === 1 ? childList[0] : null;
  const shouldUseSlot =
    asChild && soleChild != null && React.isValidElement(soleChild);
  const Comp = shouldUseSlot ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {!shouldUseSlot && loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : null}
      {shouldUseSlot ? soleChild : children}
    </Comp>
  );
}

export { Button, buttonVariants };
