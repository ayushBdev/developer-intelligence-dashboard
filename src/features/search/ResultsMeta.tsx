import React from "react";
import { formatCompactNumber } from "@/lib/format";
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
            className="flex flex-wrap items-center justify-between gap-2 px-1 py-2 text-sm text-content-secondary"
        >
            <div className="flex items-center gap-2">
                <span>
                    Found <strong className="text-content-primary font-semibold">{formattedTotal}</strong>{" "}
                    {typeLabel} for &ldquo;<span className="text-content-primary font-medium">{query}</span>&rdquo;
                </span>
                {isCapped && (
                    <span className="text-xs bg-badge-warning/15 text-badge-warning px-2 py-0.5 rounded-full border border-badge-warning/30 font-medium">
                        GitHub caps results at 1,000
                    </span>
                )}
            </div>

            {isLoading && (
                <span className="text-xs text-accent font-medium animate-pulse">
                    Updating results...
                </span>
            )}
        </div>
    );
}

