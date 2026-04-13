import type { Staff } from "../types";

export function staffFirstName(s: Staff): string {
  return s.user?.firstName?.trim() || s.firstName?.trim() || "";
}

export function staffLastName(s: Staff): string {
  return s.user?.lastName?.trim() || s.lastName?.trim() || "";
}

export function staffFullName(s: Staff): string {
  const n = `${staffFirstName(s)} ${staffLastName(s)}`.trim();
  return n || "—";
}

export function staffEmail(s: Staff): string {
  return s.user?.email?.trim() || s.email?.trim() || "";
}

export function staffPhone(s: Staff): string {
  const p = s.user?.phoneNumber ?? s.phone;
  return p?.trim() || "";
}

export function staffSearchBlob(s: Staff): string {
  return [
    staffFirstName(s),
    staffLastName(s),
    staffEmail(s),
    staffPhone(s),
    s.department,
    s.role?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function staffLocationIds(s: Staff): string[] {
  if (s.locationIds?.length) return s.locationIds;
  return s.locations?.map((l) => l.id) ?? [];
}

export function staffPermissionIds(s: Staff): string[] {
  if (s.permissionIds?.length) return s.permissionIds;
  return s.permissions?.map((p) => p.id) ?? [];
}
