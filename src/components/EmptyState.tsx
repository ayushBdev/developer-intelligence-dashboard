import React from "react";
import { FiSearch, FiInbox, FiInfo } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Chip } from "./Chip";
import type { SearchMode } from "@/types";

export interface EmptyStateProps {
    type?: "initial" | "no-results" | "no-issues" | "page-cap";
    mode?: SearchMode;
    query?: string;
    onClear?: () => void;
    onSelectQuery?: (query: string) => void;
    className?: string;
}

export function EmptyState({
    type = "initial",
    mode = "repos",
    query = "",
    onClear,
    onSelectQuery,
    className,
}: EmptyStateProps) {
    if (type === "initial") {
        const repoSuggestions = [
            "react state management",
            "next.js",
            "language:typescript",
            "tailwind css",
            "machine learning",
        ];

        const userSuggestions = [
            "torvalds",
            "gaearon",
            "sindresorhus",
            "antfu",
            "yyx990803",
        ];

        const exampleChips = mode === "users" ? userSuggestions : repoSuggestions;

        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-6 md:p-10 text-center glass-1 rounded-2xl border border-white/10 max-w-2xl mx-auto my-2",
                    className
                )}
            >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 text-accent mb-3">
                    <FiSearch className="w-7 h-7" aria-hidden="true" />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-content-primary mb-2">
                    {mode === "users"
                        ? "Search GitHub Developers"
                        : "Search GitHub Repositories"}
                </h2>

                <p className="text-sm md:text-base text-content-secondary mb-5 max-w-md">
                    {mode === "users"
                        ? "Discover developers, inspect public repositories, follower counts, and locations."
                        : "Explore open-source projects, compare stars and forks, and inspect recent issues."}
                </p>

                {onSelectQuery && (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-content-muted font-semibold">
                            Try searching for:
                        </span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {exampleChips.map((chip) => (
                                <Chip
                                    key={chip}
                                    variant="interactive"
                                    onClick={() => onSelectQuery(chip)}
                                >
                                    {chip}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (type === "no-results") {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 md:p-12 text-center glass-1 rounded-2xl border border-white/10 max-w-lg mx-auto my-6",
                    className
                )}
            >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 text-content-muted mb-4">
                    <FiSearch className="w-7 h-7" aria-hidden="true" />
                </div>

                <h2 className="text-lg md:text-xl font-semibold text-content-primary mb-2">
                    No {mode === "users" ? "users" : "repositories"} match &ldquo;{query}&rdquo;
                </h2>

                <p className="text-sm text-content-secondary mb-6">
                    Try checking for spelling errors, using more general keywords, or clearing advanced filters.
                </p>

                {onClear && (
                    <Button variant="secondary" size="md" onClick={onClear}>
                        Clear search
                    </Button>
                )}
            </div>
        );
    }

    if (type === "no-issues") {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 text-center glass-0 rounded-xl border border-white/10 my-4",
                    className
                )}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-content-muted mb-3">
                    <FiInbox className="w-6 h-6" aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold text-content-primary mb-1">
                    No open or recent issues
                </h3>

                <p className="text-sm text-content-secondary">
                    This repository is quiet with no open or recent issues reported.
                </p>
            </div>
        );
    }

    // page-cap
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 text-center glass-1 rounded-xl border border-white/10 max-w-md mx-auto my-6",
                className
            )}
        >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-badge-warning/15 text-badge-warning mb-3">
                <FiInfo className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 className="text-base font-semibold text-content-primary mb-1">
                Result limit reached
            </h3>

            <p className="text-sm text-content-secondary mb-4">
                GitHub only returns the first 1,000 search results for any query.
            </p>

            {onClear && (
                <Button variant="primary" size="sm" onClick={onClear}>
                    Return to page 1
                </Button>
            )}
        </div>
    );
}

