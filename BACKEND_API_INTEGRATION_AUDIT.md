# Activehive Gym Web — backend API checklist

**List format (same content):** [`BACKEND_API_INTEGRATION_AUDIT_LIST.md`](./BACKEND_API_INTEGRATION_AUDIT_LIST.md)

Audience: **backend only.** Each table states what to **change on an existing API** or what **new API** to ship. No frontend implementation notes.

---

## Dashboard (`/dashboard`)

### APIs to be updated

| Endpoint | Method | Change to response body | Change to request (query / path) |
| -------- | ------ | ------------------------ | ---------------------------------- |
| `/api/gym-owner/analytics/dashboard` | GET | Add **`membershipMix`**: array of `{ `segmentLabel`: string, `memberCount`: number }` (counts by membership segment, e.g. weekly/monthly/quarterly/yearly — labels must match product). *(Weekly attendance is provided by **`GET /api/gym-owner/analytics/weekly-attendance`** — implemented in the app.)* | **Existing query params** (keep documented): **`locationId`** (optional), **`startDate`** (optional), **`endDate`** (optional). |

---

## Gym profile (`/dashboard/gym-profile`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/gym-profile` | Single gym object: **`gymName`**, **`businessRegistrationNumber`**, **`description`**, **`gymEmail`**, **`gymPhone`**, **`website`**, **`instagram`**, **`facebook`**, **`twitterX`**, **`logoUrl`**, **`coverImageUrl`** (all strings; nulls allowed where not set). |
| PATCH | `/api/gym-owner/gym-profile` | Same fields as PATCHable subset; partial updates allowed. Returns updated gym profile object. |

---

## Member details (`/dashboard/members/:id`)

### APIs to be updated

| Endpoint | Method | Change to response body | Change to request |
| -------- | ------ | ------------------------ | ----------------- |
| `/api/gym-owner/members/{memberId}` | GET | Must return real data for tabs (no empty arrays when DB has rows): **`activityLog`**: array of `{ `id`, `title`, `category`, `actor`, `date` }`. **`attendance`**: array of `{ `id`, `date`, `checkIn`, `checkOut`, `processedBy`, `branch` }`. **`payments`**: array of `{ `id`, `date`, `amount`, `method`, `status`, `invoiceRef?` }`. **`documents`**: array of `{ `id`, `label`, `uploaded`, `url?` }`. | — |

---

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/members/{memberId}/activity` | Paginated activity log (use if you prefer not to embed on detail `GET`). Query: **`page`**, **`limit`**. |
| GET | `/api/gym-owner/members/{memberId}/attendance` | Paginated attendance history. Query: **`page`**, **`limit`**, optional **`dateFrom`**, **`dateTo`**. |
| GET | `/api/gym-owner/members/{memberId}/payments` | Paginated payments. Query: **`page`**, **`limit`**. |
| GET | `/api/gym-owner/members/{memberId}/documents` | List documents. |
| POST | `/api/gym-owner/members/{memberId}/documents` | Upload metadata / presigned flow per your storage design. |
| DELETE | `/api/gym-owner/members/{memberId}/documents/{documentId}` | Remove a document if product allows. |

**Note:** If everything is embedded on **`GET /api/gym-owner/members/{memberId}`**, you do **not** need the separate `GET` routes above; the **update** row is the minimum.

---

## Location operating hours (`/dashboard/locations/:id/operating-hours`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/locations/{locationId}/operating-hours` | Weekly schedule: array of `{ `dayOfWeek` (0–6 or Mon–Sun), `isOpen` (boolean), `openingTime` (HH:mm), `closingTime` (HH:mm) }`. |
| PUT | `/api/gym-owner/locations/{locationId}/operating-hours` | Replaces full weekly schedule with the same body shape as `GET`. |

---

## Class attendance (`/dashboard/classes/attendance`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/class-attendance` (or `/api/classes/attendance` with gym-owner auth) | Paginated list. Each row: **`id`**, **`className`**, **`memberName`**, **`date`** (display or ISO), **`status`** (`present` \| `absent` \| `late`), **`locationName`**. Query: **`page`**, **`limit`**, optional **`locationId`**, **`classId`**, **`memberId`**, **`dateFrom`**, **`dateTo`**, **`status`**. |

---

## Payments — transactions (`/dashboard/payments/transactions`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/payments/transactions` | Paginated list. Query: **`page`**, **`limit`**, optional **`memberId`**, **`locationId`**, **`status`**, **`dateFrom`**, **`dateTo`**. Rows include transaction id, member, plan, amount, status, date, location. |

---

## Payments — invoices (`/dashboard/payments/invoices`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/payments/invoices` | Paginated list + filters as needed. |
| GET | `/api/gym-owner/payments/invoices/{invoiceId}` | Invoice detail (if/when UI adds drill-down). |

---

## Payments — refunds (`/dashboard/payments/refunds`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/payments/refunds` | Paginated list; link to transaction/invoice ids. |

---

## Marketing — promo codes (`/dashboard/marketing/promo-codes`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/marketing/promo-codes` | List promo codes. |
| POST | `/api/gym-owner/marketing/promo-codes` | Create. |
| PATCH | `/api/gym-owner/marketing/promo-codes/{promoCodeId}` | Update. |
| DELETE | `/api/gym-owner/marketing/promo-codes/{promoCodeId}` | Delete or archive. |

---

## Marketing — email campaigns (`/dashboard/marketing/email-campaigns`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/marketing/email-campaigns` | List campaigns. |
| POST | `/api/gym-owner/marketing/email-campaigns` | Create draft / send (per product). |
| PATCH | `/api/gym-owner/marketing/email-campaigns/{campaignId}` | Update. |

---

## Marketing — SMS campaigns (`/dashboard/marketing/sms-campaigns`)

### APIs to be provided

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/gym-owner/marketing/sms-campaigns` | List. |
| POST | `/api/gym-owner/marketing/sms-campaigns` | Create. |
| PATCH | `/api/gym-owner/marketing/sms-campaigns/{campaignId}` | Update. |

---

## Optional: list endpoints (scalability)

### APIs to be updated

| Endpoint | Method | Change to request | Change to response |
| -------- | ------ | ----------------- | ------------------ |
| `/api/gym-owner/subscriptions/members` | GET | **`page`**, **`limit`**, optional **`locationId`**, **`search`**, **`status`**. | Paginated: **`items`**, **`total`**, **`page`**, **`pageSize`**. |
| `/api/gym-owner/subscriptions` | GET | **`page`**, **`limit`**, filters as needed. | Paginated envelope. |
| `/api/classes` | GET | **`page`**, **`limit`**, optional **`locationId`**, **`trainerId`**, **`dateFrom`**, **`dateTo`**. | Paginated envelope. |
| `/api/trainers` | GET | **`page`**, **`limit`**, optional **`locationId`**. | Paginated envelope. |
| `/api/trainers/assignments` | GET | **`page`**, **`limit`**, optional **`locationId`**, **`trainerId`**, **`memberId`**. | Paginated envelope. |

---

## Audit scope

This checklist is the **backend contract** for **known** integration gaps in the gym app at audit time. Anything **not** listed is **out of scope** for this document. New screens or contract changes require a new pass.
