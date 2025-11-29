import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePaymentAccountsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

type PaymentFormState = {
  locationIdentifier: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: "checking" | "savings" | "";
};

const createEmptyPayment = (): PaymentFormState => ({
  locationIdentifier: "",
  accountName: "",
  accountNumber: "",
  routingNumber: "",
  bankName: "",
  accountType: "",
});

export function PaymentsStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: submitPayments, isPending } =
    usePaymentAccountsStepMutation();
  const [accounts, setAccounts] = useState<PaymentFormState[]>([
    createEmptyPayment(),
  ]);

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const handleAccountChange = (
    index: number,
    field: keyof PaymentFormState,
    value: string
  ) => {
    // Restrict routing number to digits only and max 9 digits
    if (field === "routingNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 9) {
        value = digitsOnly;
      } else {
        return; // Don't update if exceeds 9 digits
      }
    }

    setAccounts((prev) =>
      prev.map((account, idx) =>
        idx === index ? { ...account, [field]: value } : account
      )
    );
  };

  const handleAddAccount = () => {
    setAccounts((prev) => [...prev, createEmptyPayment()]);
  };

  const handleRemoveAccount = (index: number) => {
    setAccounts((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.length === 0 ? [createEmptyPayment()] : updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      accounts.some((account) =>
        Object.values(account).some((value) => !value)
      )
    ) {
      showError("Error", "Please complete every field for each account.");
      return;
    }

    // Validate routing numbers are exactly 9 digits
    const invalidRoutingNumbers = accounts.filter(
      (account) => account.routingNumber.length !== 9
    );
    if (invalidRoutingNumbers.length > 0) {
      showError(
        "Error",
        "Routing number must be exactly 9 digits."
      );
      return;
    }

    try {
      await submitPayments({
        sessionId,
        paymentAccounts: accounts.map((account) => ({
          locationIdentifier: account.locationIdentifier,
          paymentAccount: {
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            routingNumber: account.routingNumber,
            bankName: account.bankName,
            accountType: account.accountType as "checking" | "savings",
          },
        })),
      });
      setStepStatus(5, "completed");
      showSuccess(
        "Payment accounts saved",
        "Almost there! Review everything on the final step."
      );
      navigate("/complete-setup");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save payment accounts.";
      showError("Error", message);
    }
  };

  const handleSkip = () => {
    setStepStatus(5, "skipped");
    navigate("/complete-setup");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Step 5 · Payment accounts</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Add payout details for each location so we know where to send your
          membership revenue.
        </p>
      </div>
      <div className="space-y-6">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="rounded-lg border border-border/60 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Account {index + 1}</p>
              {accounts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAccount(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-3">
              <Label>Location reference</Label>
              <Input
                value={account.locationIdentifier}
                onChange={(event) =>
                  handleAccountChange(
                    index,
                    "locationIdentifier",
                    event.target.value
                  )
                }
                placeholder="0"
                required
              />
              <p className="text-muted-foreground text-xs">
                Reference the location order or identifier from Step 4.
              </p>
            </div>
            <div className="grid gap-3">
              <Label>Account name</Label>
              <Input
                value={account.accountName}
                onChange={(event) =>
                  handleAccountChange(index, "accountName", event.target.value)
                }
                placeholder="Gym Account Name"
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-3">
                <Label>Account number</Label>
                <Input
                  value={account.accountNumber}
                  onChange={(event) =>
                    handleAccountChange(
                      index,
                      "accountNumber",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Routing number</Label>
                <Input
                  value={account.routingNumber}
                  onChange={(event) =>
                    handleAccountChange(
                      index,
                      "routingNumber",
                      event.target.value
                    )
                  }
                  placeholder="123456789"
                  maxLength={9}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Must be exactly 9 digits
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-3">
                <Label>Bank name</Label>
                <Input
                  value={account.bankName}
                  onChange={(event) =>
                    handleAccountChange(index, "bankName", event.target.value)
                  }
                  placeholder="Chase Bank"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Account type</Label>
                <Select
                  value={account.accountType}
                  onValueChange={(value: "checking" | "savings") =>
                    handleAccountChange(index, "accountType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddAccount}
        >
          Add another payment account
        </Button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving..." : "Save & continue"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </div>
    </form>
  );
}
