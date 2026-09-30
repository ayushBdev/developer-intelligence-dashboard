"use client";

import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Spinner } from "@/components/Spinner";
import { ModeToggle } from "./ModeToggle";
import { FilterBar } from "./FilterBar";
import type { SearchMode } from "@/types";

export interface SearchFormProps {
    initialQuery: string;
    mode: SearchMode;
    language?: string;
    minStars?: number;
    isFetching?: boolean;
    onQueryChange: (query: string, immediate?: boolean) => void;
    onModeChange: (mode: SearchMode) => void;
    onLanguageChange: (lang?: string) => void;
    onMinStarsChange: (stars?: number) => void;
    onClearAllFilters: () => void;
}

export function SearchForm({
    initialQuery,
    mode,
    language,
    minStars,
    isFetching = false,
    onQueryChange,
    onModeChange,
    onLanguageChange,
    onMinStarsChange,
    onClearAllFilters,
}: SearchFormProps) {
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedValue = useDebouncedValue(inputValue, 400);

    // Sync input when initialQuery changes externally (e.g. browser back/forward or example chips)
    useEffect(() => {
        setInputValue(initialQuery);
    }, [initialQuery]);

    // When debounced value changes, trigger query update
    useEffect(() => {
        const trimmed = debouncedValue.trim();
        if (trimmed !== initialQuery.trim()) {
            onQueryChange(trimmed, false);
        }
    }, [debouncedValue, initialQuery, onQueryChange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onQueryChange(inputValue.trim(), true);
    };

    const handleClear = () => {
        setInputValue("");
        onQueryChange("", true);
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="w-full glass-2 p-4 md:p-6 rounded-2xl border border-white/15 shadow-glass flex flex-col gap-4"
        >
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Input Box */}
                <div className="relative flex-1">
                    <label htmlFor="search-input" className="sr-only">
                        Search GitHub repositories and users
                    </label>

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-muted">
                        <FiSearch className="w-5 h-5" aria-hidden="true" />
                    </div>

                    <input
                        id="search-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                            mode === "repos"
                                ? "Search repositories (e.g., 'react state', 'next.js')..."
                                : "Search developers (e.g., 'torvalds', 'gaearon')..."
                        }
                        maxLength={256}
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full pl-11 pr-20 py-3 rounded-xl bg-white/5 border border-white/15 text-content-primary placeholder-content-muted text-sm md:text-base backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                    />

                    {/* Right side indicators: Clear button + Fetching spinner */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {isFetching && (
                            <span className="text-accent flex items-center" title="Searching...">
                                <Spinner size="sm" />
                            </span>
                        )}

                        {inputValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                aria-label="Clear search input"
                                className="p-1 rounded-md text-content-secondary hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <FiX className="w-4 h-4" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Target Mode Segmented Control */}
                <div className="shrink-0 flex justify-center md:justify-end">
                    <ModeToggle value={mode} onChange={onModeChange} />
                </div>
            </div>

            {/* Optional repository filters bar */}
            {mode === "repos" && (
                <FilterBar
                    language={language}
                    minStars={minStars}
                    onLanguageChange={onLanguageChange}
                    onMinStarsChange={onMinStarsChange}
                    onClearAll={onClearAllFilters}
                />
            )}
        </form>
    );
}

