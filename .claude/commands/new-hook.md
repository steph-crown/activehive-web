---
description: Scaffold a custom React hook following the conventions in src/hooks/
argument-hint: "hook-name [description of what it does]"
allowed-tools: Read, Write, Edit, Bash
---

Create a new custom React hook. The argument is: $ARGUMENTS

Parse:
- `hook-name`: the hook name in kebab-case (will become `useHookName` and `use-hook-name.ts`)
- description: what the hook does

## Placement rules
- App-wide / reusable hook → `src/hooks/use-<hook-name>.ts`
- Feature-specific hook → `src/features/<feature>/hooks/use-<hook-name>.ts`

Infer placement from the description. If unclear, default to `src/hooks/`.

## File template

```ts
// src/hooks/use-<hook-name>.ts

export function useHookName(/* params */) {
  // implementation

  return {
    // return shape
  };
}
```

## Patterns to follow (match existing hooks in src/hooks/)

### Context consumer hook (like useToast)
```ts
import { useContext } from "react";
import { SomeContext } from "@/providers/some-context";

export function useSomething() {
  const ctx = useContext(SomeContext);
  if (!ctx) throw new Error("useSomething must be used within SomeProvider");
  return ctx;
}
```

### State + side-effect hook (like useMobile)
```ts
import { useState, useEffect } from "react";

export function useHookName() {
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // setup
    return () => { /* cleanup */ };
  }, []);

  return state;
}
```

### Async/upload hook (like useUpload)
```ts
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

interface UseHookNameResult {
  data: Type | null;
  isLoading: boolean;
  error: string | null;
  execute: (input: InputType) => Promise<void>;
}

export function useHookName(): UseHookNameResult {
  const [data, setData] = useState<Type | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(input: InputType) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.post<Type>("/api/endpoint", input);
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed"));
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, execute };
}
```

## Rules
- Named export only (no default export)
- Return an object (not a tuple) unless the hook is a simple value getter
- Type all parameters and return values explicitly
- No comments explaining what the code does
- Use `@/` imports, never relative

After writing the file, print the file path and the hook's return type signature.
