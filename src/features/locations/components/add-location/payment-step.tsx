import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          placeholder="My Gym Account"
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
          <Label>Routing Number *</Label>
          <Input
            value={paymentAccount.routingNumber}
            onChange={(event) =>
              setPaymentField("routingNumber", event.target.value)
            }
            placeholder="123456789"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Bank Name *</Label>
          <Input
            value={paymentAccount.bankName}
            onChange={(event) => setPaymentField("bankName", event.target.value)}
            placeholder="Chase Bank"
          />
        </div>
        <div className="grid gap-2">
          <Label>Account Type *</Label>
          <Select
            value={paymentAccount.accountType}
            onValueChange={(value) =>
              setPaymentField("accountType", value as "checking" | "savings")
            }
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
