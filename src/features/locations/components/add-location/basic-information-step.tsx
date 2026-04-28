import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRIES, NIGERIA_STATES } from "./constants";
import type { FormState } from "./types";

type BasicInformationStepProps = {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export function BasicInformationStep({
  form,
  setField,
}: BasicInformationStepProps) {
  const isNigeria = form.country === "Nigeria";

  const handleCountryChange = (country: string) => {
    setField("country", country);
    setField("state", "");
  };

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

      <div className="grid gap-2">
        <Label>Street Address *</Label>
        <Input
          value={form.address}
          onChange={(event) => setField("address", event.target.value)}
          placeholder="456 Oak Avenue"
        />
      </div>

      <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Country *</Label>
          <Select value={form.country || undefined} onValueChange={handleCountryChange}>
            <SelectTrigger className="h-10 w-full shadow-xs">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>State *</Label>
          {isNigeria ? (
            <Select
              value={form.state || undefined}
              onValueChange={(value) => setField("state", value)}
            >
              <SelectTrigger className="h-10 w-full shadow-xs">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIA_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={form.state}
              onChange={(event) => setField("state", event.target.value)}
              placeholder="State / Province / Region"
            />
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>City *</Label>
        <Input
          value={form.city}
          onChange={(event) => setField("city", event.target.value)}
          placeholder="Lagos"
        />
      </div>

      <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Phone *</Label>
          <Input
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            placeholder="+234 801 234 5678"
          />
        </div>
        <div className="grid gap-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="branch@yourgym.com"
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
