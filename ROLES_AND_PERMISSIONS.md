# Activehive Gym Web — Suggested RBAC Permissions

This file is intended for the backend engineer who will seed/define the permission list used by the `/api/gym-owner/staff/roles/*` and `/api/gym-owner/staff/permissions/*` endpoints.

## Conventions

- Each permission has:
  - `code`: stable unique string (what you should store in the DB)
  - `name`: human readable label (what staff UIs show)
  - `description`: optional detail / examples
- Code naming convention: `<feature>.<action>`
- Feature names generally follow the sidebar “nav groups” (see `src/components/layout/nav-main-grouped.tsx`).
- Many screens have both “view” and “manage” actions. Split them so roles can be granular.

## Baseline (usually required for any logged-in staff)

- `dashboard.view` — View Dashboard overview and analytics
- `check-in.view` — View check-in list and stats
- `check-in.create` — Create a check-in (Quick Check-In / check-in actions)

> If you want to enforce RBAC on navigation itself, make “route access” depend on these permissions.

---

## Gym Management

Sidebar group: `Gym Management`

- `gym-management.view-gym-profile` — View Gym Profile
- `gym-management.edit-gym-profile` — Edit/Save Gym Profile (branding, contact info, logo/cover upload)
- `gym-management.view-operating-hours` — View Operating Hours
- `gym-management.edit-operating-hours` — Edit Operating Hours (open days/hours)

---

## Members

Sidebar group: `Members`

Core actions in `MembersPage` and member profile/edit flows:

- `members.view` — View Members list
- `members.create` — Add/Create a member
- `members.view-details` — View member profile/details page(s)
- `members.edit` — Edit member profile
- `members.suspend` — Suspend/disable a member

---

## Membership Plans

Sidebar group: `Membership Plans` (Plans)

Core actions in `membership-plans-page.tsx` and plan action modals:

- `membership-plans.view` — View membership plans list
- `membership-plans.create` — Create a membership plan
- `membership-plans.update` — Edit/update membership plan
- `membership-plans.delete` — Delete membership plan
- `membership-plans.duplicate` — Duplicate membership plan to another location
- `membership-plans.update-status` — Toggle/Update plan status (Active/Inactive)

Promo code actions (from `membership-plan-action-modals.tsx`):

- `membership-plans.promo-codes.manage` — Manage promo codes for a plan
- `membership-plans.promo-codes.add` — Add/create a promo code
- `membership-plans.promo-codes.remove` — Remove promo code from a plan
- `membership-plans.promo-codes.toggle-active` — Activate/deactivate a promo code

---

## Subscriptions

Sidebar group: `Membership Plans` (Subscriptions tab/page)

Core actions in `subscriptions-page.tsx` and subscription action modals:

- `subscriptions.view` — View subscriptions list
- `subscriptions.view-details` — View subscription details page(s)
- `subscriptions.update-status` — Update subscription status
- `subscriptions.cancel` — Cancel subscription (with reason)
- `subscriptions.change-plan` — Change subscription membership plan

---

## Trainers

Sidebar group: `Trainers` (All Trainers)

Core actions in `trainers-page.tsx`:

- `trainers.view` — View trainers list
- `trainers.create` — Create a trainer
- `trainers.assignments.view` — View trainer/member assignments

---

## Trainer Assignments

Sidebar group: `Trainers` (Trainer Assignments page)

Core action is creating assignments:

- `trainer-assignments.assign` — Assign a trainer to a member at a location (POST `/api/trainers/assignments`)

---

## Classes

Sidebar group: `Classes` (Class Schedule + Class Details entry points)

Core actions in `classes-tab.tsx` and class modals:

- `classes.view` — View class schedule list
- `classes.view-details` — View class details page
- `classes.create` — Create class
- `classes.edit` — Update/edit class
- `classes.delete` — Delete class
- `classes.assign-trainer` — Assign a trainer to a class
- `classes.reuse` — Reuse/duplicate a class to other locations
- `classes.report.view` — View class report/stats

Template support (class templates tab):

- `classes.templates.view` — View class templates list
- `classes.templates.create` — Create a class template
- `classes.templates.use` — Use/apply a class template to create classes

---

## Attendance

Sidebar group: `Classes` (Attendance)

The attendance UI is currently view-only:

- `classes.attendance.view` — View attendance records

---

## Payments

Sidebar group: `Payments` (Transactions / Invoices / Refunds pages)

Current pages are view-focused (no explicit “process” actions in the UI yet):

- `payments.view-transactions` — View transactions
- `payments.view-invoices` — View invoices
- `payments.view-refunds` — View refunds

---

## Marketing

Sidebar group: `Marketing`

The marketing pages are mostly UI/dummy right now, but permissions should still exist so RBAC can be enforced when backend endpoints are ready:

- `marketing.view` — View marketing pages
- `marketing.promo-codes.view` — View promo codes
- `marketing.promo-codes.create` — Create/manage promo codes
- `marketing.email-campaigns.view` — View email campaigns
- `marketing.email-campaigns.create` — Create/save a new email campaign
- `marketing.sms-campaigns.view` — View SMS campaigns
- `marketing.sms-campaigns.create` — Create/save a new SMS campaign

---

## Staff Management

Sidebar group: `Staff Management`

Core staff user management in `staff-page.tsx`:

- `staff.users.view` — View staff users list
- `staff.users.create` — Add/Create a staff user
- `staff.users.view-details` — View staff user details
- `staff.users.assign-permissions` — Assign roles and permissions to a staff user
- `staff.users.assign-locations` — Assign locations to a staff user

Roles and permissions admin pages:

- `staff.roles.manage` — Create/manage staff roles (roles page + create role modal)
- `staff.permissions.manage` — Create/manage staff permissions (permissions page + create permission modal)

---

## Locations

Sidebar group: `Locations`

Core actions in `locations-page.tsx` and location details:

- `locations.view` — View locations list
- `locations.create` — Add/Create location
- `locations.view-details` — View location details
- `locations.update-cover-image` — Update a location cover image

---

## Notes / Decisions (so the backend engineer can implement consistently)

- “View” permissions are split from “manage” permissions for each feature.
- Assign/reassign behavior is treated as the same permission for simplicity in the UI (example: `classes.assign-trainer` and trainer assignment creation endpoints).
- Some areas are currently UI placeholders (Marketing pages, Payments pages, some Gym/Operating-hours save calls). Permissions are still listed so RBAC can be enforced once backend endpoints are finalized.
