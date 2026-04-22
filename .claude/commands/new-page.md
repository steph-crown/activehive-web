---
description: Add a new route page — creates the page file and wires the lazy route in App.tsx
argument-hint: "route-path [section: auth|dashboard] [feature: feature-name]"
allowed-tools: Read, Write, Edit, Bash
---

Add a new route to this project. The argument is: $ARGUMENTS

Parse from the argument:
- `route-path`: the URL segment (e.g., `gym-equipment`, `members/new`)
- `section`: `auth` or `dashboard` (default: `dashboard`)
- `feature`: which feature module to import the page component from (optional)

## Step 1 — Determine the file path

- Auth routes: `src/app/(auth)/<route-path>/page.tsx`
- Dashboard routes: `src/app/dashboard/<route-path>/page.tsx`

Dynamic segments use React Router convention: `[id]` in folder = `:id` in route path.

## Step 2 — Create the page file

Page files are thin wrappers only — all logic lives in the feature module.

```tsx
// src/app/(section)/<route-path>/page.tsx
import { FeatureNamePage } from "@/features/<feature-name>/components/<feature-name>-page";

export default function Page() {
  return <FeatureNamePage />;
}
```

If no feature is specified, create a stub:
```tsx
export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Page Title</h1>
      {/* TODO: import feature component */}
    </div>
  );
}
```

## Step 3 — Wire the route in App.tsx

Read `src/App.tsx` first to understand the existing route structure. Then:

1. Add the lazy import at the top with the other lazy imports:
```ts
const RouteName = lazy(() => import("@/app/(section)/<route-path>/page"));
```

2. Add the `<Route>` inside the correct parent `<Route>` block:
```tsx
<Route path="<route-path>" element={<RouteName />} />
```

For dynamic routes: `<Route path="<route-path>/:id" element={<RouteName />} />`

## Step 4 — Validate

Read `src/App.tsx` after editing to confirm the route was added correctly. Print:
- The page file path created
- The route path it maps to
- The lazy import line added
