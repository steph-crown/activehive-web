import {
  formatDisplayDate,
  formatDisplayDateTime,
} from "@/lib/display-datetime";
import { formatNgn } from "@/lib/format-ngn";

export function formatBillingDate(dateString: string | null): string {
  if (!dateString) return "—";
  return formatDisplayDate(dateString);
}

export function formatBillingDateTime(dateString: string | null): string {
  if (!dateString) return "—";
  return formatDisplayDateTime(dateString);
}

export function formatMonthlyPriceNgn(amount: string | number | null): string {
  if (amount == null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return "—";
  return formatNgn(num, { decimals: true });
}

export function getSubscriptionStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
      return "default";
    case "trial":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}
