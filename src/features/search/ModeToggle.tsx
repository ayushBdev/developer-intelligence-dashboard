"use client";

import React from "react";
import { FiBook, FiUsers, FiCheck } from "react-icons/fi";
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
            className="inline-flex w-full md:w-auto p-1 rounded-[var(--r-sm)] bg-[var(--surface-muted)] border border-[var(--border)]"
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
                            "relative flex flex-1 md:flex-initial items-center justify-center gap-2 px-4 py-2 text-sm rounded-[var(--r-sm)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
                            isSelected
                                ? "bg-[var(--primary-500)] text-white font-semibold shadow-sm"
                                : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                        )}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                        {isSelected && <FiCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                    </button>
                );
            })}
        </div>
    );
}

