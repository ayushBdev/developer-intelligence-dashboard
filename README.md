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

## 3. Architecture & Engineering Expectations (Assessment Checklist)

The application fulfills all engineering expectations defined in Section 7 & 8 of the assessment:

| Dimension | Implementation Details |
|---|---|
| **Component boundaries & responsibilities** | Feature-driven structure (`src/features/search`, `src/features/repo`, `src/features/compare`, `src/features/favorites`) keeping routing thin in `src/app/` and reusable dumb primitives in `src/components/`. |
| **Local state vs. shared state** | Ephemeral search text in controlled input; committed search/mode/page in URL state; server data in TanStack Query; client persistence (favorites/theme) in React Context + `localStorage`. |
| **Server/API state** | Managed via TanStack Query v5 with 5-minute `staleTime`, garbage collection, and query key factories. |
| **API/service abstraction** | Centralized in `src/api/client.ts` with typed error interceptor. UI components consume typed domain functions and never inspect raw Axios or fetch responses. |
| **Type-safe API models** | Zod schemas in `src/api/github/schemas.ts` parse and validate payloads at runtime with TypeScript types inferred via `z.infer`. |
| **Data transformation** | Normalization of snake_case API keys to camelCase domain models, PR filtering from issues, and mapping watchers to `subscribers_count`. |
| **Error strategy** | Unified `ApiError` taxonomy (`network`, `timeout`, `rate_limited`, `validation`, `not_found`, `server`) with reset time countdown and contextual retry policies. |
| **Routing & URL state** | `q`, `type`, `page`, `language`, and `minStars` drive the UI via `useSearchState` with in-place `router.replace` to prevent suspense flashes. |
| **Caching** | 5-minute query cache with deduplication; conditional `placeholderData` preserving previous data only during same-query pagination. |
| **Request cancellation** | TanStack Query automatically forwards `AbortSignal` to Axios; in-flight requests abort on rapid typing or mode switching. |
| **Search debouncing** | 400 ms typing debounce with immediate submit on Enter, suggestion click, or clear button. |
| **Race conditions** | Query keys include full parameter tuples `(type, q, page, language, minStars)`; older out-of-order network responses can never overwrite newer results. |
| **Pagination** | Accessible numbered window pagination (current ± 2) with Prev/Next buttons, respecting GitHub's 1,000-result cap. |
| **Testing boundaries** | Vitest + React Testing Library + MSW v2 network interception (mocking network responses, not internal modules). |
| **Performance** | Bounded page sizes (12 repos, 10 users), lazy per-card user enrichment, no unnecessary memoization, CSS-only hardware-accelerated blur. |

---

## 4. Optional Enhancements Implemented

All 10 optional enhancements from Section 11 of the technical assessment have been implemented:

| # | Enhancement | Implementation |
|---|---|---|
| 1 | **Repository favorites** | Save/remove repositories via bookmark icon; persists in `localStorage`; accessible modal with quick links and clear-all action. |
| 2 | **Dark / light mode** | Built-in ThemeProvider with persistence in `localStorage`; tailored glass tokens for both light and dark backgrounds. |
| 3 | **Repository comparison** | Select up to 2 repositories to compare side-by-side in a floating tray and comparison modal with metric winner highlights. |
| 4 | **Language & minimum-star filters** | Dropdown filters in the search bar feeding the query builder (`language:ts`, `stars:>=1000`) and preserved in URL state. |
| 5 | **Keyboard navigation** | Press `/` to focus the search bar from anywhere on the page; `Escape` to blur/clear; full keyboard accessibility on all cards and dialogs. |
| 6 | **URL-persisted search state** | Deep-linkable search state (`?q=react&type=repos&page=2&language=typescript`) supporting back/forward navigation. |
| 7 | **API caching** | 5-minute TanStack Query cache with smart stale-time and cache deduplication protecting GitHub's rate limits. |
| 8 | **Automated tests** | Comprehensive Vitest + MSW test suite covering 42 tests across 7 test files (100% passing). |
| 9 | **Improved accessibility** | WCAG AA compliant text contrast, semantic landmarks, radiogroup toggle semantics, `aria-live` announcements, and high-contrast visible focus rings. |
| 10 | **Additional useful public API integration** | Integrated GitHub **Contributors** (`GET /repos/{owner}/{repo}/contributors`) and **Languages Breakdown** (`GET /repos/{owner}/{repo}/languages`) with visual progress bars. |

---

