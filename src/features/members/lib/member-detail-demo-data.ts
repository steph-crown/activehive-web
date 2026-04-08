import type { GymMemberDetail } from "../types";

/**
 * Pass-through: member detail tabs use API data only (no placeholder rows).
 * Kept so call sites can stay on `withMemberDetailDemoData(detail)` if we ever
 * need dev-only fixtures again.
 */
export function withMemberDetailDemoData(detail: GymMemberDetail): GymMemberDetail {
  return detail;
}
