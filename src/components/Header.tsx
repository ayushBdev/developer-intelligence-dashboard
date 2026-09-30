"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiSun, FiMoon, FiGithub, FiBookmark } from "react-icons/fi";
import { useTheme } from "@/providers/ThemeContext";
import { useFavorites } from "@/providers/FavoritesContext";
import { FavoritesModal } from "@/features/favorites/FavoritesModal";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { favorites } = useFavorites();
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-[var(--surface)] border-b border-[var(--border)] transition-colors">
                {/* Thin #024EF3 top accent bar per Section 4.2 */}
                <div className="h-[2px] w-full bg-[var(--primary-500)]" aria-hidden="true" />

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-[var(--text)] font-bold text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-[var(--r-sm)] p-1"
                    >
                        <div className="w-8 h-8 rounded-[var(--r-sm)] bg-[var(--primary-500)] flex items-center justify-center text-white shadow-sm">
                            <FiGithub className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="hidden sm:inline">Developer Intelligence</span>
                        <span className="sm:hidden">DevIntel</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Favorites Button */}
                        <button
                            type="button"
                            onClick={() => setIsFavoritesOpen(true)}
                            aria-label={`View saved repositories (${favorites.length} saved)`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] text-xs sm:text-sm font-medium border border-[var(--border)]"
                        >
                            <FiBookmark
                                className={favorites.length > 0 ? "text-[var(--star)] fill-current" : ""}
                                aria-hidden="true"
                            />
                            <span>Favorites</span>
                            {favorites.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] dark:bg-[var(--primary-500)]/20 dark:text-[var(--link,#6b93ff)] font-bold text-[11px]">
                                    {favorites.length}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            className="p-2 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] border border-[var(--border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                        >
                            {theme === "dark" ? (
                                <FiSun className="w-4 h-4" aria-hidden="true" />
                            ) : (
                                <FiMoon className="w-4 h-4" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <FavoritesModal
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
            />
        </>
    );
}

