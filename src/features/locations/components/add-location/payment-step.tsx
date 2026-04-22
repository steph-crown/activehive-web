import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FormState } from "./types";

type PaymentStepProps = {
  paymentAccount: FormState["paymentAccount"];
  setPaymentField: <K extends keyof FormState["paymentAccount"]>(
    key: K,
    value: FormState["paymentAccount"][K],
  ) => void;
};

export function PaymentStep({
  paymentAccount,
  setPaymentField,
}: PaymentStepProps) {
  return (
    <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
      <h2 className="text-lg font-semibold">Payment Account</h2>

      <div className="grid gap-2">
        <Label>Account Name *</Label>
        <Input
          value={paymentAccount.accountName}
          onChange={(event) =>
            setPaymentField("accountName", event.target.value)
          }
          placeholder="Gym Location Account"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Account Number *</Label>
          <Input
            value={paymentAccount.accountNumber}
            onChange={(event) =>
              setPaymentField("accountNumber", event.target.value)
            }
            placeholder="1234567890"
          />
        </div>
        <div className="grid gap-2">
          <Label>Bank Code *</Label>
          <Input
            value={paymentAccount.bankCode}
            onChange={(event) =>
              setPaymentField("bankCode", event.target.value)
            }
            placeholder="011"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Bank Name *</Label>
        <Input
          value={paymentAccount.bankName}
          onChange={(event) => setPaymentField("bankName", event.target.value)}
          placeholder="First Bank"
        />
      </div>
    </div>
  );
}
