import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IconCircleCheckFilled,
  IconClock,
  IconFileText,
  IconQrcode,
  IconUpload,
} from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  formatDisplayDate,
  formatDisplayDateTime,
} from "@/lib/display-datetime";
import type {
  GymMemberDetail,
  MemberAttendanceEntry,
  MemberPaymentEntry,
} from "../types";

function dash(v: string | null | undefined): string {
  if (v == null) return "—";
  const s = String(v).trim();
  return s.length ? s : "—";
}

function toValidDate(value: string | undefined): Date | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s || s === "—") return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Visit row “Date” column — calendar date only. */
function formatAttendanceVisitDate(row: MemberAttendanceEntry): string {
  const primary = row.date?.trim() ? row.date : row.checkIn;
  const d = toValidDate(primary);
  if (!d) return "—";
  return formatDisplayDate(d);
}

/** Check-in / check-out: full localized date + time (no raw ISO). */
function formatAttendanceDateTime(value: string | undefined): string {
  if (value == null) return "—";
  const s = String(value).trim();
  if (!s || s === "—") return "—";
  const d = toValidDate(s);
  if (!d) return s;
  return formatDisplayDateTime(d);
}

function formatDob(iso: string | undefined): string {
  if (!iso) return "—";
  return formatDisplayDate(iso);
}

function fullName(m: GymMemberDetail["member"]): string {
  const o = m.fullNameOverride?.trim();
  if (o) return o;
  return `${m.firstName} ${m.lastName}`.trim() || "—";
}

