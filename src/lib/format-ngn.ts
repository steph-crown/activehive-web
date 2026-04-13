/** Consistent Naira formatting for UI (both whole amounts and money strings from APIs). */

const ngnWhole = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ngnDecimals = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatNgn(
  amount: number,
  options?: { decimals?: boolean },
): string {
  return (options?.decimals ? ngnDecimals : ngnWhole).format(amount);
}

export function parseLooseMoneyToNumber(raw: string): number | null {
  let s = String(raw).trim();
  s = s.replace(/[$\u20A6£€]/g, "");
  s = s.replace(/[A-Za-z]/g, "");
  s = s.replace(/\s/g, "");
  s = s.replace(/,/g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/** Turn API / legacy strings ($1,234.50, plain numbers) into formatted NGN. */
export function formatMoneyDisplayAsNgn(
  input: string | number | null | undefined,
): string {
  if (input == null || input === "") return "—";
  if (typeof input === "number" && Number.isFinite(input)) {
    return formatNgn(input, { decimals: true });
  }
  const n = parseLooseMoneyToNumber(String(input));
  if (n != null) return formatNgn(n, { decimals: true });
  return String(input);
}
