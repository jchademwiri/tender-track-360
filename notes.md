# MVP Execution & Remediation Guide

This document is the actionable developer guide to prepare TenderTrack360 for its MVP launch. The focus is strictly on Data Integrity, Core Team Workflows, and removing blockers. All non-essential features (AI, advanced reporting) and Monetization (Billing) should be hidden or paused until these steps are complete.

## STATUS SUMMARY (Updated: 2026-04-11)

### Phase 1: Data Integrity & Safe Deletion (Backend)

**STATUS: ✅ COMPLETE**

- Client deletion protection implemented in `src/server/clients.ts` (lines 200-213)
- Tender deletion protection implemented in `src/server/tenders.ts` (lines 379-392)

### Phase 2: Member Invitations UI (Frontend Wiring)

**STATUS: ✅ COMPLETE (CORRECTED)**

The invite modal IS properly integrated in the actual page that uses it:

- Modal component: `src/components/shared/modals/invite-member-modal.tsx` ✅
- Backend action: `src/server/invitations.ts` ✅
- INTEGRATED in: `src/app/(dashboard)/dashboard/organization/[slug]/components/members-tab.tsx` ✅
  - State: `const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)` (line 150)
  - Button: `<Button onClick={() => setIsInviteModalOpen(true)}>` (line 328)
  - Modal rendered: Lines 520-537

Note: `src/components/organization-members-section.tsx` is NOT used in the current app - the actual implementation is in `members-tab.tsx`.

### Phase 3: Real Ownership Transfer (Wiring)

**STATUS: ✅ COMPLETE**

- Backend fully functional in `src/lib/ownership-transfer.ts`
  - `initiateOwnershipTransfer()` - generates token, sends email
  - `acceptOwnershipTransfer()` - performs DB transaction to swap roles
- Modal exists: `src/components/organization/transfer-ownership-modal.tsx`

### Phase 4: Final De-Bloating & Billing Removal

**STATUS: ❌ INCOMPLETE - Needs Work**

- Landing page pricing section removed ✅
- Billing nav links still present in nav-user.tsx ❌
- Billing pages NOT redirected ❌
- Other billing references exist in upgrade-dialog.tsx ❌

---

## Action Items for MVP Deploy

### 4.1 REMOVE Billing Navigation from User Dropdown

In `src/components/shared/navigation/nav-user.tsx`:

**REMOVE lines 104-109** (Upgrade to Pro):

```tsx
<DropdownMenuItem asChild>
  <Link href="/billing/upgrade" className="cursor-pointer">
    <Sparkles />
    Upgrade to Pro
  </Link>
</DropdownMenuItem>
```

**REMOVE lines 129-134** (Billing):

```tsx
<DropdownMenuItem asChild>
  <Link href="/billing" className="cursor-pointer">
    <CreditCard />
    Billing
  </Link>
</DropdownMenuItem>
```

### 4.2 REDIRECT Billing Routes

In `src/app/(dashboard)/billing/page.tsx`, REPLACE with redirect:

```tsx
import { redirect } from 'next/navigation';

export default function BillingPage() {
  redirect('/dashboard');
}
```

In `src/app/(dashboard)/billing/upgrade/page.tsx`, REPLACE with redirect:

```tsx
import { redirect } from 'next/navigation';

export default function UpgradePage() {
  redirect('/dashboard');
}
```

### 4.3 UPDATE Upgrade Dialog References

In `src/components/shared/dialogs/upgrade-dialog.tsx`:

Search for `/billing/upgrade` references and either:

- Remove the buttons, OR
- Change to redirect to `/dashboard`

---

## Testing Checklist

- [ ] Create Client with Tender, try delete → should block with error
- [ ] Create Tender with Project, try delete → should block with error
- [ ] Click "Invite Member" in Organization Members → modal opens
- [ ] Send invitation → verify invitation created in DB
- [ ] As Owner, initiate transfer → recipient receives email
- [ ] As recipient, accept transfer → verify roles swap correctly
- [ ] Verify no "Billing" or "Upgrade" links in user dropdown
- [ ] Type /billing in URL → should redirect to dashboard
- [ ] Type /billing/upgrade in URL → should redirect to dashboard

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
