# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Habit Duo** is a Next.js 16 App Router application for competitive habit tracking between two users. Users create weekly goals, track daily completions, and compete for the highest score.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server on localhost:3000
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking (no emit)
pnpm prettier-check   # Check code formatting
pnpm prettier-write   # Auto-format code
```

## Architecture Patterns

### 1. Supabase Dual Client Pattern

The app uses **separate Supabase clients** for browser and server contexts:

- **Browser Client** (`@/lib/supabase/supabase-client`): For client components
- **Server Client** (`@/lib/supabase/supabase-server`): For server components and server actions

**Never** use the browser client in server components or vice versa.

### 2. Data Transformation Layer

The codebase maintains a strict separation between database types and application types:

- **Database types** (`@/types/database`): snake_case (matches Supabase schema)
- **App types** (`@/types/database-camel-case`): camelCase (JavaScript conventions)
- **Transformers** (`@/lib/supabase/transformers`): Convert between the two

All data fetched from Supabase is transformed to camelCase before use in components.

### 3. Query/Mutation Separation

Data access is split into two files:

- **`queries-read.ts`**: Read operations with Next.js 16 `"use cache"` directive
  - Uses `cacheLife()` to set cache duration (minutes/hours)
  - Uses `cacheTag()` for cache invalidation
  - All read queries return transformed camelCase data

- **`queries-mutations.ts`**: Write operations (NOT cached)
  - Always invalidate relevant cache tags after mutations
  - Use server actions to call mutations from components

### 4. Next.js 16 Caching Strategy

This project uses Next.js 16's new caching directives:

```typescript
export async function getUsers(): Promise<User[]> {
  "use cache"; // Enable caching
  cacheLife("hours"); // Cache for 1 hour
  cacheTag(CACHE_TAGS.users); // Tag for invalidation

  // ... fetch logic
}
```

**Cache tags** are defined in `@/lib/cache-tags.ts`. Invalidate caches using `revalidateTag()` after mutations.

### 5. Authentication Flow

Uses **Supabase Auth with magic links**:

1. User enters email → Server action sends magic link
2. User clicks link → Redirects to `/auth/callback`
3. Callback exchanges token → Creates session (cookie-based)
4. App looks up user by `auth_user_id` in `users` table

**Server actions** in `@/app/actions/auth.ts`:

- `signInWithEmail(email)`: Send magic link
- `signOut()`: Sign out and redirect
- `getUser()`: Get authenticated user (returns camelCase app user)

### 6. Path Aliases

All imports use path aliases defined in `tsconfig.json`:

```typescript
@/actions/*     → src/app/actions/*
@/components/*  → src/components/*
@/data/*        → src/data/*
@/features/*    → src/features/*
@/lib/*         → src/lib/*
@/types/*       → src/types/*
@/utils/*       → src/utils/*
```

**CRITICAL RULES**:
- **Always use these aliases** instead of relative imports
- **NEVER create new path aliases** without explicit user authorization
- If you need a new alias, ask the user first before modifying `tsconfig.json`

### 7. Feature-Based Structure

Components are organized by feature domain:

```
src/
├── app/                    # Next.js App Router (routes, server actions)
├── components/             # Shared/layout components
├── data/                   # App configuration and constants
├── features/               # Feature-specific components
│   ├── dashboard/          # Goal tracking, scoreboard, week header
│   └── sign-in/            # Authentication UI
├── lib/                    # Utilities and external service integrations
│   └── supabase/           # All Supabase logic (clients, queries, transformers)
├── styles/                 # Global styles and style utilities
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

When adding new features, create a new directory under `features/` with related components.

### 8. Server Components First

This project **heavily favors Server Components**:

- Most components are Server Components by default
- Client Components are marked with `"use client"` and typically suffixed with `-wrapper`
- Server actions handle form submissions (no client-side state management)
- Authentication checked server-side (no client hydration issues)

**Pattern**: Create a Server Component that fetches data, then render Client Component wrappers for interactivity:

```typescript
// Server Component (default)
export default async function Scoreboard({ weekId }) {
  const scores = await getWeeklyScores(weekId);
  return <ScoreboardClient scores={scores} />;
}

// Client Component (interactive)
"use client";
export function ScoreboardClient({ scores }) {
  // ... client-side interactivity
}
```

## Code Style Conventions

### TypeScript

**Prefer `interface` over `type`** for object shapes:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

// ❌ Avoid
type User = {
  id: string;
  name: string;
};
```

**Type definitions location**: Define types/interfaces directly under the function or component that uses them, with a blank line separator:

```typescript
export const Scoreboard = ({ weekId, scores }: ScoreboardProps) => {
  // ...
};

interface ScoreboardProps {
  weekId: string;
  scores: WeeklyScore[];
}
```

**Keep type definitions flat (one level deep)**: If a property is an object, extract it into a separate type/interface:

```typescript
// ❌ Avoid nested objects
interface User {
  id: string;
  profile: {
    name: string;
    email: string;
  };
}

// ✅ Extract nested objects
interface UserProfile {
  name: string;
  email: string;
}

interface User {
  id: string;
  profile: UserProfile;
}
```

### Functions and Components

**Always use arrow functions**, including for React components:

```typescript
// ✅ Components as arrow functions
export const Header = () => {
  return <header>...</header>;
};

// ✅ Regular functions as arrow functions
export const calculateScore = (points: number) => {
  return points * 2;
};
```

**Avoid default exports** unless required by the framework (Next.js page components):

```typescript
// ✅ Named exports (preferred)
export const Button = () => { ... };
export const Input = () => { ... };

// ✅ Default export (only for Next.js pages/layouts)
export default function Page() { ... }
```

**Component file structure**: When a file contains a main component with sub-components:

1. Main component (exported) comes first
2. Its interface/type comes immediately after with a blank line
3. Sub-components follow in the order they appear in the main component
4. Each sub-component's interface/type comes immediately after it with a blank line

```typescript
// ✅ Correct structure
export const SignInForm = ({ onSubmit, error }: SignInFormProps) => {
  return (
    <div>
      <Header />
      <Form onSubmit={onSubmit} />
      <Footer />
    </div>
  );
};

interface SignInFormProps {
  onSubmit: () => void;
  error: string | null;
}

const Header = () => {
  return <header>...</header>;
};

const Form = ({ onSubmit }: FormProps) => {
  return <form onSubmit={onSubmit}>...</form>;
};

interface FormProps {
  onSubmit: () => void;
}

const Footer = () => {
  return <footer>...</footer>;
};
```

### CSS and Tailwind

**Avoid margin utilities (`m-`, `mt-`, `mb-`, `ml-`, `mr-`)** for spacing. Instead, use flexbox with gap utilities on parent containers:

```tsx
// ❌ Avoid margins
<div>
  <h1 className="mb-4">Title</h1>
  <p className="mb-2">Paragraph</p>
</div>

// ✅ Use flex with gap on parent
<div className="flex flex-col gap-y-4">
  <h1>Title</h1>
  <p>Paragraph</p>
</div>
```

**Avoid space utilities (`space-x-*`, `space-y-*`)** for spacing. Instead, use flexbox with gap utilities:

```tsx
// ❌ Avoid space utilities
<form className="space-y-4">
  <div className="space-y-2">
    <Label>Email</Label>
    <Input />
  </div>
</form>

// ✅ Use flex with gap
<form className="flex flex-col gap-y-4">
  <div className="flex flex-col gap-y-2">
    <Label>Email</Label>
    <Input />
  </div>
</form>
```

**Always specify gap direction** (`gap-x-*` or `gap-y-*`) instead of using plain `gap-*`:

```tsx
// ❌ Avoid ambiguous gap
<div className="flex gap-4">...</div>

// ✅ Specify direction
<div className="flex flex-col gap-y-4">...</div>
<div className="flex flex-row gap-x-4">...</div>
```

## Database

Uses **Supabase Postgres** with migrations in `supabase/migrations/`:

- `001_initial_schema.sql`: Core tables (users, weeks, goals, completions, weekly_scores view)
- `002_add_auth.sql`: Supabase Auth integration

**Key database patterns**:

- All tables use UUID primary keys
- Row Level Security (RLS) enforces data access
- Users can modify their own goals/completions
- Both users can view each other's data (for competition)
- `weekly_scores` is a **database view** (not a table) that calculates points

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anonymous key
NEXT_PUBLIC_SITE_URL=              # App URL (for magic link redirects)
```

## Testing

Currently no test suite. When adding tests:

- Use the same data transformation patterns
- Mock Supabase clients separately for browser/server contexts
- Test server actions independently of components
