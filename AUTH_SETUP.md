# Supabase Auth Setup Instructions

The app now uses **Supabase Auth** (official `@supabase/ssr` package) instead of localStorage for user management. This provides better security, session management, and eliminates the need for complex useEffect hooks.

## What Changed

- **Before**: Users selected from a list, stored in localStorage
- **After**: Users sign in with email magic links via Supabase Auth (official implementation)

## Official Supabase Approach

This implementation follows the official Supabase SSR guide for Next.js App Router:

- Uses `@supabase/ssr` package
- Separate browser and server clients
- Proper cookie-based session management
- Server-side auth support

## Setup Steps

### 1. Run the Database Migration

Apply the new migration to your Supabase database:

```bash
# If using Supabase CLI locally
supabase db push

# Or apply the migration manually in Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/002_add_auth.sql
```

### 2. Link Existing Users to Auth

Each user needs to:

1. **Sign up** for the first time by visiting the app
2. Enter their email and click "Send magic link"
3. Check their email and click the magic link to authenticate

After they sign in, you'll need to link their auth account to their existing user record in the `users` table.

### 3. Connect Auth Users to App Users

After each user signs in for the first time, run this SQL in Supabase:

```sql
-- For Cyril (replace <cyril-auth-uid> with their actual auth.users.id)
UPDATE users
SET auth_user_id = '<cyril-auth-uid>'
WHERE name = 'Cyril';

-- For Andrea (replace <Andrea-auth-uid> with their actual auth.users.id)
UPDATE users
SET auth_user_id = '<Andrea-auth-uid>'
WHERE name = 'Andrea';
```

To find the auth UIDs, run:

```sql
SELECT id, email FROM auth.users;
```

### 4. Set Environment Variable

Add this to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

This is used for the magic link callback redirect.

### 5. Configure Email Provider (Optional)

By default, Supabase sends magic links using their email service. For production:

1. Go to **Authentication > Email Templates** in Supabase Dashboard
2. Customize the magic link email template
3. (Optional) Configure custom SMTP in **Authentication > Settings**

## How It Works

1. **Sign In Flow**:
   - User enters email
   - Supabase sends magic link
   - User clicks link → authenticated session created
   - App looks up user in `users` table by `auth_user_id`

2. **Session Management**:
   - Auth state managed by Supabase (cookies, tokens)
   - No localStorage or useEffect hydration issues
   - Session persists across page reloads

3. **Security**:
   - Row Level Security (RLS) policies enforce data access
   - Users can only modify their own goals and completions
   - Both users can view each other's data (for competition)

## File Structure

```
src/app/
├── actions/
│   └── auth.ts        # Server actions for auth (signIn, signOut, getUser)
└── auth/
    └── callback/
        └── route.ts   # Auth callback route for magic links

src/lib/api/
├── supabase.ts        # Browser client (client components)
├── supabase-server.ts # Server client (server components/actions)
└── queries.ts         # API queries with camelCase transformation

src/components/
├── sign-in.tsx        # Sign-in form (uses server actions)
└── home-content.tsx   # Server component (checks auth)

src/types/
├── index.ts           # App types (camelCase - JavaScript style)
└── database.ts        # Database types (snake_case - matches DB)
```

## Benefits

✅ Official Supabase SSR implementation (less maintenance)
✅ **Server Components** - Auth checked server-side (no client state)
✅ **Server Actions** - Form submissions without JavaScript
✅ No localStorage management
✅ No SSR/hydration issues
✅ Proper cookie-based authentication
✅ Server-side auth support
✅ More secure than client-side storage
✅ Built-in session expiry and refresh
✅ JavaScript naming conventions (camelCase)
✅ Minimal client-side JavaScript

## Troubleshooting

**Problem**: User signs in but sees "Loading..." forever
**Solution**: Check that `auth_user_id` is set in the `users` table (Step 3 above)

**Problem**: "Failed to send magic link"
**Solution**: Check Supabase Dashboard → Authentication → Settings → Email auth is enabled

**Problem**: User doesn't receive email
**Solution**: Check spam folder, or configure custom SMTP provider
