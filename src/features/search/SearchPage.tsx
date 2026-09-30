"use client";

import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRepos } from "@/api/github/repos";
import { searchUsers } from "@/api/github/users";
import { qk } from "@/api/github/query-keys";
import { useSearchState } from "@/hooks/useSearchState";
import { SearchForm } from "./SearchForm";
import { ResultsMeta } from "./ResultsMeta";
import { ResultsList } from "./ResultsList";
import { Pagination } from "./Pagination";
import type { SearchMode } from "@/types";

const REPOS_PAGE_SIZE = 12;
const USERS_PAGE_SIZE = 10;

export function SearchPage() {
    const {
        q,
        type: mode,
        page,
        language,
        minStars,
        setSearchState,
    } = useSearchState();

    const isRepoMode = mode === "repos";
    const isUserMode = mode === "users";
    const hasQuery = Boolean(q.trim());

    // Repos Query: Only keep previous data when staying on the same query and paginating
    const reposQuery = useQuery({
        queryKey: qk.repos({ q, page, language, minStars }),
        queryFn: ({ signal }) =>
            searchRepos({
                q,
                page,
                perPage: REPOS_PAGE_SIZE,
                language,
                minStars,
                signal,
            }),
        enabled: hasQuery && isRepoMode,
        placeholderData: (previousData, previousQuery) => {
            const prevParams = previousQuery?.queryKey?.[1] as
                | { q?: string; page?: number }
                | undefined;
            if (prevParams && prevParams.q === q) {
                return previousData;
            }
            return undefined;
        },
    });

    // Users Query: Only keep previous data when staying on the same query and paginating
    const usersQuery = useQuery({
        queryKey: qk.users({ q, page }),
        queryFn: ({ signal }) =>
            searchUsers({
                q,
                page,
                perPage: USERS_PAGE_SIZE,
                signal,
            }),
        enabled: hasQuery && isUserMode,
        placeholderData: (previousData, previousQuery) => {
            const prevParams = previousQuery?.queryKey?.[1] as
                | { q?: string; page?: number }
                | undefined;
            if (prevParams && prevParams.q === q) {
                return previousData;
            }
            return undefined;
        },
    });

    const activeQuery = isRepoMode ? reposQuery : usersQuery;
    // When query is cleared or empty, items and totalCount must immediately be empty/zero
    const items = hasQuery ? activeQuery.data?.items || [] : [];
    const totalCount = hasQuery ? activeQuery.data?.totalCount || 0 : 0;
    const pageSize = isRepoMode ? REPOS_PAGE_SIZE : USERS_PAGE_SIZE;

    // Handle Search Queries
    const handleQueryChange = useCallback(
        (newQuery: string) => {
            setSearchState(
                {
                    q: newQuery,
                    page: 1, // Reset page on new query
                },
                { replace: true }
            );
        },
        [setSearchState]
    );

    // Handle Mode Change (Repositories <-> Users)
    const handleModeChange = useCallback(
        (newMode: SearchMode) => {
            setSearchState(
                {
                    type: newMode,
                    page: 1, // Keep query, reset page to 1
                },
                { replace: true }
            );
        },
        [setSearchState]
    );

    // Handle Filters
    const handleLanguageChange = useCallback(
        (lang?: string) => {
            setSearchState(
                {
                    language: lang,
                    page: 1,
                },
                { replace: true }
            );
        },
        [setSearchState]
    );

    const handleMinStarsChange = useCallback(
        (stars?: number) => {
            setSearchState(
                {
                    minStars: stars,
                    page: 1,
                },
                { replace: true }
            );
        },
        [setSearchState]
    );

    const handleClearAllFilters = useCallback(() => {
        setSearchState(
            {
                language: undefined,
                minStars: undefined,
                page: 1,
            },
            { replace: true }
        );
    }, [setSearchState]);

    const handleClearSearch = useCallback(() => {
        setSearchState(
            {
                q: "",
                page: 1,
                language: undefined,
                minStars: undefined,
            },
            { replace: true }
        );
    }, [setSearchState]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setSearchState(
                {
                    page: newPage,
                },
                { replace: true }
            );
        },
        [setSearchState]
    );

    return (
        <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            {/* Top Heading: 28px/36px (mobile 24px/32px), weight 700 */}
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
                <h1
                    id="page-heading"
                    tabIndex={-1}
                    className="text-2xl sm:text-[28px] leading-8 sm:leading-9 font-bold tracking-tight text-[var(--text)] focus-visible:outline-none"
                >
                    Developer Intelligence
                </h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                    Explore GitHub repositories, compare software architecture, and inspect developer profiles.
                </p>
            </div>

            {/* Search Form with Mode Switch & Filters */}
            <SearchForm
                initialQuery={q}
                mode={mode}
                language={language}
                minStars={minStars}
                isFetching={hasQuery && activeQuery.isFetching}
                onQueryChange={handleQueryChange}
                onModeChange={handleModeChange}
                onLanguageChange={handleLanguageChange}
                onMinStarsChange={handleMinStarsChange}
                onClearAllFilters={handleClearAllFilters}
            />

            {/* Results Section */}
            <section aria-label="Search results" className="flex flex-col gap-4">
                <h2 id="results-heading" tabIndex={-1} className="sr-only">
                    Results
                </h2>

                <ResultsMeta
                    query={q}
                    mode={mode}
                    totalCount={totalCount}
                    isLoading={hasQuery && activeQuery.isFetching && !activeQuery.isLoading}
                />

                <ResultsList
                    mode={mode}
                    query={q}
                    items={items}
                    isLoading={hasQuery && activeQuery.isLoading}
                    isFetching={hasQuery && activeQuery.isFetching}
                    isError={hasQuery && activeQuery.isError}
                    error={activeQuery.error}
                    onRetry={() => activeQuery.refetch()}
                    onClearSearch={handleClearSearch}
                    onSelectExampleQuery={(query) => handleQueryChange(query)}
                />

                {/* Pagination */}
                {hasQuery && !activeQuery.isLoading && !activeQuery.isError && items.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        disabled={activeQuery.isFetching}
                    />
                )}
            </section>
        </main>
    );
}

