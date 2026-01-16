# Habit Duo

## Conventions

Before writing code, read: `/workspace/_config/claude/skills/nextjs-react-conventions.md`

## Project Overview

Habit Duo is a Next.js 16 App Router application for competitive habit tracking between two users. Users create weekly goals, track daily completions, and compete for the highest score.

## Commands

```bash
pnpm dev              # Start dev server on localhost:3000
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
pnpm prettier-check   # Check formatting
pnpm prettier-write   # Auto-format
```

## Architecture

### Supabase Dual Client Pattern

Separate clients for browser and server:

- **Browser**: `@/lib/supabase/supabase-client`
- **Server**: `@/lib/supabase/supabase-server`

Never mix them.

### Data Transformation Layer

- **Database types** (`@/types/database`): snake_case
- **App types** (`@/types/database-camel-case`): camelCase
- **Transformers** (`@/lib/supabase/transformers`): Convert between them

All data from Supabase is transformed to camelCase before use.

### Query/Mutation Separation

- **`queries-read.ts`**: Read operations with `"use cache"`, `cacheLife()`, `cacheTag()`
- **`queries-mutations.ts`**: Write operations, invalidate cache tags after mutations

### Next.js 16 Caching

```typescript
export async function getUsers(): Promise<User[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users);
  // ... fetch logic
}
```

Cache tags defined in `@/lib/cache-tags.ts`. Invalidate with `revalidateTag()`.

### Authentication

Supabase Auth with magic links:

1. User enters email → Server action sends magic link
2. User clicks link → Redirects to `/auth/callback`
3. Callback exchanges token → Creates session
4. App looks up user by `auth_user_id` in `users` table

Server actions in `@/app/actions/auth.ts`: `signInWithEmail()`, `signOut()`, `getUser()`

### Path Aliases

```typescript
@/actions/*     → src/app/actions/*
@/components/*  → src/components/*
@/data/*        → src/data/*
@/features/*    → src/features/*
@/lib/*         → src/lib/*
@/types/*       → src/types/*
@/utils/*       → src/utils/*
```

**Never create new aliases without explicit authorization.**

### Project Structure

```
src/
├── app/           # Routes, server actions
├── components/    # Shared/layout components
├── data/          # App configuration
├── features/      # Feature-specific components
├── lib/           # Utilities, Supabase logic
├── styles/        # Global styles
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Git Workflow

- `main`: Production-ready code
- `development`: Active development (default working branch)

All changes go to `development` first. CI runs on all pushes.

## Database

Supabase Postgres with migrations in `supabase/migrations/`:

- UUID primary keys
- Row Level Security (RLS)
- `weekly_scores` is a view (not table)

## Environment Variables

### Local (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Production

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://habitduo.vercel.app  # Required for magic links
```
