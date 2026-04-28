import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { cn } from "@/lib/utils";
import { paymentsApi, useBanksQuery } from "../services";

export type BankAccountValue = {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
};

type BankAccountFieldsProps = {
  value: BankAccountValue;
  onChange: (next: BankAccountValue) => void;
  disabled?: boolean;
};

export function BankAccountFields({
  value,
  onChange,
  disabled = false,
}: BankAccountFieldsProps) {
  const { data: banks = [], isLoading: banksLoading } = useBanksQuery();
  const [bankSearch, setBankSearch] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const filteredBanks = useMemo(() => {
    const q = bankSearch.toLowerCase();
    if (!q) return banks;
    return banks.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.includes(q),
    );
  }, [banks, bankSearch]);

  useEffect(() => {
    const accountNumber = value.accountNumber.trim();
    const bankCode = value.bankCode.trim();

    setResolveError("");

    if (accountNumber.length < 10 || !bankCode) return;

    const capturedAccountNumber = accountNumber;
    const capturedBankCode = bankCode;
    const capturedBankName = value.bankName;

    const timer = setTimeout(async () => {
      setIsResolving(true);
      try {
        const result = await paymentsApi.resolveAccount(
          capturedAccountNumber,
          capturedBankCode,
        );
        onChangeRef.current({
          accountNumber: capturedAccountNumber,
          bankCode: capturedBankCode,
          bankName: capturedBankName,
          accountName: result.account_name,
        });
      } catch (err) {
        setResolveError(getApiErrorMessage(err, "Could not resolve account."));
      } finally {
        setIsResolving(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.accountNumber, value.bankCode]);

  return (
    <div className="grid gap-4">
      <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Bank *</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={disabled || banksLoading}
                className={cn(
                  "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                  !value.bankName && "text-muted-foreground",
                )}
              >
                <span className="truncate">
                  {banksLoading
                    ? "Loading banks…"
                    : value.bankName || "Select bank"}
                </span>
                <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="p-0"
              style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
            >
              <div className="border-b p-2">
                <Input
                  autoFocus
                  placeholder="Search banks…"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <DropdownMenuItem
                      key={bank.id}
                      onSelect={() => {
                        onChange({
                          ...value,
                          bankCode: bank.code,
                          bankName: bank.name,
                          accountName: "",
                        });
                        setBankSearch("");
                      }}
                    >
                      {bank.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <p className="text-muted-foreground px-2 py-3 text-center text-sm">
                    No banks found
                  </p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-2">
          <Label>Account Number *</Label>
          <Input
            value={value.accountNumber}
            onChange={(e) =>
              onChange({
                ...value,
                accountNumber: e.target.value,
                accountName: "",
              })
            }
            placeholder="1234567890"
            disabled={disabled}
          />
          {resolveError && (
            <p className="text-destructive text-sm">{resolveError}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Account Name</Label>
        <Input
          value={isResolving ? "Resolving…" : value.accountName}
          disabled
          placeholder="Auto-filled after account lookup"
          className={cn(isResolving && "text-muted-foreground italic")}
        />
      </div>
    </div>
  );
}
