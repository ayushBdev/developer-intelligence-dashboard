import React from "react";
import type { SearchMode } from "@/types";

export interface ResultsMetaProps {
    query: string;
    mode: SearchMode;
    totalCount: number;
    isLoading?: boolean;
}

export function ResultsMeta({ query, mode, totalCount, isLoading = false }: ResultsMetaProps) {
    if (!query.trim()) {
        return null;
    }

    const typeLabel = mode === "repos" ? "repositories" : "users";
    const formattedTotal = totalCount.toLocaleString("en-US");
    const isCapped = totalCount > 1000;

    return (
        <div
            aria-live="polite"
            className="flex flex-wrap items-center justify-between gap-2 px-1 py-1 text-sm text-[var(--text-secondary)]"
        >
            <div className="flex items-center gap-2">
                <span>
                    Found <strong className="text-[var(--text)] font-semibold">{formattedTotal}</strong>{" "}
                    {typeLabel} for &ldquo;<span className="text-[var(--text)] font-medium">{query}</span>&rdquo;
                </span>
                {isCapped && (
                    <span className="text-xs bg-[var(--warning-bg)] text-[var(--warning)] px-2 py-0.5 rounded-[var(--r-sm)] border border-[var(--warning)]/30 font-medium">
                        Showing first 1,000 results
                    </span>
                )}
            </div>

            {isLoading && (
                <span className="text-xs text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] font-medium animate-pulse">
                    Updating results...
                </span>
            )}
        </div>
    );
}

