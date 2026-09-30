"use client";

import React from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { cn } from "@/lib/cn";

export interface FilterBarProps {
    language?: string;
    minStars?: number;
    onLanguageChange: (lang?: string) => void;
    onMinStarsChange: (stars?: number) => void;
    onClearAll: () => void;
    disabled?: boolean;
}

const COMMON_LANGUAGES = [
    "TypeScript",
    "JavaScript",
    "Python",
    "Go",
    "Rust",
    "Java",
    "C++",
    "Ruby",
];

const STAR_OPTIONS = [
    { label: "Any stars", value: 0 },
    { label: "★ 100+", value: 100 },
    { label: "★ 500+", value: 500 },
    { label: "★ 1k+", value: 1000 },
    { label: "★ 5k+", value: 5000 },
    { label: "★ 10k+", value: 10000 },
];

export function FilterBar({
    language,
    minStars,
    onLanguageChange,
    onMinStarsChange,
    onClearAll,
    disabled = false,
}: FilterBarProps) {
    const hasActiveFilters = Boolean(language || (minStars !== undefined && minStars > 0));

    return (
        <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] shrink-0">
                <FiFilter className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold text-xs uppercase tracking-wider">Filters:</span>
            </div>

            {/* Language Select */}
            <div className="relative">
                <select
                    aria-label="Filter by language"
                    value={language || ""}
                    disabled={disabled}
                    onChange={(e) => onLanguageChange(e.target.value || undefined)}
                    className="appearance-none bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)] rounded-[var(--r-sm)] px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] disabled:opacity-50"
                >
                    <option value="" className="bg-[var(--surface)] text-[var(--text)]">
                        All Languages
                    </option>
                    {COMMON_LANGUAGES.map((lang) => (
                        <option
                            key={lang}
                            value={lang.toLowerCase()}
                            className="bg-[var(--surface)] text-[var(--text)]"
                        >
                            {lang}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)] text-xs">
                    ▼
                </div>
            </div>

            {/* Min Stars Select */}
            <div className="relative">
                <select
                    aria-label="Filter by minimum stars"
                    value={minStars || 0}
                    disabled={disabled}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onMinStarsChange(val > 0 ? val : undefined);
                    }}
                    className="appearance-none bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)] rounded-[var(--r-sm)] px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] disabled:opacity-50"
                >
                    {STAR_OPTIONS.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-[var(--surface)] text-[var(--text)]"
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)] text-xs">
                    ▼
                </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClearAll}
                    disabled={disabled}
                    className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] bg-[var(--primary-50)] dark:bg-[var(--primary-500)]/15 hover:bg-[var(--primary-100)] border border-[var(--primary-200)] dark:border-[var(--primary-500)]/30 rounded-[var(--r-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                    )}
                >
                    <FiX className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset filters</span>
                </button>
            )}
        </div>
    );
}

