---
description: Scaffold a complete feature module (components, API service, React Query hooks, types) following the project's feature structure
argument-hint: feature-name [resource description e.g. "gym equipment with name and category"]
allowed-tools: Read, Write, Edit, Bash
---

Scaffold a new feature module for this project. The argument is: $ARGUMENTS

Parse the feature name (kebab-case) and resource description from the argument.

## Files to create

### 1. `src/features/<feature-name>/types/index.ts`
Define domain types. Follow the naming conventions:
- `*Payload` for request bodies
- `*Response` for API response shapes
- Domain type = PascalCase resource name

```ts
export interface FeatureResource {
  id: string;
  // fields inferred from the resource description
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureResourcePayload {
  // required create fields
}

export interface FeatureResourceResponse {
  data: FeatureResource;
}
```

### 2. `src/features/<feature-name>/services/api.ts`
Raw API calls using `apiClient` from `@/lib/api-client`. All routes are under `/api/gym-owner/`.

```ts
import { apiClient } from "@/lib/api-client";
import type { FeatureResource, CreateFeatureResourcePayload } from "../types";

export const featureNameApi = {
  list: (locationId?: string) =>
    apiClient.get<FeatureResource[]>("/api/gym-owner/<feature-name>s", {
      params: locationId ? { locationId } : undefined,
    }),
  getById: (id: string) =>
    apiClient.get<FeatureResource>(`/api/gym-owner/<feature-name>s/${id}`),
  create: (payload: CreateFeatureResourcePayload) =>
    apiClient.post<FeatureResource>("/api/gym-owner/<feature-name>s", payload),
  update: (id: string, payload: Partial<CreateFeatureResourcePayload>) =>
    apiClient.patch<FeatureResource>(`/api/gym-owner/<feature-name>s/${id}`, payload),
  delete: (id: string) =>
    apiClient.delete<void>(`/api/gym-owner/<feature-name>s/${id}`),
};
```

### 3. `src/features/<feature-name>/services/queries.ts`
React Query hooks + query key factory. Always define a `*QueryKeys` factory.

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { featureNameApi } from "./api";
import type { CreateFeatureResourcePayload } from "../types";

export const featureNameQueryKeys = {
  all: ["<feature-name>s"] as const,
  list: (locationId?: string) => [...featureNameQueryKeys.all, "list", locationId] as const,
  detail: (id: string) => [...featureNameQueryKeys.all, "detail", id] as const,
};

export const useFeatureNameQuery = (locationId?: string) =>
  useQuery({
    queryKey: featureNameQueryKeys.list(locationId),
    queryFn: () => featureNameApi.list(locationId),
  });

export const useFeatureNameByIdQuery = (id: string) =>
  useQuery({
    queryKey: featureNameQueryKeys.detail(id),
    queryFn: () => featureNameApi.getById(id),
    enabled: Boolean(id),
  });

export const useCreateFeatureNameMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeatureResourcePayload) => featureNameApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: featureNameQueryKeys.all }),
  });
};
```

### 4. `src/features/<feature-name>/components/<feature-name>-page.tsx`
List/overview page component. Use TanStack Query data; render with `<DataTable>` or a card grid.

```tsx
import { useFeatureNameQuery } from "../services/queries";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export function FeatureNamePage() {
  const toast = useToast();
  const { data, isLoading, error } = useFeatureNameQuery();

  if (error) toast.showError(getApiErrorMessage(error));

  return (
    <div>
      {/* page content */}
    </div>
  );
}
```

### 5. `src/features/<feature-name>/components/forms/create-<feature-name>-form.tsx`
Create form using react-hook-form + Yup + shadcn `<Form>` primitives.

```tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateFeatureNameMutation } from "../../services/queries";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

const schema = yup.object({
  // fields inferred from resource description
});

type FormValues = yup.InferType<typeof schema>;

interface CreateFeatureNameFormProps {
  onSuccess?: () => void;
}

export function CreateFeatureNameForm({ onSuccess }: CreateFeatureNameFormProps) {
  const toast = useToast();
  const { mutate, isPending } = useCreateFeatureNameMutation();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  function onSubmit(values: FormValues) {
    mutate(values, {
      onSuccess: () => {
        toast.showSuccess("<FeatureName> created successfully");
        onSuccess?.();
      },
      onError: (err) => toast.showError(getApiErrorMessage(err, "Failed to create <feature-name>")),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* FormField blocks for each field */}
        <Button type="submit" loading={isPending}>Create</Button>
      </form>
    </Form>
  );
}
```

## After creating all files
Print a summary listing every file path created. Do not create the route page — use `/new-page` for that.
