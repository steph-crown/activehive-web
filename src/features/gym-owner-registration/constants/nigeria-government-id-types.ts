export type GovernmentIdTypeOption = {
  readonly value: string;
  readonly label: string;
};

// Values are sent to the backend as strings (enum-like).
// Keep `label` user-facing and `value` backend-facing.
export const NIGERIA_GOVERNMENT_ID_TYPES: GovernmentIdTypeOption[] = [
  {
    value: "PASSPORT",
    label: "Passport",
  },
  {
    value: "DRIVERS_LICENSE",
    label: "Driver's License",
  },
  {
    value: "NIN",
    label: "National Identification Number (NIN)",
  },
  {
    value: "VOTERS_CARD",
    label: "Voter's Card",
  },
  {
    value: "BVN",
    label: "Bank Verification Number (BVN)",
  },
  {
    value: "RESIDENCE_PERMIT",
    label: "Residence Permit",
  },
];

export const NIGERIA_GOVERNMENT_ID_TYPE_VALUES =
  NIGERIA_GOVERNMENT_ID_TYPES.map((t) => t.value);

