import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { ModeToggle } from "@/features/search/ModeToggle";
import { FilterBar } from "@/features/search/FilterBar";
import { SearchForm } from "@/features/search/SearchForm";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ResultsList } from "@/features/search/ResultsList";
import { ApiError } from "@/api/errors";

describe("Search feature components", () => {
    describe("ModeToggle", () => {
        it("renders with radiogroup semantics and switches mode", () => {
            const handleChange = vi.fn();
            renderWithProviders(
                <ModeToggle value="repos" onChange={handleChange} />
            );

            const repoRadio = screen.getByRole("radio", { name: /repositories/i });
            const userRadio = screen.getByRole("radio", { name: /users/i });

            expect(repoRadio).toHaveAttribute("aria-checked", "true");
            expect(userRadio).toHaveAttribute("aria-checked", "false");

            fireEvent.click(userRadio);
            expect(handleChange).toHaveBeenCalledWith("users");
        });
    });

    describe("FilterBar", () => {
        it("allows selecting language and min stars, and clears filters", () => {
            const handleLanguageChange = vi.fn();
            const handleMinStarsChange = vi.fn();
            const handleClear = vi.fn();

            renderWithProviders(
                <FilterBar
                    language="typescript"
                    minStars={500}
                    onLanguageChange={handleLanguageChange}
                    onMinStarsChange={handleMinStarsChange}
                    onClearAll={handleClear}
                />
            );

            const resetButton = screen.getByRole("button", { name: /reset filters/i });
            expect(resetButton).toBeInTheDocument();

            fireEvent.click(resetButton);
            expect(handleClear).toHaveBeenCalled();
        });
    });

    describe("EmptyState", () => {
        it("renders repository suggestions when mode is repos", () => {
            const handleSelectQuery = vi.fn();
            renderWithProviders(
                <EmptyState
                    type="initial"
                    mode="repos"
                    onSelectQuery={handleSelectQuery}
                />
            );

            expect(screen.getByText(/search github repositories/i)).toBeInTheDocument();
            const chip = screen.getByText("react state management");
            fireEvent.click(chip);
            expect(handleSelectQuery).toHaveBeenCalledWith("react state management");
        });

        it("renders user suggestions when mode is users", () => {
            const handleSelectQuery = vi.fn();
            renderWithProviders(
                <EmptyState
                    type="initial"
                    mode="users"
                    onSelectQuery={handleSelectQuery}
                />
            );

            expect(screen.getByText(/search github developers/i)).toBeInTheDocument();
            expect(screen.getByText("torvalds")).toBeInTheDocument();
            expect(screen.getByText("gaearon")).toBeInTheDocument();
            expect(screen.queryByText("react state management")).not.toBeInTheDocument();

            fireEvent.click(screen.getByText("torvalds"));
            expect(handleSelectQuery).toHaveBeenCalledWith("torvalds");
        });

        it("renders no-results state with clear button", () => {
            const handleClear = vi.fn();
            renderWithProviders(
                <EmptyState
                    type="no-results"
                    query="xyz123nonexistent"
                    onClear={handleClear}
                />
            );

            expect(screen.getByText(/no repositories match/i)).toBeInTheDocument();
            const clearButton = screen.getByRole("button", { name: /clear search/i });
            fireEvent.click(clearButton);
            expect(handleClear).toHaveBeenCalled();
        });
    });

    describe("SearchForm", () => {
        it("clears search input and notifies onQueryChange immediately when cross icon is clicked", () => {
            const handleQueryChange = vi.fn();
            const handleModeChange = vi.fn();

            render(
                <SearchForm
                    initialQuery="react"
                    mode="repos"
                    onQueryChange={handleQueryChange}
                    onModeChange={handleModeChange}
                    onLanguageChange={vi.fn()}
                    onMinStarsChange={vi.fn()}
                    onClearAllFilters={vi.fn()}
                />
            );

            const input = screen.getByRole("textbox") as HTMLInputElement;
            expect(input.value).toBe("react");

            const clearButton = screen.getByLabelText(/clear search input/i);
            expect(clearButton).toBeInTheDocument();

            fireEvent.click(clearButton);
            expect(input.value).toBe("");
            expect(handleQueryChange).toHaveBeenCalledWith("", true);
        });
    });

    describe("ResultsList", () => {
        it("shows skeleton loaders preview when search query is empty", () => {
            render(
                <ResultsList
                    mode="repos"
                    query=""
                    items={[]}
                    isLoading={false}
                    isFetching={false}
                    isError={false}
                    error={null}
                    onRetry={vi.fn()}
                    onClearSearch={vi.fn()}
                    onSelectExampleQuery={vi.fn()}
                />
            );

            // Expect empty state suggestions to be present
            expect(screen.getByText(/search github repositories/i)).toBeInTheDocument();
            // Expect skeleton preview region to be present with aria-busy="true"
            expect(screen.getByLabelText(/preview skeleton for repositories/i)).toBeInTheDocument();
        });

        it("shows skeleton loaders when loading new search results", () => {
            render(
                <ResultsList
                    mode="repos"
                    query="react"
                    items={[]}
                    isLoading={true}
                    isFetching={true}
                    isError={false}
                    error={null}
                    onRetry={vi.fn()}
                    onClearSearch={vi.fn()}
                    onSelectExampleQuery={vi.fn()}
                />
            );

            expect(screen.getByLabelText(/loading repositories/i)).toBeInTheDocument();
        });
    });

    describe("ErrorState", () => {
        it("renders inline error with retry button", () => {
            const handleRetry = vi.fn();
            const networkError = new ApiError("network", "Failed to connect");

            renderWithProviders(
                <ErrorState
                    error={networkError}
                    variant="inline"
                    onRetry={handleRetry}
                />
            );

            expect(screen.getByRole("alert")).toBeInTheDocument();
            expect(screen.getByText(/you seem to be offline/i)).toBeInTheDocument();

            const retryBtn = screen.getByRole("button", { name: /retry/i });
            fireEvent.click(retryBtn);
            expect(handleRetry).toHaveBeenCalled();
        });
    });
});

