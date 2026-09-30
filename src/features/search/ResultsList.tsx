"use client";

import React from "react";
import { RepoCard } from "./RepoCard";
import { UserCard } from "./UserCard";
import { Skeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/cn";
import type { RepoItem, SearchMode, UserItem } from "@/types";

export interface ResultsListProps {
    mode: SearchMode;
    query: string;
    items: (RepoItem | UserItem)[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: unknown;
    onRetry: () => void;
    onClearSearch: () => void;
    onSelectExampleQuery: (q: string) => void;
}

export function ResultsList({
    mode,
    query,
    items,
    isLoading,
    isFetching,
    isError,
    error,
    onRetry,
    onClearSearch,
    onSelectExampleQuery,
}: ResultsListProps) {
    const skeletonCount = mode === "repos" ? 12 : 10;

    const renderSkeletons = () => (
        <>
            {Array.from({ length: skeletonCount }).map((_, idx) => (
                <div
                    key={`skeleton-${idx}`}
                    className="p-5 rounded-2xl glass-1 border border-white/10 flex flex-col justify-between min-h-[160px]"
                >
                    {mode === "repos" ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3.5">
                                <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </>
    );

    // 1. Initial State (no query entered): Show suggestions only
    if (!query.trim()) {
        return (
            <EmptyState
                type="initial"
                mode={mode}
                onSelectQuery={onSelectExampleQuery}
            />
        );
    }

    // 2. Loading State: when first loading or when fetching a new query
    if (isLoading || (isFetching && items.length === 0)) {
        return (
            <div
                aria-busy="true"
                aria-label={`Loading ${mode === "repos" ? "repositories" : "users"}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <span className="sr-only">Loading results...</span>
                {renderSkeletons()}
            </div>
        );
    }

    // 3. Error State
    if (isError) {
        return (
            <ErrorState
                error={error}
                onRetry={onRetry}
                isRetrying={isFetching}
                variant="page"
            />
        );
    }

    // 4. Empty Results (searched but no items match)
    if (items.length === 0 && !isFetching) {
        return (
            <EmptyState
                type="no-results"
                mode={mode}
                query={query}
                onClear={onClearSearch}
            />
        );
    }

    // 5. Results Grid
    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-200",
                isFetching && "opacity-60 pointer-events-none"
            )}
            aria-busy={isFetching}
        >
            {mode === "repos"
                ? (items as RepoItem[]).map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                  ))
                : (items as UserItem[]).map((user) => (
                      <UserCard key={user.id} user={user} />
                  ))}
        </div>
    );
}

