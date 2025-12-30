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

### 7. Centralized Constants

The app centralizes all routes, query parameters, and cache tags in dedicated constant files for consistency and maintainability.

#### Navigation Routes (`@/data/app-data.ts`)

**All application routes** must be defined in `appNavLinks`:

```typescript
export const appNavLinks = {
  home: { href: "/" },
  signIn: { href: "/sign-in" },
  // Add new routes here
} as const;
```

**Rules**:

- ✅ Use `appNavLinks.home.href` instead of hardcoded `"/"`
- ✅ Only include **intentional navigation routes** (not error pages)
- ❌ Never hardcode route strings - always use `appNavLinks`

#### Query Parameters (`@/lib/query-params.ts`)

**All URL search params** must be defined in `QUERY_PARAMS`:

```typescript
export const QUERY_PARAMS = {
  selectedUserId: "selected",
  addGoal: "addGoal",
} as const;
```

**Usage**:

```typescript
// ✅ Correct
searchParams[QUERY_PARAMS.selectedUserId];

// ❌ Avoid
searchParams["selected"];
```

#### Cache Tags (`@/lib/cache-tags.ts`)

**All Next.js cache tags** must be defined in `CACHE_TAGS`:

```typescript
export const CACHE_TAGS = {
  users: "users",
  weeks: "weeks",
  currentWeek: "current-week",
} as const;
```

**Usage**:

```typescript
// ✅ Correct
cacheTag(CACHE_TAGS.users);
revalidateTag(CACHE_TAGS.users);

// ❌ Avoid
cacheTag("users");
```

**Benefits**:

- Type safety and autocomplete
- Easy refactoring (change once, updates everywhere)
- No typos in string literals
- Centralized source of truth

### 8. Feature-Based Structure

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

### 9. Server Components First

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

**Event handler naming**: Follow React conventions for naming event handlers and callback props:

- **Callback props** (passed to components): Use `on` prefix (e.g., `onClick`, `onSubmit`, `onChange`, `onTryAgain`)
- **Handler functions** (defined locally): Use `handle` prefix (e.g., `handleClick`, `handleSubmit`, `handleChange`)

```typescript
// ✅ Correct naming
const MyComponent = () => {
  const handleClick = () => {
    console.log("clicked");
  };

  const handleSubmit = (data: FormData) => {
    // submit logic
  };

  return (
    <div>
      <Button onClick={handleClick} />
      <Form onSubmit={handleSubmit} />
    </div>
  );
};

// Child component receives callback props with 'on' prefix
const Form = ({ onSubmit }: FormProps) => {
  return <form action={onSubmit}>...</form>;
};

interface FormProps {
  onSubmit: (data: FormData) => void;
}
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

**NEVER use viewport height utilities (`h-screen`, `min-h-screen`, `max-h-screen`)**: These create poor UX on many devices (especially mobile with dynamic address bars). Use alternative layout strategies:

```tsx
// ❌ Avoid viewport height utilities
<div className="min-h-screen">...</div>
<main className="h-screen">...</main>

// ✅ Use flexbox or natural flow
<div className="flex flex-col">...</div>
<main className="flex-1">...</main>
```

### Single Source of Truth for CSS

**`html` and `body` elements MUST be styled exclusively in `globals.css`**. Never add Tailwind classes to these elements in `layout.tsx` (except for font CSS variables needed for Tailwind):

```tsx
// ❌ Avoid adding styling classes to body
<body className="bg-background antialiased">
  {children}
</body>

// ✅ Only font variables (needed for Tailwind config)
<body className={`${roboto.variable} ${robotoMono.variable}`}>
  {children}
</body>

// ✅ All body/html styling goes in globals.css
@layer base {
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

**For other components**: Use Tailwind utilities directly. Only use `globals.css` for true global styles (resets, base element styling, CSS variables).

### Shared Styles Configuration

For styles that need to be shared across components (whether as `className` strings or style object properties), use `@/styles/common-style.ts`:

```typescript
// @/styles/common-style.ts
export const globalMaxWidth = "800px";
export const dashboardMaxWidth = "500px";

// Usage in components
import { globalMaxWidth } from "@/styles/common-style";

// As Tailwind className
<div className="w-full" style={{ maxWidth: globalMaxWidth }}>

// Or in style object
const containerStyle = {
  maxWidth: globalMaxWidth,
  padding: "1rem",
};
```

**When to use `common-style.ts`**:

- Values that need to be consistent across multiple components
- Values used in both Tailwind classes and style objects
- Complex calculated values or theme-dependent values

## Git Workflow

### Branch Strategy

**Always work on the `development` branch** for active development:

- `main`: Production-ready code, stable releases
- `development`: Active development branch (default working branch)

**CRITICAL RULES**:

- All new features, fixes, and changes should be made on `development`
- Only merge to `main` when code is tested and production-ready
- Both branches are protected by continuous integration checks
- Push to both branches is allowed (CI runs on all pushes and pull requests)

### Continuous Integration

The project uses GitHub Actions for automated quality checks on all pushes and pull requests:

- **ESLint**: Code linting
- **Prettier**: Code formatting validation
- **TypeScript**: Type checking
- **Next.js Build**: Build validation

Workflow configuration: `.github/workflows/continuous-integration.yml`

All checks must pass before merging code.

#### GitHub Secrets Setup

The CI workflow requires the following **Repository Secrets** to be configured in your GitHub repository settings (`Settings > Secrets and variables > Actions > Repository secrets`):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Note**: Use Repository Secrets (not Environment secrets) since the CI runs on all branches. These secrets are only needed for the build step to compile successfully.

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

### Local Development (`.env.local`)

Required for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Optional in development
```

### Production Deployment

**CRITICAL**: When deploying to production (Vercel, Netlify, etc.), you MUST set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com  # REQUIRED in production
```

**Why `NEXT_PUBLIC_SITE_URL` is required in production:**

- **Magic Link Authentication**: Supabase sends email links that redirect to this URL after authentication
- **SEO & Metadata**: Used for Open Graph tags, canonical URLs, and social media previews

**Without it in production**, magic links will redirect to `http://localhost:3000/auth/callback` instead of your actual production URL, causing authentication to fail.

### Deployment Platform Setup Examples

**Vercel:**
1. Go to `Project Settings > Environment Variables`
2. Add all three variables
3. Select "Production" (and optionally "Preview")
4. Redeploy

**Netlify:**
1. Go to `Site Settings > Environment Variables`
2. Add all three variables
3. Redeploy

## Troubleshooting

### Magic Link Redirects to localhost in Production

**Symptom**: After clicking the magic link email in production, you're redirected to `http://localhost:3000/auth/error`

**Cause**: `NEXT_PUBLIC_SITE_URL` is not set in your production environment variables

**Solution**:
1. Add `NEXT_PUBLIC_SITE_URL` to your deployment platform's environment variables (see above)
2. Set it to your production URL (e.g., `https://habit-duo.vercel.app`)
3. Redeploy your application
4. Request a new magic link (old links will still use the wrong URL)

## Testing

Currently no test suite. When adding tests:

- Use the same data transformation patterns
- Mock Supabase clients separately for browser/server contexts
- Test server actions independently of components
