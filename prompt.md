- in roles table, add an edit button that opens a dialog to edit the role. this is endpoint for role edit
  PATCH /api/gym-owner/staff/roles/{id}
  payload {
  "name": "Front Desk Staff",
  "description": "string",
  "permissionCodes": [
  "members.view",
  "check-in.create",
  "subscriptions.view"
  ]
  }

in /dashboard/members/:id page, check-ins tab, manual checkin button, on click, does a quick checkin for the member (same thing that happens when you click scan code icon on the members table), not redirect.
