# Developer Intelligence Dashboard

A production-quality web application to search GitHub repositories and developers, inspect detailed repository metrics, and explore recent issues. Built with Next.js (App Router), TypeScript, Tailwind CSS, and TanStack Query, adhering to the **DRD v2.0** design specifications (Primary color `#024ef3`).

---

## 1. Project Overview

The Developer Intelligence Dashboard provides real-time exploration of GitHub's public developer and repository ecosystem. The application emphasizes architectural correctness, resilience under GitHub API rate constraints, accessibility (WCAG AA), and clean asynchronous state management.

### Key Features
- **Repository & User Search**: Instant mode toggling between repositories and users with deep-linkable URL parameters (`?q=react&type=repos&page=1`), back/forward browser history support, and `/` keyboard shortcut.
- **Asynchronous Data Resilience**: 400 ms debounce, query deduplication, instant cancellation via `AbortSignal`, and stale-response protection.
- **Repository Deep Dive**: Detailed metrics including stars, forks, genuine watchers (via `subscribers_count`), branch, language breakdown with multi-segment visual progress bars, top contributors, and recent issues.
- **Pull Request Filtering**: Strict distinction between issues and pull requests (PRs are filtered out from the issues view).
- **Graceful Error Taxonomy**: Dedicated UI handling for unauthenticated rate limits (with reset time countdown), network failures, 422 validations, 404 not found, and 5xx server errors.
- **Component Isolation**: Isolated error boundaries ensure issue or contributor failures never blank repository details.
- **Optional Enhancements**:
  - LocalStorage-backed repository favorites with an accessible management modal.
  - Side-by-side repository comparison tray and comparison modal with winner highlights.
  - Multi-attribute filtering (programming language and minimum stars).
  - Light and dark theme toggle (defaulting to clean light theme).

---

## 2. Setup and Run Instructions

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

# 4. Run TypeScript typecheck
npm run typecheck

# 5. Build for production
npm run build

# 6. Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Configuration
GitHub unauthenticated search requests are rate-limited to ~10 requests/minute and 60 requests/hour per IP. To increase this limit to 5,000 requests/hour during heavy testing:
```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_GITHUB_TOKEN=your_personal_access_token in .env.local
```
*(Note: Never commit personal access tokens to source control).*

---

## 3. Architecture Overview

The codebase is organized into modular feature domains and shared primitives:

```
src/
├── api/
│   ├── client.ts             # Central Axios instance with rate-limit & error interceptors
│   ├── errors.ts             # ApiError taxonomy and getErrorDetails mapping
│   └── github/
│       ├── issues.ts         # GitHub issues fetching & PR filtering
│       ├── query-keys.ts     # Type-safe query key factories
│       ├── repos.ts          # Search, repo details, languages, contributors
│       ├── schemas.ts        # Zod runtime schemas
│       └── users.ts          # User search and per-user detail enrichment
├── app/
│   ├── layout.tsx            # Global layout shell with Providers, Header & Footer
│   ├── page.tsx              # Root search route with Suspense boundary
│   ├── not-found.tsx         # Custom 404 page
│   └── repo/[owner]/[name]/  # Dynamic repository route (page, loading, error)
├── components/               # Shared dumb UI primitives (Card, Button, Chip, Skeleton, ErrorState, EmptyState)
├── features/
│   ├── compare/              # Comparison bar tray and comparison modal
│   ├── favorites/            # Favorites modal and persistence
│   ├── repo/                 # RepoDetail hero, StatTile, IssuesList, RepoLanguages, RepoContributors
│   └── search/               # SearchForm, ModeToggle, FilterBar, ResultsMeta, ResultsList, RepoCard, UserCard, Pagination
├── hooks/
│   └── useSearchState.ts     # URL query string synchronization with Nuqs/Next Router
├── providers/                # ThemeProvider, FavoritesProvider, CompareProvider, QueryClientProvider
└── test/                     # Vitest test suites, MSW handlers, and custom render utilities
```

