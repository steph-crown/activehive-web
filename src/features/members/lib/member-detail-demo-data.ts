import type {
  GymMemberDetail,
  MemberActivityLogEntry,
  MemberAttendanceEntry,
  MemberDocumentEntry,
  MemberPaymentEntry,
} from "../types";

/** Placeholder rows so empty API payloads still match design review layouts. */
const DEMO_ACTIVITY: MemberActivityLogEntry[] = [
  {
    id: "demo-act-1",
    title: "Signup completed",
    category: "Onboarding",
    actor: "Sarah Lee",
    date: "2026-03-17T12:00:00.000Z",
  },
  {
    id: "demo-act-2",
    title: "Gym created",
    category: "System",
    actor: "Admin",
    date: "2024-03-20T10:00:00.000Z",
  },
];

const DEMO_ATTENDANCE: MemberAttendanceEntry[] = [
  {
    id: "demo-att-1",
    date: "2026-03-16T00:00:00.000Z",
    checkIn: "6:15 AM",
    checkOut: "7:42 AM",
    processedBy: "Front desk",
    branch: "West Hollywood",
  },
  {
    id: "demo-att-2",
    date: "2026-03-14T00:00:00.000Z",
    checkIn: "5:50 PM",
    checkOut: "7:10 PM",
    processedBy: "Coach Sarah",
    branch: "West Hollywood",
  },
  {
    id: "demo-att-3",
    date: "2026-03-12T00:00:00.000Z",
    checkIn: "6:05 AM",
    checkOut: "—",
    processedBy: "Self check-in",
    branch: "West Hollywood",
  },
];

const DEMO_PAYMENTS: MemberPaymentEntry[] = [
  {
    id: "demo-pay-1",
    date: "2026-03-01T00:00:00.000Z",
    amount: "$49.00",
    method: "Card",
    status: "Paid",
    invoiceRef: "INV-240301-8841",
  },
  {
    id: "demo-pay-2",
    date: "2026-02-01T00:00:00.000Z",
    amount: "$49.00",
    method: "Card",
    status: "Paid",
    invoiceRef: "INV-240201-7720",
  },
  {
    id: "demo-pay-3",
    date: "2026-01-15T00:00:00.000Z",
    amount: "$49.00",
    method: "ACH",
    status: "Completed",
    invoiceRef: "INV-240115-5512",
  },
];

const DEMO_DOCUMENTS: MemberDocumentEntry[] = [
  {
    id: "demo-doc-1",
    label: "Liability waiver",
    uploaded: true,
  },
  {
    id: "demo-doc-2",
    label: "Government ID",
    uploaded: true,
  },
  {
    id: "demo-doc-3",
    label: "Medical clearance",
    uploaded: false,
  },
];

export function withMemberDetailDemoData(detail: GymMemberDetail): GymMemberDetail {
  const activityLog =
    detail.activityLog && detail.activityLog.length > 0
      ? detail.activityLog
      : DEMO_ACTIVITY;
  const attendance =
    detail.attendance && detail.attendance.length > 0
      ? detail.attendance
      : DEMO_ATTENDANCE;
  const payments =
    detail.payments && detail.payments.length > 0
      ? detail.payments
      : DEMO_PAYMENTS;
  const documents =
    detail.documents && detail.documents.length > 0
      ? detail.documents
      : DEMO_DOCUMENTS;

  return {
    ...detail,
    activityLog,
    attendance,
    payments,
    documents,
  };
}
