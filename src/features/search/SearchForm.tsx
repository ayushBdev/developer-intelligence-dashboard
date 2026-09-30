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

    // Sync input when initialQuery changes externally (e.g. suggestions clicked, clear clicked, or back/forward)
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

    // Handle typing with clean debounce timer
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
                        className="w-full pl-11 pr-24 py-3 rounded-xl bg-white/5 border border-white/15 text-content-primary placeholder-content-muted text-sm md:text-base backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                    />

                    {/* Right side indicators: Shortcut hint + Clear button + Fetching spinner */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {isFetching && (
                            <span className="text-accent flex items-center" title="Searching...">
                                <Spinner size="sm" />
                            </span>
                        )}

                        {!inputValue && (
                            <kbd
                                title="Press / to focus search"
                                className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-content-muted bg-white/5 border border-white/10 rounded shadow-sm"
                            >
                                /
                            </kbd>
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