### Data Flow & Boundary Architecture
1. **URL as the Source of Truth**: The active search query (`q`), target mode (`type`), page number (`page`), language filter (`language`), and minimum stars (`minStars`) are serialized into the URL search parameters.
2. **Server State via TanStack Query**: Custom hooks trigger cached queries using strict tuple keys. If parameters change or requests are unmounted, queries automatically abort via `AbortSignal`.
3. **Runtime Schema Validation**: Raw Axios responses pass through Zod schemas before reaching React components, ensuring that unexpected GitHub schema shifts fail safely in the data layer rather than throwing render crashes.
4. **Isolated Sub-resource Boundaries**: Secondary queries (such as repository issues, top contributors, or languages) operate on independent query hooks with inline error handling. A failure in an ancillary endpoint never crashes the hero section.

---

## 4. Key Technical Decisions

### Decision 1: TanStack Query v5 for Server State Management
- **Decision**: Adopt TanStack Query v5 with normalized query key factories for all data fetching, caching, deduplication, and lifecycle management.
- **Alternatives considered**: Raw React `useEffect` + `useState`, SWR, or Redux Toolkit / RTK Query.
- **Why I chose this**: TanStack Query provides out-of-the-box request deduplication, garbage collection, exponential backoff, background refetching, and automatic `AbortSignal` propagation to cancel obsolete network requests when users type rapidly.
- **Trade-off**: Introduces an additional client library dependency (~13 kB gzipped) and requires wrapping the root component tree in a `QueryClientProvider`.

### Decision 2: URL Parameters as the Primary Source of Truth for Search & Filters
- **Decision**: Sync search text, active tab mode (repos vs. users), pagination, and filter parameters directly with URL search params (`useSearchParams` / `router.replace`).
- **Alternatives considered**: Storing search filters in local React component state (`useState`) or a global state store (Zustand / Redux).
- **Why I chose this**: Guarantees that search queries and filtered views are fully bookmarkable, shareable via link, and naturally integrated with browser Back/Forward navigation buttons without custom state synchronization code.
- **Trade-off**: Requires wrapping components consuming `useSearchParams()` in React `<Suspense>` boundaries to adhere to Next.js App Router static analysis, and necessitates URL parameter sanitization to prevent malformed queries.

### Decision 3: Centralized Axios Client with Typed `ApiError` Taxonomy and Header Interception
- **Decision**: Centralize all HTTP traffic through a singleton Axios client equipped with response interceptors that map HTTP status codes and headers (`x-ratelimit-reset`, `retry-after`) into a strongly typed `ApiError` domain class.
- **Alternatives considered**: Calling native `fetch` directly inside individual UI components or utility functions with scattered `try/catch` blocks.
- **Why I chose this**: Isolates GitHub-specific quirks (e.g., rate-limit header parsing, converting 403/429 to time-based reset messages, handling 422 validation errors) in a single module. UI components receive a structured `ApiError` with human-readable titles, instructions, and retry feasibility flags.
- **Trade-off**: Abstracting all HTTP requests through an interceptor introduces a layer of indirection between raw fetch payloads and consumers, requiring custom typing and explicit error classes.

### Decision 4: Runtime Schema Validation with Zod
- **Decision**: Validate and transform GitHub REST API payloads using runtime Zod schemas (`src/api/github/schemas.ts`) before passing models to UI components.
- **Alternatives considered**: Plain TypeScript interfaces and manual type assertions (`as RepoItem`).
- **Why I chose this**: TypeScript types evaporate at runtime. External APIs can change schemas, return unexpected `null` values, or omit undocumented fields. Zod guarantees strict runtime safety, normalizes `snake_case` keys into clean `camelCase` domain objects, and handles fallback defaults gracefully.
- **Trade-off**: Adds a small CPU parsing cost for each incoming network payload and requires maintaining matching schema definitions alongside TypeScript types.

### Decision 5: Next.js App Router with Client-Side Data Fetching
- **Decision**: Utilize Next.js 14 App Router for declarative file-based routing, layout shells, and route-level error boundaries, while executing GitHub API queries exclusively in the client.
- **Alternatives considered**: Next.js Server Components / Server Actions, or a pure Vite Single-Page Application (SPA).
- **Why I chose this**: Executing GitHub API calls from the client preserves each user's unique IP address, preventing all users from sharing a single server IP and rapidly exhausting GitHub's unauthenticated 60 req/hour limit. Meanwhile, App Router provides superior developer ergonomics, layout nesting, and optimized code splitting compared to a bare SPA.
- **Trade-off**: Requires declaring `"use client"` across feature components and disables Next.js server-side prerendering of search results.

