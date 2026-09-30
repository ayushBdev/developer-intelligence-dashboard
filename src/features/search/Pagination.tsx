"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/cn";

export interface PaginationProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export function Pagination({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
    disabled = false,
}: PaginationProps) {
    // GitHub search API limit: only first 1,000 results are accessible
    const cappedTotal = Math.min(totalCount, 1000);
    const totalPages = Math.max(1, Math.ceil(cappedTotal / pageSize));

    if (totalPages <= 1) {
        return null;
    }

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const handleSelectPage = (page: number) => {
        if (disabled || page === currentPage || page < 1 || page > totalPages) return;
        onPageChange(page);
        // Scroll to results heading
        const heading = document.getElementById("results-heading");
        if (heading) {
            heading.scrollIntoView({ behavior: "smooth" });
            heading.focus();
        }
    };

    // Calculate numbered window: current ±2
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1.5 py-6 my-4 select-none"
        >
            {/* Previous Page Button */}
            <button
                type="button"
                disabled={!hasPrev || disabled}
                aria-disabled={!hasPrev || disabled}
                onClick={() => handleSelectPage(currentPage - 1)}
                className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
                    !hasPrev || disabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:bg-[var(--surface-muted)] hover:border-[var(--border-strong)] active:scale-95"
                )}
            >
                <FiChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Mobile View: "Page X of Y" */}
            <div className="flex sm:hidden items-center px-3 py-1.5 text-xs text-[var(--text-secondary)] font-medium">
                Page {currentPage} of {totalPages}
            </div>

            {/* Desktop View: Numbered Window */}
            <div className="hidden sm:flex items-center gap-1.5">
                {pages.map((p, idx) => {
                    if (p === "...") {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="px-2 py-1 text-[var(--text-muted)] text-sm"
                                aria-hidden="true"
                            >
                                …
                            </span>
                        );
                    }

                    const pageNumber = p as number;
                    const isCurrent = pageNumber === currentPage;

                    return (
                        <button
                            key={pageNumber}
                            type="button"
                            disabled={disabled}
                            aria-current={isCurrent ? "page" : undefined}
                            onClick={() => handleSelectPage(pageNumber)}
                            className={cn(
                                "min-w-[38px] h-[38px] px-2.5 rounded-[var(--r-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
                                isCurrent
                                    ? "bg-[var(--primary-500)] text-white font-semibold shadow-sm pointer-events-none"
                                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] hover:border-[var(--border-strong)] active:scale-95"
                            )}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>

            {/* Next Page Button */}
            <button
                type="button"
                disabled={!hasNext || disabled}
                aria-disabled={!hasNext || disabled}
                onClick={() => handleSelectPage(currentPage + 1)}
                className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
                    !hasNext || disabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:bg-[var(--surface-muted)] hover:border-[var(--border-strong)] active:scale-95"
                )}
            >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
        </nav>
    );
}

