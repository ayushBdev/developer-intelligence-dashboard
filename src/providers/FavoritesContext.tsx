"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { RepoDetail, RepoItem } from "@/types";

interface FavoritesContextType {
    favorites: RepoItem[];
    isFavorite: (fullName: string) => boolean;
    toggleFavorite: (repo: RepoItem | RepoDetail) => void;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "dev-intel-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<RepoItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            }
        } catch (e) {
            console.warn("Failed to load favorites from localStorage", e);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    const saveFavorites = (next: RepoItem[]) => {
        setFavorites(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
            console.warn("Failed to persist favorites to localStorage", e);
        }
    };

    const isFavorite = (fullName: string): boolean => {
        return favorites.some((item) => item.fullName.toLowerCase() === fullName.toLowerCase());
    };

    const toggleFavorite = (repo: RepoItem | RepoDetail) => {
        setFavorites((prev) => {
            const exists = prev.some(
                (item) => item.fullName.toLowerCase() === repo.fullName.toLowerCase()
            );
            let next: RepoItem[];
            if (exists) {
                next = prev.filter(
                    (f) => f.fullName.toLowerCase() !== repo.fullName.toLowerCase()
                );
            } else {
                const minimalItem: RepoItem = {
                    id: repo.id,
                    name: repo.name,
                    fullName: repo.fullName,
                    description: repo.description,
                    htmlUrl: repo.htmlUrl,
                    language: repo.language,
                    stars: repo.stars,
                    forks: repo.forks,
                    openIssues: repo.openIssues,
                    updatedAt: repo.updatedAt,
                    owner: repo.owner,
                };
                next = [minimalItem, ...prev];
            }
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch (e) {
                console.warn("Failed to persist favorites to localStorage", e);
            }
            return next;
        });
    };

    const clearFavorites = () => {
        setFavorites([]);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        } catch (e) {
            console.warn("Failed to clear favorites from localStorage", e);
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