### Decision 6: Isolated Inline Error Boundaries for Sub-resources
- **Decision**: Implement independent error states for sub-resource queries (issues, contributors, languages) so that a failure in one section does not blank the main repository view.
- **Alternatives considered**: Page-level blocking errors that unmount the entire repository screen if any sub-request fails.
- **Why I chose this**: Repository metadata (stars, forks, description) is the most critical information. If the issues endpoint encounters a 500 error or rate limit, the user can still inspect the repository overview and retry the issues section independently.
- **Trade-off**: Increases UI component complexity by requiring distinct container-level and inline-level error components and skeletons.

---

## 5. Trade-offs

- **Client-Side Data Fetching vs. Server-Side Fetching**:
  - *Trade-off*: Search results are not pre-rendered on the server for web scrapers or SEO crawlers.
  - *Rationale*: Client-side fetching prevents unauthenticated IP rate-limit exhaustion, ensuring every visitor has their own dedicated 60 requests/hour allowance.
- **Bounded Page Sizes (12 Repos / 10 Users) vs. Infinite Scrolling**:
  - *Trade-off*: Users must click page numbers rather than continuously scrolling down a feed.
  - *Rationale*: Numbered pagination provides clear milestone feedback, enables direct URL deep-linking to specific pages, prevents runaway memory consumption, and dramatically improves keyboard navigation and accessibility.
- **Lazy Per-Card User Enrichment vs. Batch Pre-fetching**:
  - *Trade-off*: When searching users, each card triggers an individual request to fetch followers and repository counts.
  - *Rationale*: The GitHub User Search API only returns basic profile information (`login`, `avatar_url`). Fetching details on demand keeps initial search payloads fast while preserving unauthenticated rate-limit quotas through page size caps (10 users).

---

## 6. Assumptions

1. **GitHub Watchers Representation**: GitHub's REST API has a legacy design where `watchers_count` is identical to `stargazers_count`. The application assumes that users looking for true repository watchers expect `subscribers_count`, which is fetched and displayed on the repository detail page.
2. **GitHub Search Result Limit**: The GitHub Search API enforces a hard ceiling of 1,000 maximum accessible results for any search query. The application assumes this ceiling, capping the pagination component at `ceil(1000 / pageSize)` and presenting an informative empty/cap banner if the user attempts to exceed it.
3. **Pull Requests Distinction**: GitHub's `/repos/{owner}/{repo}/issues` endpoint returns both issues and pull requests by default. The application assumes users want to inspect genuine issues, automatically filtering out items containing the `pull_request` key.
4. **Primary Color Consistency**: The UI assumes `#024ef3` as the single brand primary color, strictly reserving semantic colors (red `#b91c1c`, green `#15803d`, amber `#b45309`, purple `#6d28d9`) for system status.

---

## 7. Known Limitations

1. **Unauthenticated GitHub Rate Limits**: Without a Personal Access Token, GitHub restricts searches to ~10 requests per minute and 60 requests per hour per IP. If the rate limit is exceeded, an informative banner displays the resume time countdown, but queries will pause until GitHub resets the quota.
2. **No Backend User Accounts**: Repository favorites and comparison selections are stored in browser `localStorage`. They do not synchronize across different devices or browsers.
3. **Repository Issues Limit**: The issues list displays the latest 15 active issues sorted by updated date. Full multi-page issue browsing is not implemented.
4. **Search Syntax Constraints**: Complex GitHub qualifier combinations (e.g. `is:pr`, `archived:false`) are passed directly to GitHub; queries violating GitHub's syntax will trigger a 422 Validation Error state offering to edit the search query.

---

## 8. Testing Approach

The application utilizes **Vitest**, **React Testing Library**, and **Mock Service Worker (MSW v2)** for comprehensive automated testing:

```
Test Files  7 passed (7)
Tests       42 passed (42)
```

### Testing Strategy
- **API & Error Taxonomy Tests** (`src/test/api/`): Validates HTTP status code mapping, rate-limit reset timestamp parsing, network timeout detection, and fallback handling.
- **Zod Schema Tests** (`src/test/schemas/`): Validates runtime parsing, snake_case to camelCase transforms, null handling, and type inference.
- **Component & Integration Tests** (`src/test/features/`):
  - `SearchComponents.test.tsx`: Tests search input debouncing, immediate clearing via cross icon, segmented toggle radiogroup semantics, example query chips, and filter changes.
  - `RepoDetail.test.tsx`: Tests repository hero rendering, stats display, issue PR exclusion, and verifies that an issues failure leaves the hero section intact.
  - `OptionalEnhancements.test.tsx`: Tests favorites toggling and persistence in `localStorage`, repository comparison slot limits (max 2), contributor fetching, and `/` keyboard shortcut activation.
