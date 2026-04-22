---
description: Scaffold a new reusable component following the shadcn/CVA pattern used in this codebase
argument-hint: ComponentName [--variants] [--in molecules|ui|layout]
allowed-tools: Read, Write, Edit, Bash
---

Create a new React component for this project. The argument is: $ARGUMENTS

Follow these rules exactly — they match the existing codebase conventions:

## Step 1 — Determine placement
- `src/components/ui/` — for primitive/atomic components (extend shadcn pattern)
- `src/components/molecules/` — for composite components that combine 2+ primitives
- `src/components/layout/` — for app shell / structural components
- `src/features/<feature>/components/` — for feature-specific components (if the name implies a domain)

Parse `--in <folder>` from the argument if provided, otherwise infer from the component name.

## Step 2 — Determine if it needs CVA variants
If the argument contains `--variants`, or the component name implies multiple visual states (Button, Badge, Alert, Tag, etc.), generate a CVA-based component. Otherwise generate a simple wrapper component.

## Step 3 — Write the file

### Simple component (no variants):
```tsx
import { cn } from "@/lib/utils";

interface ComponentNameProps extends React.ComponentProps<"div"> {
  // add any extra props here
}

export function ComponentName({ className, children, ...props }: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn("/* base tailwind classes */", className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

### CVA variant component:
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentNameVariants = cva(
  "/* base classes */",
  {
    variants: {
      variant: {
        default: "/* default styles */",
        secondary: "/* secondary styles */",
      },
      size: {
        sm: "/* small */",
        default: "/* default */",
        lg: "/* large */",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ComponentNameProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentNameVariants> {}

export function ComponentName({ className, variant, size, ...props }: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentNameVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Step 4 — Rules to follow
- Use named exports only (no default exports for components)
- Use `cn()` from `@/lib/utils` for class merging
- Extend the correct HTML element's props via `React.ComponentProps<"element">`
- Add `data-slot="component-name-kebab"` for CSS targeting
- Use Tailwind CSS variable tokens (`text-primary`, `bg-card`, etc.) — never hardcoded hex
- Use `@tabler/icons-react` or `lucide-react` for icons
- No comments explaining what the code does

After writing the file, print the file path and a one-line description of what was created.
