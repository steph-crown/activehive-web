import type {
  GymMemberDetail,
  GymMemberDetailApiResponse,
  MemberAttendanceEntry,
} from "../types";

function daysRemainingFromEnd(iso: string): number {
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return 0;
  return Math.ceil((end - Date.now()) / 86_400_000);
}

function pickMembership(
  raw: GymMemberDetailApiResponse,
  routeParam: string,
): GymMemberDetailApiResponse["memberships"][number] | null {
  const list = raw.memberships ?? [];
  if (list.length === 0) return null;
  const bySubId = list.find((m) => m.id === routeParam);
  if (bySubId) return bySubId;
  if (raw.id === routeParam) return list[0] ?? null;
  return list[0] ?? null;
}

function mapCheckIns(
  checkIns: GymMemberDetailApiResponse["checkIns"],
): MemberAttendanceEntry[] {
  if (!checkIns?.length) return [];
  return checkIns.map((c, i) => {
    const any = c as Record<string, unknown>;
    const dateRaw =
      (any.date as string) ??
      (any.checkInDate as string) ??
      (any.createdAt as string) ??
      "";
    const checkIn =
      (any.checkIn as string) ??
      (any.checkInTime as string) ??
      (any.checkedInAt as string) ??
      "—";
    const checkOut =
      (any.checkOut as string) ??
      (any.checkOutTime as string) ??
      (any.checkedOutAt as string) ??
      "—";
    const processedBy =
      (any.processedBy as string) ??
      (any.staffName as string) ??
      (any.method as string) ??
      "—";
    const branch =
      (any.branch as string) ??
      (any.locationName as string) ??
      (any.location as string) ??
      "—";
    return {
      id: (any.id as string) ?? `checkin-${i}`,
      date: dateRaw,
      checkIn: String(checkIn),
      checkOut: String(checkOut),
      processedBy: String(processedBy),
      branch: String(branch),
    };
  });
}

/**
 * Maps GET /api/gym-owner/members/:id response into the shape used by the UI.
 * `routeParam` is the URL segment (member id or membership id from the list).
 */
export function normalizeGymMemberDetail(
  raw: GymMemberDetailApiResponse,
  routeParam: string,
): GymMemberDetail {
  const sub = pickMembership(raw, routeParam);
  const plan = sub?.membershipPlan;
  const loc = plan?.location;
  const locationId = loc?.id ?? plan?.locationId ?? "";
  const locationName = loc?.locationName ?? "—";

  const startDate = sub?.startDate ?? raw.createdAt;
  const endDate = sub?.endDate ?? raw.createdAt;
  const daysRemaining = daysRemainingFromEnd(endDate);

  return {
    id: sub?.id ?? raw.id,
    memberId: raw.id,
    member: {
      id: raw.id,
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      phoneNumber: raw.phoneNumber,
      dateOfBirth: raw.dateOfBirth,
      gender: raw.gender,
      fullNameOverride: raw.fullNameOverride,
      address: raw.address,
    },
    gymId: "",
    gym: undefined,
    membershipPlanId: sub?.membershipPlanId ?? plan?.id ?? "",
    membershipPlan: {
      id: plan?.id ?? sub?.membershipPlanId ?? "",
      name: plan?.name ?? "—",
      price: plan?.price,
      duration: plan?.duration,
    },
    location: {
      id: locationId || "—",
      locationName,
    },
    trainer: raw.trainer ?? null,
    assignedTrainerName: raw.assignedTrainerName,
    membershipIdDisplay: sub?.id,
    preferredWorkoutTime: raw.preferredWorkoutTime,
    type: sub?.type ?? "—",
    status: sub?.status ?? raw.status,
    price: sub?.price ?? plan?.price,
    startDate,
    endDate,
    memberSince: raw.createdAt,
    createdAt: sub?.createdAt ?? raw.createdAt,
    updatedAt: sub?.updatedAt ?? raw.updatedAt,
    daysRemaining,
    isExpiringSoon: daysRemaining >= 0 && daysRemaining <= 14,
    memberAccountStatus: raw.status,
    emergencyContact: raw.emergencyContact,
    health: raw.health,
    fitnessGoals: raw.fitnessGoals,
    compliance: raw.compliance,
    activityLog: raw.activityLog,
    attendance: mapCheckIns(raw.checkIns),
    payments: raw.payments,
    documents: raw.documents,
  };
}
