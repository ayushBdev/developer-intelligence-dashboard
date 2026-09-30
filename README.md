# Developer Intelligence Dashboard

A production-quality web application to search GitHub repositories and developers, and drill into repository details and recent issues with a responsive Glassmorphism interface.

---

## 1. Overview

Developer Intelligence Dashboard provides real-time exploration of GitHub's public ecosystem. The application is built with React, TypeScript, Next.js (App Router), Tailwind CSS, and TanStack Query, emphasizing architectural correctness, resilience under GitHub API rate constraints, accessibility, and clean asynchronous behavior.

### Key Capabilities
- **Repository & User Search**: Switchable search modes with URL persistence (`?q=react&type=repos&page=1`), shareable links, and browser history support.
- **Asynchronous Reliability**: 400 ms debounce, automatic query deduplication, instant cancellation via `AbortSignal`, and stale-response protection.
- **Rich Repository Details**: Inspection of stars, forks, real watchers (via `subscribers_count`), branch, language, and recent issues.
- **Pull Request Filtering**: Strict distinction between issues and pull requests (PRs are filtered out from repository issues).
- **Graceful Error Taxonomy**: Dedicated handling for unauthenticated rate limits (with reset time countdown), network failures, 422 validations, 404 not found, and 5xx server issues.
- **Component Isolation**: Isolated error boundaries ensure issue failures never blank repository details.
- **Glassmorphism Design System**: Tailored frosted glass aesthetic adhering to WCAG AA contrast standards with solid fallback for environments with reduced transparency or unsupported `backdrop-filter`.

---

## 2. Setup and Run

The application runs directly out of the box with zero external configuration.

### Prerequisites
- Node.js `>= 18.17.0`
- npm `>= 9.0.0`

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run test suite
npm test

# 4. Build for production
npm run build

# 5. Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Configuration
GitHub unauthenticated search requests are rate-limited to ~10 requests/minute and 60 requests/hour per IP. To increase this limit during heavy local testing:
```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_GITHUB_TOKEN in .env.local
```
*(Note: Never commit real access tokens to source control).*

---

## 3. Architecture Overview

```
src/
    app/                         # Next.js App Router (routing & boundaries)
        layout.tsx               # Root layout, providers, global glass styles
        page.tsx                 # Search page wrapped in Suspense
        not-found.tsx            # Custom 404 handler
        repo/[owner]/[name]/     # Detail route
            page.tsx             # Detail page & dynamic metadata
            loading.tsx          # Route-level loading skeleton
            error.tsx            # Route-level error boundary
    api/                         # Browser-only GitHub API client & errors
        client.ts                # Axios instance with rate-limit interceptors
        errors.ts                # Typed ApiError taxonomy & user copy mapping
        github/
            schemas.ts           # Zod schemas (source of truth)
            repos.ts             # Repository search and detail endpoints
            users.ts             # User search and lazy enrichment endpoints
            issues.ts            # Issue endpoint with PR filtering
            query-keys.ts        # Query key factory
    types/                       # Domain data types
    features/
        search/                  # Search form, cards, list, pagination, filters
        repo/                    # Detail hero, stat tiles, issue list & rows
    components/                  # Shared accessible UI primitives (Glass, Button, etc.)
    hooks/                       # useDebouncedValue, useSearchState
    lib/                         # cn helper, dayjs configuration, formatters
    providers/                   # TanStack Query & Theme providers
```

### Architectural Rules
1. **Client-Side Data Fetching**: All GitHub API calls execute from the browser. In unauthenticated mode, server-side calls would funnel all users into a single server IP quota and exhaust GitHub rate limits rapidly. Browser-side fetching preserves per-user IP quotas and keeps request cancellation and debounce unified.
2. **URL as Single Source of Truth**: Committed query, search mode, page number, and filters reside in search params. Browser back/forward navigation and shared links reproduce the exact view.
3. **Domain Mapping Boundary**: Components never interact with raw GitHub API payloads or snake_case fields. Schemas validate responses at the API boundary and map them to clean camelCase domain entities.
4. **Resilient User Enrichment**: The GitHub user search API returns only minimal fields (`login`, `avatar_url`, `id`). Each user card lazily enriches follower and repo counts with isolated loading and error retry states.

---

## 4. Key Architectural Decisions (ADR)

