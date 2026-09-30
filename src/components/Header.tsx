"use client";

import React from "react";
import Link from "next/link";
import { FiSun, FiMoon, FiGithub } from "react-icons/fi";
import { useTheme } from "@/providers/ThemeContext";

export function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-canvas-base/75 border-b border-white/10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 text-content-primary font-bold text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
                >
                    <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                        <FiGithub className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span>Developer Intelligence</span>
                </Link>

                <div className="flex items-center gap-3">
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
    );
}

