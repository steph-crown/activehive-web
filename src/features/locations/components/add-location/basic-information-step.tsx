import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FormState } from "./types";

type BasicInformationStepProps = {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export function BasicInformationStep({
  form,
  setField,
}: BasicInformationStepProps) {
  return (
    <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <div className="grid gap-2">
        <Label>Location Name *</Label>
        <Input
          value={form.locationName}
          onChange={(event) => setField("locationName", event.target.value)}
          placeholder="Downtown Branch"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Address *</Label>
          <Input
            value={form.address}
            onChange={(event) => setField("address", event.target.value)}
            placeholder="456 Oak Avenue"
          />
        </div>
        <div className="grid gap-2">
          <Label>City *</Label>
          <Input
            value={form.city}
            onChange={(event) => setField("city", event.target.value)}
            placeholder="Los Angeles"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label>State *</Label>
          <Input
            value={form.state}
            onChange={(event) => setField("state", event.target.value)}
            placeholder="CA"
          />
        </div>
        <div className="grid gap-2">
          <Label>Zip Code *</Label>
          <Input
            value={form.zipCode}
            onChange={(event) => setField("zipCode", event.target.value)}
            placeholder="90001"
          />
        </div>
        <div className="grid gap-2">
          <Label>Country *</Label>
          <Input
            value={form.country}
            onChange={(event) => setField("country", event.target.value)}
            placeholder="United States"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Phone *</Label>
          <Input
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            placeholder="+1 (555) 987-6543"
          />
        </div>
        <div className="grid gap-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="downtown@gym.com"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Cover Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setField("coverImage", event.target.files?.[0] || null)
          }
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="is-headquarters"
          checked={form.isHeadquarters}
          onCheckedChange={(checked) =>
            setField("isHeadquarters", Boolean(checked))
          }
        />
        <Label htmlFor="is-headquarters" className="leading-6">
          Set as Headquarters
        </Label>
      </div>
    </div>
  );
}
