# Habit Duo

## Skills

@../../\_config/claude/skills/nextjs-react/SKILL.md
@../../\_config/claude/skills/typescript/SKILL.md
@../../\_config/claude/skills/supabase/SKILL.md
@../../\_config/claude/skills/tailwind/SKILL.md

## Avant de coder

Avant d'implémenter une nouvelle fonction, un nouveau type ou un helper, grep le code existant pour vérifier qu'un équivalent n'existe pas déjà.

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

## Workflow `ncu` (mise à jour des dépendances)

Quand l'utilisateur demande un check/update des dépendances (`ncu`, "update deps"), suivre cette procédure sans la ré-expliquer :

1. **Check** : `npx npm-check-updates`.
2. **Apply all** : `npx npm-check-updates -u` puis `CI=true pnpm install --no-frozen-lockfile`. Le préfixe `CI=true` est obligatoire : sans TTY, pnpm 11 abandonne le purge de `node_modules` et fait échouer toutes les commandes suivantes.
3. **Verify** : rejouer exactement les étapes de la CI — `pnpm lint`, `pnpm type-check`, `pnpm prettier-check`, `pnpm test:run`, `pnpm build`.
4. **Si ça break** : identifier la ou les librairies fautives, les revert seules dans `package.json`, réinstaller, et **notifier l'utilisateur** (quoi a été skippé, avec l'erreur concrète).
5. **Commit** : `build: ncu -u (<libs-skippées> restent en <version> — <raison>)`.
6. **Push** : `development` → merge `main` (no-ff) → push `main` → retour sur `development`.

**Packages actuellement bloqués** :

- `eslint` reste en `^9` : eslint 10 casse `@typescript-eslint` (`Class extends value undefined is not a constructor or null`).
- `typescript` reste en `^6` : TS 7 casse `@typescript-eslint` (`Cannot read properties of undefined (reading 'Cjs')`) et `next build`.

`pnpm-workspace.yaml` est un artefact local de pnpm 11 (`allowBuilds` pour esbuild/sharp/unrs-resolver). Il n'est volontairement pas versionné : la CI tourne en pnpm 10 avec `--frozen-lockfile` et passe sans lui.

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
