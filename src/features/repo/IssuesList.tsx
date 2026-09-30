"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getRepoIssues } from "@/api/github/issues";
import { qk } from "@/api/github/query-keys";
import { IssueRow } from "./IssueRow";
import { Skeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";

export interface IssuesListProps {
    owner: string;
    name: string;
}

export function IssuesList({ owner, name }: IssuesListProps) {
    const {
        data: issues = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: qk.issues(owner, name),
        queryFn: ({ signal }) =>
            getRepoIssues({
                owner,
                name,
                perPage: 15,
                signal,
            }),
    });

    return (
        <section aria-label="Recent repository issues" className="flex flex-col gap-4 mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    Recent Issues
                </h2>
                {!isLoading && !isError && (
                    <span
                        aria-live="polite"
                        className="text-xs text-[var(--text-secondary)] bg-[var(--surface-muted)] border border-[var(--border)] px-2.5 py-1 rounded-[var(--r-sm)] font-medium"
                    >
                        Showing latest {issues.length} {issues.length === 1 ? "issue" : "issues"} (PRs excluded)
                    </span>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div aria-busy="true" className="space-y-3">
                    <span className="sr-only">Loading recent issues...</span>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={`issue-skeleton-${idx}`}
                            className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2.5"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-16 rounded-[var(--r-sm)]" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-3/4 max-w-md" />
                            </div>
                            <div className="flex items-center gap-2 pl-1">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State: Isolated Inline Error (never blanks hero or stats) */}
            {isError && (
                <ErrorState
                    error={error}
                    variant="inline"
                    onRetry={() => refetch()}
                    isRetrying={isFetching}
                />
            )}

            {/* Empty State */}
            {!isLoading && !isError && issues.length === 0 && (
                <EmptyState type="no-issues" />
            )}

            {/* Issue Rows */}
            {!isLoading && !isError && issues.length > 0 && (
                <ul className="space-y-2.5">
                    {issues.map((issue) => (
                        <IssueRow key={issue.id} issue={issue} />
                    ))}
                </ul>
            )}
        </section>
    );
}

