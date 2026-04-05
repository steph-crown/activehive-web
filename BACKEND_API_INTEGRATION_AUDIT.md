# Activehive Gym Web — remaining API work

Forward-looking only: what is still needed so the app can be **fully** integrated end-to-end. Pages with no remaining backend gaps are not listed.

---

### Dashboard (`/dashboard`)

**APIs to be updated**

- **`GET /dashboard/documents`** (or whatever the UI calls today for the “documents” feed): align the real route and response with the admin/gym-owner contract (likely under `/api/...`), and ensure errors are handled explicitly instead of silently falling back to bundled JSON in production builds.

**APIs to be provided**

- **Analytics: weekly attendance (time series or breakdown)** — supply data to replace the hardcoded `WeeklyAttendanceChart` (currently static Recharts data).
- **Analytics: membership mix (distribution by plan tier / duration)** — supply data to replace the hardcoded `MembershipMixChart` (currently static pie data).
- Optionally **fold** the above into **`GET /api/gym-owner/analytics/dashboard`** if you prefer one payload expansion rather than separate chart endpoints.

---

### Gym profile (`/dashboard/gym-profile`)

**APIs to be provided**

- **`GET` gym-level profile/settings** — return canonical gym branding and contact fields (name, description, registration number, email, phone, website, socials, logo/cover URLs) so the UI does not depend on inferring gym data from unrelated resources (e.g. from check-in list previews).
- **`PATCH` (or `PUT`) gym-level profile/settings** — persist the form; replaces the current save path that does not call the backend.

---

### Member details (`/dashboard/members/:id`)

**APIs to be provided**

- **Member activity log** — paginated list for the activity tab so the UI can stop merging demo rows when the API returns empty.
- **Member attendance history** — same for the attendance tab.
- **Member payments / billing history** — same for the payments tab.
- **Member documents / files** — same for the documents tab (upload/list/delete as product requires).

**APIs to be updated**

- **`GET /api/gym-owner/members/:id` (or equivalent detail)** — if the backend can already return these collections, extend the detail DTO to include them (or stable linked IDs) so the frontend can remove `withMemberDetailDemoData` and demo fallbacks entirely.

---

### Location operating hours (`/dashboard/locations/:id/operating-hours`)

**APIs to be provided**

- **`GET` hours for a location** — load the persisted weekly schedule (open/close per day).
- **`PATCH` hours for a location** — save edits from the UI (replaces local-only state in the page today).

---

### Class attendance (`/dashboard/classes/attendance`)

**APIs to be provided**

- **`GET` attendance records** — list (with filters: location, class, member, date range) and pagination so the table is backed by real data instead of the static rows in the UI.

---

### Payments — transactions (`/dashboard/payments/transactions`)

**APIs to be provided**

- **`GET` transactions** — list with filters (member, location, status, date range) and pagination; amounts and currency fields aligned with how the UI displays money.

---

### Payments — invoices (`/dashboard/payments/invoices`)

**APIs to be provided**

- **`GET` invoices** — list/detail as needed for the table and any future drill-down.

---

### Payments — refunds (`/dashboard/payments/refunds`)

**APIs to be provided**

- **`GET` refunds** — list with status and linkage to original transaction/invoice where applicable.

---

### Marketing — promo codes (`/dashboard/marketing/promo-codes`)

**APIs to be provided**

- **Promo codes CRUD + list** — create/update/archive codes, usage counts, validity window, scope (e.g. location), unless this domain is intentionally merged with membership-plan promos (then document one canonical API surface).

---

### Marketing — email campaigns (`/dashboard/marketing/email-campaigns`)

**APIs to be provided**

- **Email campaigns CRUD + list** — persist drafts/sent campaigns, audience selection, and metrics (recipients, opens) so the UI is not using local-only arrays and toast-only “create”.

---

### Marketing — SMS campaigns (`/dashboard/marketing/sms-campaigns`)

**APIs to be provided**

- **SMS campaigns CRUD + list** — same pattern as email for SMS-specific constraints (segments, compliance fields as required).

---

### Global / scalability (optional but recommended)

**APIs to be updated**

- **Existing list endpoints** used by large tables (members, subscriptions, classes, check-ins, etc.) — add **server-side** `page`, `limit`, `sort`, and filter query parameters where lists are currently fetched in full and paged only in the browser, so integration remains correct at scale.
