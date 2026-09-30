import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, renderHook, act } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { FavoritesProvider, useFavorites } from "@/providers/FavoritesContext";
import { CompareProvider, useCompare } from "@/providers/CompareContext";
import { SearchForm } from "@/features/search/SearchForm";
import { getRepoContributors, getRepoLanguages } from "@/api/github/repos";
import type { RepoItem } from "@/types";

const mockRepo1: RepoItem = {
    id: 101,
    name: "react",
    fullName: "facebook/react",
    description: "React library",
    htmlUrl: "https://github.com/facebook/react",
    language: "JavaScript",
    stars: 220000,
    forks: 45000,
    openIssues: 1200,
    updatedAt: "2026-09-30T10:00:00Z",
    owner: {
        login: "facebook",
        avatarUrl: "https://avatar.url",
        htmlUrl: "https://github.com/facebook",
    },
};

const mockRepo2: RepoItem = {
    id: 102,
    name: "vue",
    fullName: "vuejs/core",
    description: "Vue library",
    htmlUrl: "https://github.com/vuejs/core",
    language: "TypeScript",
    stars: 210000,
    forks: 35000,
    openIssues: 600,
    updatedAt: "2026-09-30T10:00:00Z",
    owner: {
        login: "vuejs",
        avatarUrl: "https://avatar.url",
        htmlUrl: "https://github.com/vuejs",
    },
};

describe("Optional Enhancements", () => {
    describe("Repository Favorites (LocalStorage)", () => {
        it("toggles and checks favorites correctly", () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <FavoritesProvider>{children}</FavoritesProvider>
            );

            const { result } = renderHook(() => useFavorites(), { wrapper });

            expect(result.current.isFavorite("facebook/react")).toBe(false);

            act(() => {
                result.current.toggleFavorite(mockRepo1);
            });

            expect(result.current.isFavorite("facebook/react")).toBe(true);
            expect(result.current.favorites).toHaveLength(1);
            expect(result.current.favorites[0]?.fullName).toBe("facebook/react");

            // Toggling again removes it
            act(() => {
                result.current.toggleFavorite(mockRepo1);
            });

            expect(result.current.isFavorite("facebook/react")).toBe(false);
            expect(result.current.favorites).toHaveLength(0);
        });

        it("clears all favorites", () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <FavoritesProvider>{children}</FavoritesProvider>
            );

            const { result } = renderHook(() => useFavorites(), { wrapper });

            act(() => {
                result.current.toggleFavorite(mockRepo1);
                result.current.toggleFavorite(mockRepo2);
            });

            expect(result.current.favorites).toHaveLength(2);

            act(() => {
                result.current.clearFavorites();
            });

            expect(result.current.favorites).toHaveLength(0);
        });
    });

    describe("Repository Comparison", () => {
        it("adds up to 2 repositories and respects max 2", () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <CompareProvider>{children}</CompareProvider>
            );

            const { result } = renderHook(() => useCompare(), { wrapper });

            act(() => {
                result.current.addToCompare(mockRepo1);
            });

            expect(result.current.isInCompare(mockRepo1.id)).toBe(true);
            expect(result.current.compareList).toHaveLength(1);

            act(() => {
                result.current.addToCompare(mockRepo2);
            });

            expect(result.current.compareList).toHaveLength(2);

            // Adding a 3rd replaces the 2nd repo
            const mockRepo3: RepoItem = { ...mockRepo1, id: 103, fullName: "angular/angular" };
            act(() => {
                result.current.addToCompare(mockRepo3);
            });

            expect(result.current.compareList).toHaveLength(2);
            expect(result.current.compareList[0]?.id).toBe(101);
            expect(result.current.compareList[1]?.id).toBe(103);

            act(() => {
                result.current.clearCompare();
            });

            expect(result.current.compareList).toHaveLength(0);
        });
    });

    describe("Additional Public API Integration", () => {
        it("fetches top repository contributors", async () => {
            const contributors = await getRepoContributors("facebook", "react", 6);

            expect(contributors).toHaveLength(2);
            expect(contributors[0]?.login).toBe("gaearon");
            expect(contributors[0]?.contributions).toBe(1820);
        });

        it("fetches repository languages breakdown and computes percentages", async () => {
            const languages = await getRepoLanguages("facebook", "react");

            expect(languages).toHaveLength(2);
            // Total: 750,000 + 250,000 = 1,000,000
            // JavaScript: 75%, TypeScript: 25%
            const js = languages.find((l) => l.name === "JavaScript");
            const ts = languages.find((l) => l.name === "TypeScript");

            expect(js?.percentage).toBe(75);
            expect(ts?.percentage).toBe(25);
        });
    });

    describe("Keyboard Navigation", () => {
        it("focuses search input when '/' key is pressed", () => {
            renderWithProviders(
                <SearchForm
                    initialQuery=""
                    mode="repos"
                    onQueryChange={vi.fn()}
                    onModeChange={vi.fn()}
                    onLanguageChange={vi.fn()}
                    onMinStarsChange={vi.fn()}
                    onClearAllFilters={vi.fn()}
                />
            );

            const input = screen.getByRole("textbox");
            expect(document.activeElement).not.toBe(input);

            fireEvent.keyDown(window, { key: "/" });
            expect(document.activeElement).toBe(input);
        });
    });
});

