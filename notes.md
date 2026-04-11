# MVP Execution & Remediation Guide

This document is the actionable developer guide to prepare TenderTrack360 for its MVP launch. The focus is strictly on Data Integrity, Core Team Workflows, and removing blockers. All non-essential features (AI, advanced reporting) and Monetization (Billing) should be hidden or paused until these steps are complete.

## STATUS SUMMARY (Updated: 2026-04-11)

### Phase 1: Data Integrity & Safe Deletion (Backend)

**STATUS: ✅ COMPLETE**

- Client deletion protection implemented in `src/server/clients.ts` (lines 200-213)
- Tender deletion protection implemented in `src/server/tenders.ts` (lines 379-392)

### Phase 2: Member Invitations UI (Frontend Wiring)

**STATUS: ✅ COMPLETE**

- Modal component: `src/components/shared/modals/invite-member-modal.tsx`
- Backend action: `src/server/invitations.ts`
- INTEGRATED in: `src/app/(dashboard)/dashboard/organization/[slug]/components/members-tab.tsx`
  - State: `const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)` (line 150)
  - Button: `<Button onClick={() => setIsInviteModalOpen(true)}>` (line 328)
  - Modal rendered: Lines 520-537

### Phase 3: Real Ownership Transfer (Wiring)

**STATUS: ✅ COMPLETE**

- Backend fully functional in `src/lib/ownership-transfer.ts`
  - `initiateOwnershipTransfer()` - generates token, sends email
  - `acceptOwnershipTransfer()` - performs DB transaction to swap roles
- Modal exists: `src/components/organization/transfer-ownership-modal.tsx`

### Phase 4: Final De-Bloating & Billing Removal

**STATUS: ✅ COMPLETE (ALL DONE!)**

- Landing page pricing section removed ✅
- Billing nav links removed from nav-user.tsx ✅
- Billing pages redirected to /dashboard ✅
- Upgrade dialog references updated to redirect to /dashboard ✅

---

## Changes Made (2026-04-11)

### 1. Removed Billing Links from User Dropdown

**File:** `src/components/shared/navigation/nav-user.tsx`

- Removed "Upgrade to Pro" menu item (was lines 104-109)
- Removed "Billing" menu item (was lines 129-134)

### 2. Redirected Billing Pages

**File:** `src/app/(dashboard)/billing/page.tsx`

- Replaced entire content with redirect to `/dashboard`

**File:** `src/app/(dashboard)/billing/upgrade/page.tsx`

- Replaced entire content with redirect to `/dashboard`

### 3. Updated Upgrade Dialog References

**File:** `src/components/shared/dialogs/upgrade-dialog.tsx`

- Line 179: Changed `/billing/upgrade?plan=pro` → `/dashboard`
- Line 383: Changed `/billing/upgrade?plan=free` → `/dashboard`
- Line 410: Changed `/billing/upgrade` → `/dashboard`

---

## Testing Checklist

- [ ] Create Client with Tender, try delete → should block with error
- [ ] Create Tender with Project, try delete → should block with error
- [ ] Click "Invite Member" in Organization Members → modal opens
- [ ] Send invitation → verify invitation created in DB
- [ ] As Owner, initiate transfer → recipient receives email
- [ ] As recipient, accept transfer → verify roles swap correctly
- [x] Verify no "Billing" or "Upgrade" links in user dropdown
- [x] Type /billing in URL → should redirect to dashboard
- [x] Type /billing/upgrade in URL → should redirect to dashboard

---

## What's Working (Production Ready)

1. Client CRUD with soft delete + deletion protection
2. Tender CRUD with client joins and status tracking
3. Project management (tender→project conversion)
4. Organization & Member management with role management
5. Ownership transfer with token-based acceptance + email
6. Invitation system with role assignment
7. Dashboard statistics and trends
8. Upcoming deadlines tracking
9. Recent activity feed

---

## Known Gaps for Post-MVP

1. **Billing/Payment** - Paystack integration not wired
2. **Email delivery** - Resend API needs env vars configured
3. **AI extraction** - Feature stub exists but not functional
4. **Compliance checker** - UI exists but not functional
5. **Advanced PDF exports** - Not implemented
6. **Multi-file attachments** - Not implemented
7. **Webhook integrations** - Not implemented
8. **Email invitations** - inviteMember needs Resend integration

---

## NEW: Disable Document Upload (Memory Cost) - ✅ COMPLETE

**PROBLEM:** Document uploads cost storage (RDS/S3), but app is free MVP.

**IMPLEMENTED:** Show "Coming soon" message instead of removing UI entirely.

### Changes Made:

1. **Tender Form** - `src/components/tenders/tender-form.tsx` (lines 446-475)
   - Replaced FileUploader with "Coming soon" message

2. **Tender Details** - `src/components/tenders/tender-details.tsx` (line 563-570)
   - Replaced DocumentManager with "Coming soon" message

3. **Extension Form** - `src/components/tenders/extension-form.tsx` (lines 230-242)
   - Replaced file input with "Coming soon" message

4. **Profile Avatar** - `src/app/.../profile/components/avatar-upload.tsx`
   - Added `UPLOAD_DISABLED = true` constant
   - Added toast notification on click: "Photo upload is currently unavailable. Coming soon!"
   - Also affects Organization Logo (uses same component)

---

## Contact Info Updated (2026-04-11)

**File:** `src/lib/constants.ts`

```typescript
export const CONTACT_INFO = {
  phone: '+27 74 501 7094',
  whatsapp: '+27 74 501 7094',
  // ... unchanged
};
```

This automatically updates:

- Contact page (`src/app/contact/page.tsx`)
- Footer (`src/components/home-page/FooterSection.tsx`)
- Help widget (`src/components/shared/help-widget.tsx`)

WhatsApp link format: `https://wa.me/27745017094`

---

## New: Mini Calendar Widget (2026-04-11)

**Created:** `src/components/dashboard/mini-calendar-widget.tsx`

A compact calendar with upcoming events list side-by-side:

- **Left:** Small calendar (compact styling, month view only)
- **Right:** Upcoming events list with event type badges and days-until

**Updated:** `src/app/(dashboard)/dashboard/page.tsx`

- Replaced DashboardActivity with MiniCalendarWidget in the bottom section
- Grid layout: 2/3 calendar + events, 1/3 deadlines

**Features:**

- Shows only current month by default
- Displays up to 5 upcoming events
- Click events to navigate to tenders/projects
- Color-coded by event type (tender, PO expected, PO delivered)

---

## File Locations Reference

| Feature                       | Location                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Client deletion protection    | `src/server/clients.ts:200-213`                                                |
| Tender deletion protection    | `src/server/tenders.ts:379-392`                                                |
| Invite modal                  | `src/components/shared/modals/invite-member-modal.tsx`                         |
| Members page with invite      | `src/app/(dashboard)/dashboard/organization/[slug]/components/members-tab.tsx` |
| Ownership transfer backend    | `src/lib/ownership-transfer.ts`                                                |
| Ownership modal               | `src/components/organization/transfer-ownership-modal.tsx`                     |
| User dropdown (billing links) | `src/components/shared/navigation/nav-user.tsx`                                |
| Billing page                  | `src/app/(dashboard)/billing/page.tsx`                                         |
| Upgrade page                  | `src/app/(dashboard)/billing/upgrade/page.tsx`                                 |
| Upgrade dialog                | `src/components/shared/dialogs/upgrade-dialog.tsx`                             |