function trainerLabel(d: GymMemberDetail): string {
  if (d.assignedTrainerName?.trim()) return d.assignedTrainerName.trim();
  const t = d.trainer;
  if (!t) return "—";
  if (t.fullName?.trim()) return t.fullName.trim();
  const n = `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim();
  return n || "—";
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-bebas text-xl tracking-wide text-foreground uppercase">
      {children}
    </h3>
  );
}

function ReadBox({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <div className="min-h-10 rounded-md border border-[#F4F4F4] bg-muted/50 px-3 py-2 text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}

function ReadArea({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <div className="min-h-[72px] rounded-md border border-[#F4F4F4] bg-muted/50 px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap">
        {value}
      </div>
    </div>
  );
}

function ComplianceRow({ label, value }: { label: string; value: string }) {
  const ok = value !== "—" && value.length > 0;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F4F4F4] py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        {ok && (
          <IconCircleCheckFilled
            className="size-4 shrink-0 text-emerald-600"
            aria-hidden
          />
        )}
        {value}
      </span>
    </div>
  );
}

function LegalTile({ label, value }: { label: string; value: string }) {
  const ok = value !== "—";
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#F4F4F4] bg-muted/40 px-3 py-3">
      <span className="text-sm font-medium">{label}</span>
      {ok ? (
        <IconCircleCheckFilled
          className="size-5 shrink-0 text-emerald-600"
          aria-hidden
        />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      )}
    </div>
  );
}

type PanelsProps = { detail: GymMemberDetail };

export function MemberDetailTabPanels({ detail }: PanelsProps) {
  const m = detail.member;
  const c = detail.compliance;
  const activityLog = detail.activityLog ?? [];
  const attendance = detail.attendance ?? [];
  const payments = detail.payments ?? [];
  const documents = detail.documents ?? [];
  const goals = detail.fitnessGoals ?? [];
  const health = detail.health;

  const membershipId = dash(detail.membershipIdDisplay);
  const preferredTime = dash(detail.preferredWorkoutTime);
  const memberSince = detail.memberSince
    ? formatDisplayDate(detail.memberSince)
    : formatDisplayDate(detail.startDate);

  const attendanceColumns = useMemo<ColumnDef<MemberAttendanceEntry>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatAttendanceVisitDate(row.original),
      },
      {
        accessorKey: "checkIn",
        header: "Check-in",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="size-4 shrink-0 text-muted-foreground" />
            <span className="tabular-nums">
              {formatAttendanceDateTime(row.original.checkIn)}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "checkOut",
        header: "Check-out",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatAttendanceDateTime(row.original.checkOut)}
          </span>
        ),
      },
      {
        accessorKey: "processedBy",
        header: "Processed by",
        cell: ({ row }) => row.original.processedBy,
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: ({ row }) => row.original.branch,
      },
    ],
    [],
  );

  const paymentColumns = useMemo<ColumnDef<MemberPaymentEntry>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDisplayDate(row.original.date),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.amount}</span>
        ),
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => row.original.method,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const paid =
            row.original.status.toLowerCase() === "paid" ||
            row.original.status.toLowerCase() === "completed";
          return (
            <Badge
              className={cn(
                paid &&
                  "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50",
              )}
              variant="outline"
            >
              {row.original.status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "invoiceRef",
        header: "Invoice",
        cell: ({ row }) =>
          row.original.invoiceRef ? (
            <a
              href="#"
              className="text-primary font-medium underline-offset-4 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              {row.original.invoiceRef}
            </a>
          ) : (
            "—"
          ),
      },
    ],
    [],
  );

  return (
    <>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>Quick info</SectionHeading>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["Membership ID", membershipId],
                  ["Branch", dash(detail.location?.locationName)],
                  ["Preferred time", preferredTime],
                  ["Trainer", trainerLabel(detail)],
                  ["Member since", memberSince],
                ] as const
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionHeading>Compliance</SectionHeading>
            <div className="mt-2">
              <ComplianceRow
                label="Terms & Conditions"
                value={
                  c?.termsAcceptedAt
                    ? formatDisplayDate(c.termsAcceptedAt)
                    : "—"
                }
              />
              <ComplianceRow
                label="Privacy Policy"
                value={
                  c?.privacyAcceptedAt
                    ? formatDisplayDate(c.privacyAcceptedAt)
                    : "—"
                }
              />
              <ComplianceRow
                label="Liability Waiver"
                value={dash(c?.liabilityWaiver)}
              />
              <ComplianceRow
                label="Media Consent"
                value={dash(c?.mediaConsent)}
              />
            </div>
          </Card>
        </div>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Activity log</SectionHeading>
          {activityLog.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
              No activity recorded yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#F4F4F4]">
              {activityLog.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{row.title}</p>
                    <p className="text-muted-foreground text-sm">
                      Performed by{" "}
                      <span className="font-medium">{row.actor}</span>
                    </p>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-sm sm:text-right">
                    {formatDisplayDate(row.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="gym-profile" className="mt-4 space-y-6">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Personal info</SectionHeading>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReadBox label="Full name (override)" value={fullName(m)} />
            <ReadBox label="Phone" value={dash(m.phoneNumber)} />
            <ReadBox label="Email" value={dash(m.email)} />
            <ReadBox label="Date of birth" value={formatDob(m.dateOfBirth)} />
          </div>
          <div className="mt-4">
            <ReadArea label="Address" value={dash(m.address)} />
          </div>
        </Card>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Emergency contact</SectionHeading>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <ReadBox
              label="Name *"
              value={dash(detail.emergencyContact?.name)}
            />
            <ReadBox
              label="Relationship *"
              value={dash(detail.emergencyContact?.relationship)}
            />
            <ReadBox
              label="Phone *"
              value={dash(detail.emergencyContact?.phone)}
            />
          </div>
        </Card>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Gym-specific data</SectionHeading>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReadBox label="Membership ID" value={membershipId} />
            <ReadBox label="Preferred workout time" value={preferredTime} />
            <ReadBox label="Assigned trainer" value={trainerLabel(detail)} />
            <ReadBox
              label="Assigned branch"
              value={dash(detail.location?.locationName)}
            />
          </div>
        </Card>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Legal & compliance</SectionHeading>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <LegalTile
              label="Terms & Conditions"
              value={
                c?.termsAcceptedAt
                  ? `Accepted - ${formatDisplayDate(c.termsAcceptedAt)}`
                  : "—"
              }
            />
            <LegalTile
              label="Privacy Policy"
              value={
                c?.privacyAcceptedAt
                  ? `Accepted - ${formatDisplayDate(c.privacyAcceptedAt)}`
                  : "—"
              }
            />
            <LegalTile
              label="Liability Waiver"
              value={dash(c?.liabilityWaiver)}
            />
            <LegalTile label="Media Consent" value={dash(c?.mediaConsent)} />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="health" className="mt-4 space-y-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Health information</SectionHeading>
          <div className="mt-4 space-y-4">
            <ReadArea
              label="Medical conditions"
              value={dash(health?.medicalConditions)}
            />
            <ReadArea label="Injuries" value={dash(health?.injuries)} />
            <ReadArea label="Allergies" value={dash(health?.allergies)} />
          </div>
        </Card>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Fitness goals</SectionHeading>
          {goals.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
              No goals recorded.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {goals.map((g) => (
                <span
                  key={g}
                  className="rounded-md bg-amber-50 px-3 py-1 text-sm font-medium text-amber-950"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="membership" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Membership details</SectionHeading>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ReadBox label="Plan" value={dash(detail.membershipPlan?.name)} />
            <ReadBox label="Status" value={dash(detail.status)} />
            <ReadBox label="Start date" value={formatDob(detail.startDate)} />
            <ReadBox label="End date" value={formatDob(detail.endDate)} />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="attendance" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading>Check-in history</SectionHeading>
            <Link
              to="/dashboard/check-in"
              className={cn(
                buttonVariants({
                  className:
                    "shrink-0 gap-2 bg-[#FFC107] text-black hover:bg-[#e6ae06]",
                }),
              )}
            >
              <IconQrcode className="size-4" />
              Manual check-in
            </Link>
          </div>
          {attendance.length === 0 ? (
            <p className="text-muted-foreground mt-6 text-sm">
              No check-ins recorded yet.
            </p>
          ) : (
            <div className="mt-6">
              <DataTable
                data={attendance}
                columns={attendanceColumns}
                enableDragAndDrop={false}
                enableRowSelection={false}
                enableColumnVisibility={false}
                enableTabs={false}
                defaultPageSize={50}
                getRowId={(row) => row.id}
                emptyMessage="No check-ins recorded yet."
              />
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="payments" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Payment history</SectionHeading>
          {payments.length === 0 ? (
            <p className="text-muted-foreground mt-6 text-sm">
              No payments recorded yet.
            </p>
          ) : (
            <div className="mt-6">
              <DataTable
                data={payments}
                columns={paymentColumns}
                enableDragAndDrop={false}
                enableRowSelection={false}
                enableColumnVisibility={false}
                enableTabs={false}
                defaultPageSize={50}
                getRowId={(row) => row.id}
                emptyMessage="No payments recorded yet."
              />
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionHeading>Member documents</SectionHeading>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Upload and manage member documents such as waivers, ID copies, and
            medical clearances.
          </p>
          {documents.length === 0 ? (
            <p className="text-muted-foreground mt-6 text-sm">
              No document slots configured for this member.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-[#F4F4F4] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IconFileText className="text-muted-foreground size-8 shrink-0" />
                    <span className="truncate text-sm font-medium">
                      {doc.label}
                    </span>
                  </div>
                  {doc.uploaded ? (
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-600">
                      <IconCircleCheckFilled className="size-4" />
                      Uploaded
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1"
                    >
                      <IconUpload className="size-4" />
                      Upload
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>
    </>
  );
}
