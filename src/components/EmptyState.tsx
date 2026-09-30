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
            "language:typescript",
            "next.js",
            "machine learning",
        ];

        const userSuggestions = [
            "torvalds",
            "gaearon",
            "sindresorhus",
            "antfu",
        ];

        const exampleChips = mode === "users" ? userSuggestions : repoSuggestions;

        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[var(--surface)] border-2 border-dashed border-[var(--border-strong)] rounded-[var(--r-md)] max-w-2xl mx-auto my-4 shadow-[var(--shadow-sm)]",
                    className
                )}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] dark:bg-[var(--primary-500)]/15 dark:text-[var(--link,#6b93ff)] mb-3">
                    <FiSearch className="w-6 h-6" aria-hidden="true" />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-[var(--text)] mb-2">
                    {mode === "users"
                        ? "Search GitHub Developers"
                        : "Search GitHub Repositories"}
                </h2>

                <p className="text-sm md:text-base text-[var(--text-secondary)] mb-6 max-w-md">
                    {mode === "users"
                        ? "Discover developers, inspect public repositories, follower counts, and locations."
                        : "Explore open-source projects, compare stars and forks, and inspect recent issues."}
                </p>

                {onSelectQuery && (
                    <div className="flex flex-col items-center gap-2.5">
                        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
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
                    "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[var(--surface)] border-2 border-dashed border-[var(--border-strong)] rounded-[var(--r-md)] max-w-lg mx-auto my-6 shadow-[var(--shadow-sm)]",
                    className
                )}
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] mb-4">
                    <FiSearch className="w-6 h-6" aria-hidden="true" />
                </div>

                <h2 className="text-lg md:text-xl font-semibold text-[var(--text)] mb-2">
                    No {mode === "users" ? "users" : "repositories"} match &ldquo;{query}&rdquo;
                </h2>

                <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
                    Try checking for spelling errors, using more general keywords, or clearing filters.
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
                    "flex flex-col items-center justify-center p-8 text-center bg-[var(--surface)] border border-dashed border-[var(--border-strong)] rounded-[var(--r-md)] my-4 shadow-[var(--shadow-sm)]",
                    className
                )}
            >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] mb-3">
                    <FiInbox className="w-5 h-5" aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                    No recent issues. This repository is quiet.
                </h3>

                <p className="text-sm text-[var(--text-secondary)]">
                    There are no open or recent issues reported on this project.
                </p>
            </div>
        );
    }

    // page-cap
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 text-center bg-[var(--surface)] border border-dashed border-[var(--border-strong)] rounded-[var(--r-md)] max-w-md mx-auto my-6 shadow-[var(--shadow-sm)]",
                className
            )}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--warning-bg)] text-[var(--warning)] mb-3">
                <FiInfo className="w-5 h-5" aria-hidden="true" />
            </div>

            <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                GitHub only returns the first 1,000 results
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mb-4">
                Please narrow down your search query or filters to discover more specific items.
            </p>

            {onClear && (
                <Button variant="primary" size="sm" onClick={onClear}>
                    Return to page 1
                </Button>
            )}
        </div>
    );
}

