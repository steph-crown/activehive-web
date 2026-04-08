# Activehive Gym Web — backend API checklist (list)

**Table format (same content):** [`BACKEND_API_INTEGRATION_AUDIT.md`](./BACKEND_API_INTEGRATION_AUDIT.md)

Same contract as the table version, in **nested lists** for easier reading. Audience: **backend only.**

---

## Dashboard (`/dashboard`)

### APIs to be updated

- **`GET /api/gym-owner/analytics/dashboard`**
  - **Response:** add **`weeklyAttendanceByDay`**: array of **7** objects `{ label, morning, afternoon, evening }` (strings/numbers as specified — one row per weekday in the analytics window). Add **`membershipMix`**: array of `{ segmentLabel, memberCount }` for membership segments (e.g. weekly/monthly/quarterly/yearly; labels must match product).
  - **Request:** keep existing query params documented: **`locationId`** (optional), **`startDate`** (optional), **`endDate`** (optional).

---

## Gym profile (`/dashboard/gym-profile`)

### APIs to be provided

- **`GET /api/gym-owner/gym-profile`**
  - Single object: **`gymName`**, **`businessRegistrationNumber`**, **`description`**, **`gymEmail`**, **`gymPhone`**, **`website`**, **`instagram`**, **`facebook`**, **`twitterX`**, **`logoUrl`**, **`coverImageUrl`** (strings; nulls where not set).

- **`PATCH /api/gym-owner/gym-profile`**
  - Partial update of the same fields; response returns updated profile.

---

## Member details (`/dashboard/members/:id`)

### APIs to be updated

- **`GET /api/gym-owner/members/{memberId}`**
  - **Response:** when data exists in DB, return non-empty arrays for tabs:
    - **`activityLog`**: `{ id, title, category, actor, date }[]`
    - **`attendance`**: `{ id, date, checkIn, checkOut, processedBy, branch }[]`
    - **`payments`**: `{ id, date, amount, method, status, invoiceRef? }[]`
    - **`documents`**: `{ id, label, uploaded, url? }[]`

---

### APIs to be provided

*(Skip these if everything is embedded on **`GET /api/gym-owner/members/{memberId}`** — the update above is the minimum.)*

- **`GET /api/gym-owner/members/{memberId}/activity`** — paginated activity. Query: **`page`**, **`limit`**.
- **`GET /api/gym-owner/members/{memberId}/attendance`** — paginated attendance. Query: **`page`**, **`limit`**, optional **`dateFrom`**, **`dateTo`**.
- **`GET /api/gym-owner/members/{memberId}/payments`** — paginated payments. Query: **`page`**, **`limit`**.
- **`GET /api/gym-owner/members/{memberId}/documents`** — list documents.
- **`POST /api/gym-owner/members/{memberId}/documents`** — upload metadata / presigned flow per storage design.
- **`DELETE /api/gym-owner/members/{memberId}/documents/{documentId}`** — remove document if product allows.

---

## Location operating hours (`/dashboard/locations/:id/operating-hours`)

### APIs to be provided

- **`GET /api/gym-owner/locations/{locationId}/operating-hours`**
  - Weekly schedule: `{ dayOfWeek, isOpen, openingTime, closingTime }[]` (`dayOfWeek` 0–6 or Mon–Sun per your convention; times `HH:mm`).

- **`PUT /api/gym-owner/locations/{locationId}/operating-hours`**
  - Replaces full weekly schedule; same body shape as `GET`.

---

## Class attendance (`/dashboard/classes/attendance`)

### APIs to be provided

- **`GET /api/gym-owner/class-attendance`** *(or **`GET /api/classes/attendance`** with gym-owner auth — pick one canonical path)*  
  - Paginated rows: **`id`**, **`className`**, **`memberName`**, **`date`**, **`status`** (`present` | `absent` | `late`), **`locationName`**.  
  - Query: **`page`**, **`limit`**, optional **`locationId`**, **`classId`**, **`memberId`**, **`dateFrom`**, **`dateTo`**, **`status`**.

---

## Payments — transactions (`/dashboard/payments/transactions`)

### APIs to be provided

- **`GET /api/gym-owner/payments/transactions`**
  - Paginated list. Query: **`page`**, **`limit`**, optional **`memberId`**, **`locationId`**, **`status`**, **`dateFrom`**, **`dateTo`**. Rows: transaction id, member, plan, amount, status, date, location.

---

## Payments — invoices (`/dashboard/payments/invoices`)

### APIs to be provided

- **`GET /api/gym-owner/payments/invoices`** — paginated list + filters as needed.
- **`GET /api/gym-owner/payments/invoices/{invoiceId}`** — detail (when UI adds drill-down).

---

## Payments — refunds (`/dashboard/payments/refunds`)

### APIs to be provided

- **`GET /api/gym-owner/payments/refunds`** — paginated list; include links to transaction/invoice ids.

---

## Marketing — promo codes (`/dashboard/marketing/promo-codes`)

### APIs to be provided

- **`GET /api/gym-owner/marketing/promo-codes`** — list.
- **`POST /api/gym-owner/marketing/promo-codes`** — create.
- **`PATCH /api/gym-owner/marketing/promo-codes/{promoCodeId}`** — update.
- **`DELETE /api/gym-owner/marketing/promo-codes/{promoCodeId}`** — delete or archive.

---

## Marketing — email campaigns (`/dashboard/marketing/email-campaigns`)

### APIs to be provided

- **`GET /api/gym-owner/marketing/email-campaigns`** — list.
- **`POST /api/gym-owner/marketing/email-campaigns`** — create draft / send (per product).
- **`PATCH /api/gym-owner/marketing/email-campaigns/{campaignId}`** — update.

---

## Marketing — SMS campaigns (`/dashboard/marketing/sms-campaigns`)

### APIs to be provided

- **`GET /api/gym-owner/marketing/sms-campaigns`** — list.
- **`POST /api/gym-owner/marketing/sms-campaigns`** — create.
- **`PATCH /api/gym-owner/marketing/sms-campaigns/{campaignId}`** — update.

---

## Optional: list endpoints (scalability)

### APIs to be updated

- **`GET /api/gym-owner/subscriptions/members`** — query: **`page`**, **`limit`**, optional **`locationId`**, **`search`**, **`status`**. Response: **`items`**, **`total`**, **`page`**, **`pageSize`**.
- **`GET /api/gym-owner/subscriptions`** — pagination + filters; paginated envelope.
- **`GET /api/classes`** — **`page`**, **`limit`**, optional **`locationId`**, **`trainerId`**, **`dateFrom`**, **`dateTo`**; paginated envelope.
- **`GET /api/trainers`** — **`page`**, **`limit`**, optional **`locationId`**; paginated envelope.
- **`GET /api/trainers/assignments`** — **`page`**, **`limit`**, optional **`locationId`**, **`trainerId`**, **`memberId`**; paginated envelope.

---

## Audit scope

This checklist is the **backend contract** for **known** integration gaps in the gym app at audit time. Anything **not** listed is **out of scope** for this document. New screens or contract changes require a new pass.
