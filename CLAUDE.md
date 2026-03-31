<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

# Job Tracker — Project Context

## Overview
Personal job application tracker. NX monorepo with Angular microfrontends + NestJS monolith + PostgreSQL + Google OAuth.

## Architecture

```
apps/
  api/        → NestJS monolith (port 3000)
  frontend/shell/  → Angular MF host (port 4200)
  frontend/auth/   → Microfrontend: Google login page (port 4201)
  frontend/jobs/   → Microfrontend: Jobs table + add/edit (port 4202)
libs/
  shared/types/   → Shared TypeScript interfaces (Job, User)
```

## Tech Stack
- **Monorepo**: NX 22
- **Frontend**: Angular 21, Module Federation (webpack)
- **Backend**: NestJS 11 (monolith)
- **Auth**: Google OAuth 2.0 via `passport-google-oauth20` → JWT in httpOnly cookie
- **Database**: PostgreSQL + TypeORM
- **Backend packages**: @nestjs/config, @nestjs/passport, @nestjs/jwt, @nestjs/typeorm, passport-google-oauth20, passport-jwt, cookie-parser, class-validator
- **Styles**: Angular Material

## Frontend App Structure Convention
Each MF app follows this directory layout inside `src/app/`:
```
src/app/
  remote-entry/        ← MF entry point only (entry.ts + entry.routes.ts)
  features/            ← feature components/pages (one folder per feature)
    <feature-name>/
      <name>.component.ts
      <name>.component.html
      <name>.component.scss
  components/          ← reusable presentational components
  services/            ← HTTP and business logic services
  models/              ← interfaces, types, enums
  guards/              ← route guards (shell only)
```

## Key Conventions
- **Styles**: always SCSS (`.scss`), never plain CSS
- Auth is **cookie-based JWT** (httpOnly) — never localStorage
- Backend is a **monolith** — no microservices
- Each MF app has its own `module-federation.config.ts` + `webpack.config.ts`
- Shell lazy-loads MF apps via Module Federation remote entries
- All DB entities use UUID primary keys
- Jobs are always scoped to the authenticated user (`userId` FK)
- Global styles use Angular Material theme via `styles.scss` with `@use '@angular/material'`
- Component styles use `styleUrl: './<name>.component.scss'`

## Dev Commands
```bash
# Start all apps
npm exec nx run-many -- --target=serve --all

# Start individual apps
npm exec nx serve api          # backend :3000
npm exec nx serve shell        # host :4200 (also starts remotes)
npm exec nx serve auth         # :4201
npm exec nx serve jobs         # :4202

# Generate
npm exec nx -- g @nx/angular:component
npm exec nx -- g @nx/nest:resource

# Build
npm exec nx build api
npm exec nx build shell
```

## Environment Variables
Copy `.env.example` to `.env` before running:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/jobtracker
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=...
FRONTEND_URL=http://localhost:4200
```

## Module Federation Ports
| App   | Port | Role        |
|-------|------|-------------|
| shell | 4200 | MF Host     |
| auth  | 4201 | MF Remote   |
| jobs  | 4202 | MF Remote   |
| api   | 3000 | Backend     |

## Backend API Routes
| Method | Path                  | Description           |
|--------|-----------------------|-----------------------|
| GET    | /auth/google          | Redirect to Google    |
| GET    | /auth/google/callback | OAuth callback + JWT  |
| GET    | /auth/me              | Current user          |
| POST   | /auth/logout          | Clear cookie          |
| GET    | /jobs                 | List user's jobs      |
| POST   | /jobs                 | Create job            |
| PATCH  | /jobs/:id             | Update job            |
| DELETE | /jobs/:id             | Delete job            |

## Job Status Enum
`applied` | `interview` | `offer` | `rejected`

## Database Schema
```sql
users: id (uuid), email, name, google_id, created_at
jobs:  id (uuid), user_id (fk), company, position, status, applied_at, link?, notes?, created_at
```