## 5. Key Architectural Decisions (ADR)

| # | Decision | Alternatives Considered | Why Chosen | Key Trade-off |
|---|---|---|---|---|
| 1 | **TanStack Query for Server State** | `useEffect` + `useState`, SWR, Redux Toolkit | Built-in request deduplication, cache management, automatic `AbortSignal` forwarding, and conditional placeholder data. | Additional client runtime dependency (~13 kB gzipped). |
| 2 | **URL Parameters as Source of Truth** | Local React state, global Zustand store | Guarantees deep-linking, bookmarkability, and native back/forward history support without custom state syncing. | Requires parsing, sanitization, and `<Suspense>` boundaries in App Router. |
| 3 | **Typed ApiError Taxonomy with Interceptor** | Inline `try/catch` in UI components | Centralizes status code parsing, rate-limit header extraction (`x-ratelimit-reset`), and user-facing copy mapping in one location. | Slight upfront boilerplate in API layer. |
| 4 | **Lazy Per-Card User Enrichment** | Batch-fetching all cards upfront; omitting stats | Balances satisfying the PRD requirements with unauthenticated rate-limit constraints. Pages are kept compact (10 users). | Multiple concurrent HTTP requests on user search. |
| 5 | **Numbered Window Pagination** | Infinite scrolling | URL-addressable pages, clear milestone feedback, and accessibility for keyboard and screen-reader users. | Less continuous "social feed" feel. |
| 6 | **Next.js App Router for Layouts & Boundaries** | Vite SPA; Next.js with Server Actions | Provides file-based routing, nested layouts, and route-level error boundaries out of the box while running client-only fetching. | Requires explicit `"use client"` directives and Suspense boundaries. |
| 7 | **CSS Variables-Driven Glassmorphism** | External UI Kit (MUI, Mantine) | Full control over accessibility fallbacks (`prefers-reduced-transparency`, `forced-colors`), performance, and WCAG AA contrast. | Custom accessibility and styling logic written by hand. |

---

## 6. Assumptions and Trade-offs

- **Framework Choice**: Next.js App Router is used with client-side data fetching. This satisfies "React + TypeScript + modern frontend build tool" while delivering clean declarative routing and error boundaries.
- **GitHub Watchers**: GitHub's legacy `watchers_count` property is identical to `stargazers_count`. The application uses `subscribers_count` where available to display genuine repository watchers.
- **Pagination Boundary**: GitHub limits search queries to the first 1,000 items. The pagination component caps max pages accordingly and alerts the user when reaching the limit.
- **Image Strategy**: Plain `<img>` tags with explicit dimensions (`width`, `height`) and `loading="lazy"` are used to prevent layout shifts while avoiding remote image host restrictions.

---

## 7. Accessibility (A11y) Verification

- **Semantic Landmarks**: Semantic structure utilizing `<header>`, `<main>`, `<nav>`, `<article>`, `<aside>`, `<dialog>`, and `<footer>`.
- **Keyboard Navigation**: Complete flow (search input with `/` shortcut → mode toggle → cards → pagination → compare → favorites → back link) operable via keyboard.
- **Contrast**: Text contrast ratios meet or exceed WCAG AA standards (≥ 4.5:1 for body copy against the worst-case canvas backdrop).
- **Focus Rings**: High-contrast 2px focus rings (`focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`).
- **Reduced Motion & Transparency**:
  - `@media (prefers-reduced-motion)` halts shimmer animations and card transitions.
  - `@media (prefers-reduced-transparency)` falls back to solid opaque surfaces.
  - `@supports not (backdrop-filter)` provides an opaque tinted background.

---

## 8. AI Usage Disclosure

- **Tools Used**: Gemini coding assistant.
- **Tasks Delegated**: Generation of repetitive boilerplate (Zod schema specifications, Tailwind color mappings, and glassmorphic CSS rules).
- **Human Architectural Decisions**:
  - Decided on browser-only data fetching to safeguard unauthenticated IP rate limits.
  - Mandated PR filtering from issues endpoint payloads.
  - Chose URL parameter state synchronization over external state management libraries.
  - Designed the repository comparison and localStorage favorites architecture.
- **AI Suggestion Rejected**: The AI suggested using Server Actions or Next.js Route Handlers to proxy GitHub API requests. This was rejected because executing API requests from the server would aggregate all end-user traffic into a single IP address, immediately exhausting GitHub's 60 request/hour unauthenticated limit.
