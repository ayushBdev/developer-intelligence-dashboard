"use client";

import React from "react";
import { FiBook, FiUsers } from "react-icons/fi";
import { cn } from "@/lib/cn";
import type { SearchMode } from "@/types";

export interface ModeToggleProps {
    value: SearchMode;
    onChange: (mode: SearchMode) => void;
    disabled?: boolean;
}

export function ModeToggle({ value, onChange, disabled }: ModeToggleProps) {
    const options: { id: SearchMode; label: string; icon: React.ReactNode }[] = [
        { id: "repos", label: "Repositories", icon: <FiBook className="w-4 h-4 shrink-0" aria-hidden="true" /> },
        { id: "users", label: "Users", icon: <FiUsers className="w-4 h-4 shrink-0" aria-hidden="true" /> },
    ];

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            const nextIndex = (index + 1) % options.length;
            const nextOption = options[nextIndex];
            if (nextOption) onChange(nextOption.id);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            const prevIndex = (index - 1 + options.length) % options.length;
            const prevOption = options[prevIndex];
            if (prevOption) onChange(prevOption.id);
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label="Search target"
            className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
            {options.map((option, idx) => {
                const isSelected = value === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={disabled}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => onChange(option.id)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className={cn(
                            "relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                            isSelected
                                ? "text-content-primary bg-accent/25 border-b-2 border-accent font-semibold shadow-sm"
                                : "text-content-secondary hover:text-content-primary hover:bg-white/5"
                        )}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

