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
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-canvas-base/75 border-b border-white/10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-content-primary font-bold text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
                    >
                        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs sm:text-sm font-medium border border-white/10"
                        >
                            <FiBookmark
                                className={favorites.length > 0 ? "text-badge-star fill-current" : ""}
                                aria-hidden="true"
                            />
                            <span>Favorites</span>
                            {favorites.length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-badge-star/20 text-badge-star font-bold text-[11px]">
                                    {favorites.length}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            {theme === "dark" ? (
                                <FiSun className="w-5 h-5" aria-hidden="true" />
                            ) : (
                                <FiMoon className="w-5 h-5" aria-hidden="true" />
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
