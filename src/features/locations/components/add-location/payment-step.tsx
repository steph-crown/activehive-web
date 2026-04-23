import {
  BankAccountFields,
  type BankAccountValue,
} from "@/features/payments/components/bank-account-fields";

type PaymentStepProps = {
  value: BankAccountValue;
  onChange: (next: BankAccountValue) => void;
};

export function PaymentStep({ value, onChange }: PaymentStepProps) {
  return (
    <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
      <h2 className="text-lg font-semibold">Payment Account</h2>
      <BankAccountFields value={value} onChange={onChange} />
    </div>
  );
}