| # | Decision | Alternatives Considered | Why Chosen | Key Trade-off |
|---|---|---|---|---|
| 1 | **TanStack Query for Server State** | `useEffect` + `useState`, SWR, Redux Toolkit | Built-in request deduplication, cache management, automatic `AbortSignal` forwarding, and `keepPreviousData` for seamless pagination. | Additional client runtime dependency (~13 kB gzipped). |
| 2 | **URL Parameters as Source of Truth** | Local React state, global Zustand store | Guarantees deep-linking, bookmarkability, and native back/forward history support without custom state syncing. | Requires parsing, sanitization, and `<Suspense>` boundaries in App Router. |
| 3 | **Typed ApiError Taxonomy with Interceptor** | Inline `try/catch` in UI components | Centralizes status code parsing, rate-limit header extraction (`x-ratelimit-reset`), and user-facing copy mapping in one location. | Slight upfront boilerplate in API layer. |
| 4 | **Lazy Per-Card User Enrichment** | Batch-fetching all cards upfront; omitting stats | Balances satisfying the PRD requirements with unauthenticated rate-limit constraints. Pages are kept compact (10 users). | Multiple concurrent HTTP requests on user search. |
| 5 | **Numbered Window Pagination** | Infinite scrolling | URL-addressable pages, clear milestone feedback, and accessibility for keyboard and screen-reader users. | Less continuous "social feed" feel. |
| 6 | **Next.js App Router for Layouts & Boundaries** | Vite SPA; Next.js with Server Actions | Provides file-based routing, nested layouts, and route-level error boundaries out of the box while running client-only fetching. | Requires explicit `"use client"` directives and Suspense boundaries. |
| 7 | **CSS Variables-Driven Glassmorphism** | External UI Kit (MUI, Mantine) | Full control over accessibility fallbacks (`prefers-reduced-transparency`, `forced-colors`), performance, and WCAG AA contrast. | Custom accessibility and styling logic written by hand. |

---

## 5. Assumptions and Trade-offs

- **Framework Choice**: Next.js App Router is used with client-side data fetching. This satisfies "React + TypeScript + modern frontend build tool" while delivering clean declarative routing and error boundaries.
- **GitHub Watchers**: GitHub's legacy `watchers_count` property is identical to `stargazers_count`. The application uses `subscribers_count` where available to display genuine repository watchers.
- **Pagination Boundary**: GitHub limits search queries to the first 1,000 items. The pagination component caps max pages accordingly and alerts the user when reaching the limit.
- **Image Strategy**: Plain `<img>` tags with explicit dimensions (`width`, `height`) and `loading="lazy"` are used to prevent layout shifts while avoiding remote image host restrictions.

---

## 6. Accessibility (A11y) Verification

- **Semantic Landmarks**: Semantic structure utilizing `<header>`, `<main>`, `<nav>`, `<article>`, and `<footer>`.
- **Keyboard Navigation**: Complete flow (search input → mode toggle → cards → pagination → back link → retry) is operable via keyboard.
- **Contrast**: Text contrast ratios meet or exceed WCAG AA standards (≥ 4.5:1 for body copy against the worst-case canvas backdrop).
- **Focus Rings**: High-contrast 2px focus rings (`focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`).
- **Reduced Motion & Transparency**:
  - `@media (prefers-reduced-motion)` halts shimmer animations and card transitions.
  - `@media (prefers-reduced-transparency)` falls back to solid opaque surfaces.
  - `@supports not (backdrop-filter)` provides an opaque tinted background.

---

## 7. AI Usage Disclosure

- **Tools Used**: Gemini coding assistant.
- **Tasks Delegated**: Generation of repetitive boilerplate (Zod schema specifications, Tailwind color mappings, and glassmorphic CSS rules).
- **Human Architectural Decisions**:
  - Decided on browser-only data fetching to safeguard unauthenticated IP rate limits.
  - Mandated PR filtering from issues endpoint payloads.
  - Chose URL parameter state synchronization over external state management libraries.
- **AI Suggestion Rejected**: The AI suggested using Server Actions or Next.js Route Handlers to proxy GitHub API requests. This was rejected because executing API requests from the server would aggregate all end-user traffic into a single IP address, immediately exhausting GitHub's 60 request/hour unauthenticated limit.

