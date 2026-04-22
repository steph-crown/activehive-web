# ActiveHive Gym Web

Gym management SaaS for Nigerian gym owners — onboarding, member management, classes, subscriptions, staff, payments, marketing. Backend API is under active development; see `BACKEND_API_INTEGRATION_AUDIT.md` for pending endpoints.

## Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| UI | React | 19.2.1 |
| Routing | React Router | 7.6.3 |
| Build | Vite + SWC | 6.3.5 |
| Language | TypeScript | 5.8.3 |
| State | Zustand | 5.0.8 |
| Data fetching | TanStack Query | 5.x |
| HTTP | Axios | 1.13.2 |
| Forms | react-hook-form + Yup | 7.x / 1.x |
| UI primitives | Radix UI + shadcn | — |
| Styling | Tailwind CSS | 4.x |
| Icons | @tabler/icons-react, lucide-react | — |
| Tables | @tanstack/react-table | 8.x |
| Drag & Drop | @dnd-kit | — |
| Animations | framer-motion | 12.x |
| Toasts | Custom context (`useToast`) | — |

## Project Structure

```
src/
├─ app/               # Route pages only — one page.tsx per route, no logic here
│  ├─ (auth)/         # Auth flow (login, signup, otp, forgot/reset password, onboarding)
│  └─ dashboard/      # Dashboard with nested dynamic segments ([id])
├─ features/          # Domain modules — each owns components, services, types, lib
│  ├─ auth/
│  ├─ members/
│  ├─ locations/
│  ├─ classes/
│  └─ [12 other domains]
├─ components/
│  ├─ ui/             # shadcn/Radix primitives — do NOT edit; wrap instead
│  ├─ molecules/      # Shared composite components (DataTable, TableFilterBar)
│  └─ layout/         # App shell: AppSidebar, SiteHeader, NavMain
├─ hooks/             # App-wide hooks: useToast, useUpload, useMobile
├─ lib/               # Pure utilities: cn(), apiClient, formatters, error helpers
├─ store/             # Zustand stores (global/cross-feature state only)
├─ providers/         # React context providers (Toast)
└─ assets/            # Satoshi font files and static gym images
```

## Canonical Patterns

### Import alias
Always `@/` — never relative paths across feature or layer boundaries.
```ts
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { apiClient } from "@/lib/api-client";
```

### Components
shadcn pattern: named exports, `cn()` for class merging, `data-slot` attributes, CVA for variants.
```tsx
export function MyCard({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="my-card" className={cn("rounded-xl border bg-card", className)} {...props} />;
}
```
CVA for multi-variant components:
```tsx
const variants = cva("base-classes", {
  variants: { size: { sm: "h-8 px-3", lg: "h-11 px-6" } },
  defaultVariants: { size: "sm" },
});
```

### Forms — use this pattern for every new form
react-hook-form + Yup + shadcn `<Form>` primitives. Never use raw `useState` for form state.
```tsx
// schema.ts (co-located with the form)
export const mySchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
});
export type MyFormValues = yup.InferType<typeof mySchema>;

// MyForm.tsx
const form = useForm<MyFormValues>({
  resolver: yupResolver(mySchema),
  defaultValues: { email: "" },
});

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField control={form.control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email <span aria-hidden="true">*</span></FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <Button type="submit" loading={isPending}>Submit</Button>
    </form>
  </Form>
);
```
**Known exception**: `src/features/members/components/add-member-page.tsx` uses raw `useState` — this is an antipattern, do not replicate it.

### API layer
Every feature has `services/api.ts` (raw calls) + `services/queries.ts` (React Query hooks + query key factory).
```ts
// services/api.ts
export const thingsApi = {
  list: (locationId?: string) =>
    apiClient.get<Thing[]>("/api/gym-owner/things", { params: { locationId } }),
  create: (payload: CreateThingPayload) =>
    apiClient.post<Thing>("/api/gym-owner/things", payload),
};

// services/queries.ts
export const thingsQueryKeys = {
  all: ["things"] as const,
  list: (locationId?: string) => [...thingsQueryKeys.all, "list", locationId] as const,
  detail: (id: string) => [...thingsQueryKeys.all, "detail", id] as const,
};

export const useThingsQuery = (locationId?: string) =>
  useQuery({ queryKey: thingsQueryKeys.list(locationId), queryFn: () => thingsApi.list(locationId) });

export const useCreateThingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: thingsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: thingsQueryKeys.all }),
  });
};
```

### Error handling
Always normalize API errors with `getApiErrorMessage`:
```ts
} catch (err) {
  toast.showError(getApiErrorMessage(err, "Something went wrong"));
}
```

### State (Zustand)
- Global state lives in `src/store/` — use `zustand` with `persist` middleware for anything that must survive refresh
- Feature-local UI state: `useState`
- Server state: React Query (not Zustand)
- `auth.store.ts` manually persists to localStorage (legacy) — new stores must use `persist` middleware

### Feature folder shape
```
features/my-feature/
├─ components/           # Page component(s) + subcomponents
├─ services/
│  ├─ api.ts            # Raw apiClient calls, typed
│  └─ queries.ts        # useQuery/useMutation hooks + queryKeys factory
├─ types/index.ts       # Payload, Response, domain types
├─ lib/                 # Feature-specific formatters/normalizers
└─ constants/           # Static lists, lookup maps
```

### Routing
All routes are lazy-loaded in `src/App.tsx`. To add a route:
1. Create `src/app/(section)/route-name/page.tsx` — default export, no logic (import from features)
2. Add `const Page = lazy(() => import("@/app/(section)/route-name/page"))` in `App.tsx`
3. Add `<Route path="route-name" element={<Page />} />` in the appropriate route group

### Styling
- Tailwind 4 — use CSS variable tokens, never hardcoded hex in className
- Primary yellow: `text-primary`, `bg-primary` → `--primary: #fabe12`
- Dark mode: `dark:` variants via `.dark` class on `<html>`
- Font: Satoshi — loaded globally via `@font-face` in `index.css`
- `cn()` from `@/lib/utils` for conditional / merged classes

## Commands

```bash
pnpm dev        # Vite dev server (hot reload via SWC)
pnpm build      # tsc -b && vite build
pnpm lint       # ESLint (flat config, TS + React Hooks rules)
pnpm preview    # Preview production build
```

Env var: `VITE_API_BASE_URL` (defaults to `https://activehiveapi.onrender.com`)

## What NOT to Do

- **Don't copy the `AddMemberPage` form pattern** — raw `useState` for 17+ fields is the antipattern here
- **Don't use relative imports** across feature or layer boundaries — always `@/`
- **Don't hardcode hex colors** in Tailwind classes — use CSS var tokens (`text-primary`, etc.)
- **Don't add new global stores** without `zustand/middleware` `persist` if data needs refresh survival
- **Don't edit `src/components/ui/`** — shadcn primitives; extend by wrapping, not modifying
- **Don't skip `*QueryKeys` factory** — always define one per feature for correct cache invalidation
- **Don't add tests without a plan** — no test infrastructure exists; discuss before touching

## Known Ambiguities

- `AuthResponse` has three possible token field names (`token` / `access_token` / `accessToken`) — API shape is in flux; use whichever is populated at runtime
- `auth.store.ts` persists token manually; all new stores should use Zustand `persist` middleware
- Route `/lcations/new` → `/locations/new` redirect in `App.tsx` — intentional short-term workaround
- `sonner` toast library installed alongside the custom `useToast` context — prefer custom `useToast` for consistency
