import * as React from "react"

import { Switch } from "@/components/ui/switch"

type CheckboxProps = Omit<
  React.ComponentProps<typeof Switch>,
  "checked" | "onCheckedChange"
> & {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
}

function Checkbox({ checked, onCheckedChange, ...props }: CheckboxProps) {
  const switchChecked =
    checked === "indeterminate" ? true : (checked ?? false)

  return (
    <Switch
      data-slot="checkbox"
      checked={switchChecked}
      onCheckedChange={(value: boolean) => onCheckedChange?.(value)}
      {...props}
    />
  )
}

export { Checkbox }
