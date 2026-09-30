import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { RepoDetail } from "@/features/repo/RepoDetail";

// Mock next/navigation
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
        push: vi.fn(),
        replace: vi.fn(),
    }),
}));

describe("RepoDetail and isolated issues handling", () => {
    it("renders repository hero, stats, and issues successfully", async () => {
        renderWithProviders(<RepoDetail owner="facebook" name="react" />);

        // Wait for repository detail data to load
        await waitFor(() => {
            expect(screen.getByRole("heading", { name: "react" })).toBeInTheDocument();
        });

        // Verify stats are visible
        expect(screen.getByText("Stars")).toBeInTheDocument();
        expect(screen.getByText("Forks")).toBeInTheDocument();
        expect(screen.getByText("Watchers")).toBeInTheDocument();
        expect(screen.getByText("Open Issues")).toBeInTheDocument();

        // Wait for issues list to load
        await waitFor(() => {
            expect(
                screen.getByText("Bug: React compiler optimization bug")
            ).toBeInTheDocument();
        });

        // PR #102 must NOT be rendered
        expect(screen.queryByText("Fix: Typo in documentation")).not.toBeInTheDocument();
    });

    it("isolates issues failure so repo details hero and stats remain visible", async () => {
        // "issues-fail" triggers a 500 error in the issues endpoint mock
        renderWithProviders(<RepoDetail owner="facebook" name="issues-fail" />);

        // Repository hero should still render successfully!
        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: "issues-fail" })
            ).toBeInTheDocument();
        });

        expect(screen.getByText("Stars")).toBeInTheDocument();
        expect(screen.getByText("Watchers")).toBeInTheDocument();

        // An inline alert should be visible for issues failure with Retry button
        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
            expect(screen.getByText(/github is having trouble/i)).toBeInTheDocument();
        });

        const retryButton = screen.getByRole("button", { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
    });
});
