[![Personal Website][personal-website-shield]][personal-website-url]
[![Mail][personal-email-shield]](mailto:cyrilo.dev@gmail.com)
[![LinkedIn][linkedin-shield]][linkedin-url]
[![MIT License][license-shield]][license-url]

<br/>

<p align="center">
  <img src="public/habit-duo-logo.svg" alt="Habit Duo logo" width="120" />
</p>

<h1 align="center">🎯 Habit Duo 🎯</h1>
<h3 align="center">Build habits together</h3>

<p align="center">
  Track your habits with a friend and compete for the highest weekly score.<br/>
  Habit Duo makes accountability fun through friendly competition.
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Screenshots](#screenshots)
- [Features](#features)
- [Built With](#built-with)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [License](#license)
- [Contact](#contact)

---

## About the Project

Habit Duo is a collaborative habit tracking application designed for **two users** who want to build better habits together. Set weekly goals, track daily completions, and compete with your friend for the highest score.

The app encourages consistency through:
- **Friendly competition** - See who completes more goals each week
- **Shared accountability** - Both users can view each other's progress
- **Simple goal setting** - Maximum 2 goals per week, up to 7 days each
- **Real-time updates** - Track completions as they happen

---

## Screenshots

> **Note:** Add screenshots here after running the app

### Dashboard
<!-- ![Dashboard](public/assets/README/dashboard.png) -->
*Coming soon - Main dashboard showing weekly goals and scoreboard*

### Sign In
<!-- ![Sign In](public/assets/README/sign-in.png) -->
*Coming soon - Magic link authentication flow*

### Goal Tracking
<!-- ![Goal Tracking](public/assets/README/goal-tracking.png) -->
*Coming soon - Daily completion tracking*

---

## Features

- 🏆 **Competitive Scoring** - Track points and compete with your habit partner
- 📊 **Weekly Goals** - Set up to 2 goals per week with flexible daily tracking
- ✅ **Daily Completions** - Mark goals complete each day with visual progress
- 👥 **Two-User System** - Built specifically for accountability pairs
- 🔐 **Magic Link Auth** - Passwordless authentication via email
- 🌓 **Dark/Light Theme** - Full theme support with system preference detection
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Real-time Updates** - Instant cache invalidation for live data
- 🎨 **Modern UI** - Clean design with shadcn/ui components

---

## Built With

### Frontend
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Icon system

### Backend
- [Supabase](https://supabase.com/) - PostgreSQL database + Auth
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Backend mutations
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/directives/use-cache) - Advanced caching

### Developer Tools
- [pnpm](https://pnpm.io/) - Package manager
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript](https://www.typescriptlang.org/) - Type checking

---

## Architecture

### Key Patterns

**Supabase Dual Client Pattern**
- Separate clients for browser and server contexts
- Server client for Server Components and actions
- Browser client for Client Components

**Data Transformation Layer**
- Database types in snake_case (Supabase schema)
- Application types in camelCase (JavaScript conventions)
- Transformers convert between formats

**Query/Mutation Separation**
- `queries-read.ts` - Cached read operations with `"use cache"`
- `queries-mutations.ts` - Write operations with cache invalidation

**Next.js 16 Caching**
- `cacheLife()` for duration control
- `cacheTag()` for selective invalidation
- Partial Prerender for optimal performance

**Feature-Based Structure**
```
src/
├── app/              # Next.js App Router (routes, pages)
├── components/       # Shared UI components
├── data/            # App constants and configuration
├── features/        # Feature-specific components
│   ├── auth/        # Authentication guards
│   ├── dashboard/   # Goal tracking, scoreboard
│   └── sign-in/     # Authentication UI
├── lib/             # External service integrations
│   └── supabase/    # Database queries and clients
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

For detailed architecture documentation, see [CLAUDE.md](CLAUDE.md).

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 9.x or higher
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Banaanas/habit-duo.git
cd habit-duo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up Supabase:

```bash
# Run migrations (if using Supabase CLI)
# See supabase/migrations/ for schema
```

4. Run the development server:

```bash
pnpm dev
```

5. Build for production:

```bash
pnpm build
pnpm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Development

### Available Commands

```bash
pnpm dev              # Start development server
pnpm build            # Create production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
pnpm prettier-check   # Check code formatting
pnpm prettier-write   # Auto-format code
```

### Code Style

- **TypeScript**: Prefer `interface` over `type` for object shapes
- **Functions**: Always use arrow functions
- **Exports**: Prefer named exports (except Next.js pages)
- **CSS**: Use flexbox with `gap-*` utilities instead of margins
- **Components**: Server Components first, Client Components when needed

See [CLAUDE.md](CLAUDE.md) for detailed conventions.

---

## Database

Uses **Supabase PostgreSQL** with:
- Row Level Security (RLS) for data access control
- UUID primary keys
- Database view for `weekly_scores` calculation
- Migrations in `supabase/migrations/`

**Key Tables:**
- `users` - User profiles
- `weeks` - Weekly tracking periods
- `goals` - User goals (max 2 per user per week)
- `completions` - Daily goal completions
- `weekly_scores` - Calculated points view

---

## License

Distributed under the MIT License. See <a href="./LICENSE">LICENSE</a> for details.

---

## Contact

[![Personal Website][personal-website-shield]][personal-website-url]
[![Mail][personal-email-shield]](mailto:cyrilo.dev@gmail.com)
[![LinkedIn][linkedin-shield]][linkedin-url]

---

[personal-website-shield]: https://img.shields.io/badge/-Cyrilo-f04328?style=flat&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMi4wMDEgNTEyLjAwMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyLjAwMSA1MTIuMDAxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PGc+PHBhdGggZD0iTTUwMy40MDIsMjI4Ljg4NUwyNzMuNjg0LDE5LjU2N2MtMTAuMDgzLTkuMTg5LTI1LjI4OC05LjE4OC0zNS4zNjctMC4wMDFMOC41OTgsMjI4Ljg4NmMtOC4wNzcsNy4zNi0xMC43NDUsMTguNy02Ljc5OSwyOC44ODljMy45NDcsMTAuMTg5LDEzLjU1NywxNi43NzIsMjQuNDg0LDE2Ljc3MmgzNi42OXYyMDkuNzIxYzAsOC4zMTUsNi43NDIsMTUuMDU3LDE1LjA1NywxNS4wNTdoMTI1LjkxNGM4LjMxNSwwLDE1LjA1Ny02Ljc0MSwxNS4wNTctMTUuMDU3VjM1Ni45MzJoNzQuMDAydjEyNy4zMzdjMCw4LjMxNSw2Ljc0MiwxNS4wNTcsMTUuMDU3LDE1LjA1N2gxMjUuOTA4YzguMzE1LDAsMTUuMDU3LTYuNzQxLDE1LjA1Ny0xNS4wNTdWMjc0LjU0N2gzNi42OTdjMTAuOTI2LDAsMjAuNTM3LTYuNTg0LDI0LjQ4NC0xNi43NzJDNTE0LjE0NywyNDcuNTg1LDUxMS40NzksMjM2LjI0Niw1MDMuNDAyLDIyOC44ODV6IiBmaWxsPSIjZjhmOGZmIi8+PC9nPjwvZz48Zz48Zz48cGF0aCBkPSJNNDQ1LjA5Miw0Mi43M0gzNDMuOTczbDExNi4xNzYsMTA1LjYzNnYtOTAuNThDNDYwLjE0OSw0OS40NzEsNDUzLjQwOCw0Mi43Myw0NDUuMDkyLDQyLjczeiIgZmlsbD0iI2Y4ZjhmZiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+
[personal-website-url]: https://cyrilo.dev
[personal-email-shield]: https://img.shields.io/badge/-Cyril-ffb6c1?style=flat&logo=Gmail
[linkedin-shield]: https://img.shields.io/badge/-Cyril-blue?style=flat&logo=linkedin&
[linkedin-url]: https://www.linkedin.com/in/cyril-dev/
[license-shield]: https://img.shields.io/badge/License-MIT-limegreen.svg
[license-url]: LICENSE
