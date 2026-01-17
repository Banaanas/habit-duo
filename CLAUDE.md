# Habit Duo

## Skills

@../../\_config/claude/skills/nextjs-react/SKILL.md
@../../\_config/claude/skills/typescript/SKILL.md
@../../\_config/claude/skills/supabase/SKILL.md
@../../\_config/claude/skills/tailwind/SKILL.md

## Project Overview

Habit Duo is a Next.js 16 App Router application for competitive habit tracking between two users. Users create weekly goals, track daily completions, and compete for the highest score.

## Commands

```bash
pnpm dev              # Start dev server on localhost:3000
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
pnpm prettier-check   # Check formatting
pnpm prettier-write   # Auto-format
```

## Architecture

### Supabase Dual Client Pattern

- **Browser**: `@/lib/supabase/supabase-client`
- **Server**: `@/lib/supabase/supabase-server`

Never mix them.

### Data Transformation Layer

- **Database types** (`@/types/database`): snake_case
- **App types** (`@/types/database-camel-case`): camelCase
- **Transformers** (`@/lib/supabase/transformers`): Convert between them

### Query/Mutation Separation

- **`queries-read.ts`**: Read operations with `"use cache"`, `cacheLife()`, `cacheTag()`
- **`queries-mutations.ts`**: Write operations, invalidate cache tags after mutations

### Authentication

Supabase Auth with magic links:

1. User enters email → Server action sends magic link
2. User clicks link → Redirects to `/auth/callback`
3. Callback exchanges token → Creates session
4. App looks up user by `auth_user_id` in `users` table

Server actions in `@/app/actions/auth.ts`: `signInWithEmail()`, `signOut()`, `getUser()`

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
