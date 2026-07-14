type MemberRef = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
} | null | undefined;

type LocationRef = {
  id?: string;
  locationName?: string | null;
} | null | undefined;

type MembershipPlanRef = {
  id?: string;
  name?: string | null;
  price?: number | null;
  duration?: string | null;
} | null | undefined;

type GymRef = {
  id?: string;
  name?: string | null;
} | null | undefined;

export type SubscriptionLike = {
  member?: MemberRef;
  membershipPlan?: MembershipPlanRef;
  location?: LocationRef;
  gym?: GymRef;
};

export function subscriptionMemberFullName(member: MemberRef): string {
  if (member == null) return "—";
  const name = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
  return name || member.email?.trim() || "—";
}

export function subscriptionMemberEmail(member: MemberRef): string {
  return member?.email?.trim() || "—";
}

export function subscriptionMemberPhone(member: MemberRef): string {
  return member?.phoneNumber?.trim() || "N/A";
}

export function subscriptionPlanName(plan: MembershipPlanRef): string {
  return plan?.name?.trim() || "—";
}

export function subscriptionLocationName(location: LocationRef): string {
  return location?.locationName?.trim() || "—";
}

export function subscriptionGymName(gym: GymRef): string {
  return gym?.name?.trim() || "—";
}

export function subscriptionSearchBlob(item: SubscriptionLike): string {
  return [
    subscriptionMemberFullName(item.member),
    item.member?.email,
    subscriptionPlanName(item.membershipPlan),
    subscriptionLocationName(item.location),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
