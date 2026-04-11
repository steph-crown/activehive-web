import {
  formatDisplayDate,
  formatDisplayDateTime,
} from "@/lib/display-datetime";

export function formatBillingDate(dateString: string | null): string {
  if (!dateString) return "—";
  return formatDisplayDate(dateString);
}

export function formatBillingDateTime(dateString: string | null): string {
  if (!dateString) return "—";
  return formatDisplayDateTime(dateString);
}

export function formatMonthlyPriceNgn(amount: number | null): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
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
