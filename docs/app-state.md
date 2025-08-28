# Tender Track 360 – Codebase Overview & App State

## 1. Project Purpose

Tender Track 360 is a full-stack web application for managing the government tender lifecycle. It digitizes the process from discovery to award, enabling organizations to track, respond to, and analyze public procurement opportunities. The platform is designed for multi-tenant use, supporting multiple organizations and role-based access.

## 2. Core Features

- **Authentication & Authorization:**
  - Email/password auth with verification, password reset, and session management (Better Auth)
  - Multi-tenant organizations with 4-tier role system (Admin, Tender Manager, Tender Specialist, Viewer)
  - Role-based route protection and server-side access control
- **Tender Management:**
  - (Planned) CRUD for tenders, status tracking, deadline management, and analytics
  - Document repository with versioning and secure uploads (UploadThing)
  - Automated notifications for deadlines and status changes
- **User Experience:**
  - Dashboard for status overview
  - Collaboration tools for team-based tender responses
  - Professional email communications (Resend)

## 3. Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Radix UI, shadcn/ui
- **Backend:** Next.js Server Actions, Drizzle ORM
- **Database:** PostgreSQL (local) / Neon (production) via Supabase
- **Authentication:** Better Auth
- **File Storage:** UploadThing
- **Email:** Resend
- **Dev Tools:** pnpm, ESLint, Prettier, Drizzle Kit
- **Deployment:** Vercel

## 4. Architecture & Structure

- **Layered Architecture:**
  - Presentation: Next.js React components (UI, forms, features)
  - Auth: Better Auth for user/org/session/role management
  - API: Next.js Server Actions for server logic
  - Business Logic: Service classes for tender operations
  - Data Access: Drizzle ORM (schema, migrations, queries)
  - File Storage: UploadThing
- **Project Structure:**
  - `src/app/`: App routes (auth, dashboard, API)
  - `src/components/`: UI, forms, feature components
  - `src/lib/`: Utilities (auth, db, validation)
  - `src/db/`: Drizzle schema, db connection
  - `emails/`: React email templates
  - `docs/`: Comprehensive documentation

## 5. App State (as of August 2025)

- **Authentication:** Complete, production-ready, with robust security and multi-tenancy
- **Database:** Core schemas (user, session, org, tender, etc.) and constraints in place
- **UI:** Component library ready; dashboard is a basic shell
- **Tender Management:** Core infrastructure ready, business features (CRUD, analytics) are next priorities
- **Notifications & Email:** Email system (Resend) integrated and working
- **File Uploads:** UploadThing configured
- **Testing & Quality:** Full TypeScript coverage, zero ESLint/type errors

## 6. Next Steps

- Build out tender management features (CRUD, dashboard, analytics)
- Enhance dashboard and user experience
- Add advanced features (search, reporting, mobile support)
- Integrate AI features (planned)

## 7. Summary

Tender Track 360 has a solid, modern foundation with enterprise-grade authentication, scalable architecture, and maintainable code. The focus now shifts to building out the core business features for tender management.
