import React from "react";
import { FiSearch, FiInbox, FiInfo } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Chip } from "./Chip";

export interface EmptyStateProps {
    type?: "initial" | "no-results" | "no-issues" | "page-cap";
    query?: string;
    onClear?: () => void;
    onSelectQuery?: (query: string) => void;
    className?: string;
}

export function EmptyState({
    type = "initial",
    query = "",
    onClear,
    onSelectQuery,
    className,
}: EmptyStateProps) {
    if (type === "initial") {
        const exampleChips = [
            "react state management",
            "user:torvalds",
            "language:typescript",
            "next.js",
            "machine learning",
        ];

        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 md:p-14 text-center glass-1 rounded-2xl border border-white/10 max-w-2xl mx-auto my-6",
                    className
                )}
            >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 text-accent mb-4">
                    <FiSearch className="w-8 h-8" aria-hidden="true" />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-content-primary mb-2">
                    Search GitHub Repositories & Developers
                </h2>

                <p className="text-sm md:text-base text-content-secondary mb-6 max-w-md">
                    Explore top open-source projects, compare stars and forks, inspect recent issues, or discover developer profiles.
                </p>

                {onSelectQuery && (
                    <div className="flex flex-col items-center gap-2.5">
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
                    No results found for &ldquo;{query}&rdquo;
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