- **Accessibility Verification**: Tests verify ARIA roles (`role="radiogroup"`, `role="alert"`, `aria-live="polite"`, `aria-current="page"`), focus management, and keyboard interaction.

---

## 9. AI Usage Disclosure

### Which AI Tools Were Used
- **Google Gemini Coding Assistant** (Antigravity pair programmer).

### What AI Was Used For
- Scaffolding repetitive boilerplate code: Initial Zod schema definitions, typed interfaces, Tailwind design token configurations, and Vitest test fixtures.
- Generating Mock Service Worker (MSW) mock response payloads for GitHub repository and user models.
- Drafting initial component implementations and exploring responsive layout permutations.

### What Was Designed and Decided Independently (Human Architecture)
- **Data Fetching Location**: Made the core architectural decision to execute all data fetching from the client browser rather than server-side Next.js routes, preventing shared server IP rate-limit starvation.
- **Issue PR Filtering**: Mandated the business logic filtering out pull requests from the GitHub issues API response to provide accurate issue tracking.
- **URL Parameter Synchronization**: Designed the URL query parameter architecture (`useSearchState`) ensuring that all search state, tab modes, and filters are deep-linkable and support native browser history navigation.
- **Isolated Failure Modes**: Designed the component isolation strategy where sub-resource failures (issues, contributors, languages) render inline retry states without blanking the parent repository hero.
- **Design System Transition (DRD v2.0)**: Architected the transition from early glassmorphism to the clean, professional flat design system built around `#024ef3`, solid cards, and WCAG AA contrast.

### What Generated Code Was Reviewed or Changed
- **Search Bar Clear & Suggestion Flickering**: Identified and corrected an asynchronous state mismatch in `useSearchState` where calling `router.replace` without updating internal state caused momentary input flickering. Refactored state synchronization to be immediate and synchronous.
- **Tailwind Tokens & CSS Variables**: Reviewed and restructured the generated CSS token system to ensure strict compliance with DRD v2.0 (`--primary-50` through `--primary-700`, subtle borders, 6px/10px/14px radii).
- **TypeScript Type Inconsistencies**: Fixed a type-narrowing error in `CompareModal.tsx` where the `watchers` property was accessed on a union type of `RepoItem | RepoDetail`. Implemented a type guard helper to verify property existence safely.
- **Accessibility & Live Regions**: Audited generated components to add proper ARIA landmarks, `aria-live` announcements for search results and loading states, and 2px visible focus rings.

### Important AI Suggestions Rejected and Why
- **Server Actions / Route Handlers Proxy**:
  - *Suggestion*: The AI suggested proxying all GitHub API calls through Next.js Server Actions or Route Handlers (`/api/github/...`) to hide API endpoints.
  - *Reason for Rejection*: In a shared environment, server-side proxying funnels all user requests through a single server IP address. Under GitHub's unauthenticated search limit of 60 requests per hour, multiple users would immediately exhaust the shared quota and receive 403 errors. Keeping fetching on the client ensures each user gets their own independent rate limit.
- **Infinite Scrolling for Results**:
  - *Suggestion*: The AI proposed implementing infinite scroll with TanStack Query's `useInfiniteQuery`.
  - *Reason for Rejection*: Infinite scroll breaks URL shareability for specific pages, prevents reaching the footer without disruptive layout jumps, causes runaway DOM node accumulation, and makes keyboard navigation difficult for screen reader users. Numbered window pagination was retained for usability and accessibility.
- **External UI Component Library**:
  - *Suggestion*: The AI suggested installing an off-the-shelf component library (Chakra UI or MUI) for quick modals and inputs.
  - *Reason for Rejection*: Pre-built libraries introduce significant bundle overhead, complex runtime CSS-in-JS dependencies, and restrictive styling abstractions. Building lightweight primitives with Tailwind CSS and CSS variables ensured full control over WCAG AA compliance, `#024ef3` theming, and zero unnecessary runtime dependencies.
