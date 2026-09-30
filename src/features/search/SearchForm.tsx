"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
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
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync input when initialQuery changes externally
    useEffect(() => {
        setInputValue(initialQuery);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
    }, [initialQuery]);

    // Keyboard shortcut navigation: '/' to focus search, 'Escape' to blur/clear
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElem = document.activeElement;
            const isTyping =
                activeElem &&
                (activeElem.tagName === "INPUT" ||
                    activeElem.tagName === "TEXTAREA" ||
                    activeElem.getAttribute("contenteditable") === "true");

            if (e.key === "/" && !isTyping) {
                e.preventDefault();
                inputRef.current?.focus();
            } else if (e.key === "Escape" && activeElem === inputRef.current) {
                inputRef.current?.blur();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Handle typing with debounce timer
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            onQueryChange(val.trim(), false);
        }, 400);
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        onQueryChange(inputValue.trim(), true);
    };

    const handleClear = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        setInputValue("");
        onQueryChange("", true);
        inputRef.current?.focus();
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="w-full bg-[var(--surface)] p-4 md:p-6 rounded-[var(--r-md)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col gap-4"
        >
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Input Box */}
                <div className="relative flex-1">
                    <label htmlFor="search-input" className="sr-only">
                        Search GitHub repositories and users
                    </label>

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                        <FiSearch className="w-5 h-5" aria-hidden="true" />
                    </div>

                    <input
                        ref={inputRef}
                        id="search-input"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={
                            mode === "repos"
                                ? "Search repositories (e.g., 'react state', 'next.js')..."
                                : "Search developers (e.g., 'torvalds', 'gaearon')..."
                        }
                        maxLength={256}
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full h-[44px] pl-11 pr-24 rounded-[var(--r-sm)] bg-[var(--surface)] dark:bg-[var(--surface-muted)] border border-[var(--border-strong)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm md:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:border-[var(--primary-500)]"
                    />

                    {/* Right side indicators: Shortcut hint + Clear button + Fetching spinner */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {isFetching && (
                            <span className="text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] flex items-center" title="Searching...">
                                <Spinner size="sm" />
                            </span>
                        )}

                        {!inputValue && (
                            <kbd
                                title="Press / to focus search"
                                className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--surface-muted)] border border-[var(--border)] rounded-[4px] shadow-sm"
                            >
                                /
                            </kbd>
                        )}

                        {inputValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                aria-label="Clear search input"
                                className="p-1 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
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

