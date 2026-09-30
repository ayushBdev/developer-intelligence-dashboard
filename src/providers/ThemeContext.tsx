"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Default light theme as per DRD v2.0
    const [theme, setThemeState] = useState<Theme>("light");

    useEffect(() => {
        const saved = localStorage.getItem("dev-intel-theme") as Theme | null;
        if (saved === "light" || saved === "dark") {
            setThemeState(saved);
            document.documentElement.setAttribute("data-theme", saved);
            if (saved === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            setThemeState("light");
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        localStorage.setItem("dev-intel-theme", next);
        document.documentElement.setAttribute("data-theme", next);
        if (next === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

