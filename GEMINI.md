# Tender Track 360 Project Context

This document provides context for the Tender Track 360 project, a web application designed to streamline and optimize the government tender management process.

## Project Overview

Tender Track 360 is a full-stack application built with [Next.js](https://nextjs.org/) and [React](https://react.dev/). It uses [TypeScript](https://www.typescriptlang.org/) for type safety. The backend is powered by Next.js Server Actions, and it interacts with a [PostgreSQL](https://www.postgresql.org/) database via the [Drizzle ORM](https://orm.drizzle.team/). Authentication is handled by [Better Auth](https://www.betterauth.dev/).

The application is designed to digitize the entire tender lifecycle, from discovery to award, enabling organizations to efficiently track, respond to, and analyze public procurement opportunities.

## Package Manager

The project uses [pnpm](https://pnpm.io/) for package management. Always use `pnpm` for installing, removing, or updating dependencies.

- Install dependencies: `pnpm install`
- Add a dependency: `pnpm add <package-name>`
- Remove a dependency: `pnpm remove <package-name>`

## Key Commands

The following scripts are available in `package.json`:

-   **`pnpm dev`**: Starts the development server.
-   **`pnpm build`**: Creates a production-ready build of the application.
-   **`pnpm start`**: Starts the production server.
-   **`pnpm lint`**: Lints the codebase using ESLint.
-   **`pnpm test`**: Runs tests using Jest.
-   **`pnpm db:push`**: Pushes the Drizzle schema to the database.
-   **`pnpm db:generate`**: Generates Drizzle migration files.
-   **`pnpm db:migrate`**: Applies generated migrations to the database.
-   **`pnpm db:studio`**: Opens the Drizzle Studio to view and manage data.

## Development Conventions

-   **Styling**: The project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
-   **UI Components**: UI components are built using [Shadcn UI](https://ui.shadcn.com/).
-   **Code Formatting**: [Prettier](https://prettier.io/) is used for code formatting and is configured in `.prettierrc.json`.
-   **Linting**: [ESLint](https://eslint.org/) is used for linting and is configured in `eslint.config.mjs`.
-   **Path Aliases**: The project uses the `@/*` alias for the `src` directory (e.g., `import { db } from '@/db'`).

## Database

The database schema is defined in `src/db/schema.ts` and managed with Drizzle ORM. Use the `db:*` scripts to interact with the database schema and migrations. The Drizzle configuration is in `drizzle.config.ts`.
