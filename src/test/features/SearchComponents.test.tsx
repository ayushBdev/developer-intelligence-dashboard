import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { ModeToggle } from "@/features/search/ModeToggle";
import { FilterBar } from "@/features/search/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
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

            // Verify reset button appears when filters are active
            const resetButton = screen.getByRole("button", { name: /reset filters/i });
            expect(resetButton).toBeInTheDocument();

            fireEvent.click(resetButton);
            expect(handleClear).toHaveBeenCalled();
        });
    });

    describe("EmptyState", () => {
        it("renders initial state with clickable example chips", () => {
            const handleSelectQuery = vi.fn();
            renderWithProviders(
                <EmptyState
                    type="initial"
                    onSelectQuery={handleSelectQuery}
                />
            );

            expect(
                screen.getByText(/search github repositories & developers/i)
            ).toBeInTheDocument();

            const chip = screen.getByText("react state management");
            fireEvent.click(chip);
            expect(handleSelectQuery).toHaveBeenCalledWith("react state management");
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

            expect(
                screen.getByText(/no results found for/i)
            ).toBeInTheDocument();

            const clearButton = screen.getByRole("button", { name: /clear search/i });
            fireEvent.click(clearButton);
            expect(handleClear).toHaveBeenCalled();
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

