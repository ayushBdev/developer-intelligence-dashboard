import { describe, it, expect } from "vitest";
import { ApiError, getErrorDetails } from "@/api/errors";

describe("ApiError and getErrorDetails", () => {
    it("creates an ApiError with correct properties", () => {
        const resetDate = new Date(Date.now() + 60000);
        const err = new ApiError("rate_limited", "Rate limit exceeded", {
            status: 403,
            resetAt: resetDate,
        });

        expect(err.kind).toBe("rate_limited");
        expect(err.status).toBe(403);
        expect(err.resetAt).toBe(resetDate);
        expect(err.message).toBe("Rate limit exceeded");
    });

    it("maps network error correctly", () => {
        const err = new ApiError("network", "Failed to fetch");
        const details = getErrorDetails(err);

        expect(details.title).toBe("You seem to be offline");
        expect(details.message).toContain("Check your connection");
        expect(details.canRetry).toBe(true);
    });

    it("maps rate_limited error with reset time", () => {
        const resetDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in future
        const err = new ApiError("rate_limited", "Limit exceeded", { resetAt: resetDate });
        const details = getErrorDetails(err);

        expect(details.title).toBe("GitHub rate limit reached");
        expect(details.message).toContain("Requests resume at");
        expect(details.message).toMatch(/in ~10 min/);
        expect(details.canRetry).toBe(true);
    });

    it("maps validation (422) error without auto-retry", () => {
        const err = new ApiError("validation", "Validation failed", { status: 422 });
        const details = getErrorDetails(err);

        expect(details.title).toBe("That search isn't valid");
        expect(details.canRetry).toBe(false);
        expect(details.actionLabel).toBe("Edit query");
    });

    it("maps not_found (404) error without auto-retry", () => {
        const err = new ApiError("not_found", "Not found", { status: 404 });
        const details = getErrorDetails(err);

        expect(details.title).toBe("Resource not found");
        expect(details.canRetry).toBe(false);
    });

    it("maps server (5xx) error with retry", () => {
        const err = new ApiError("server", "Internal error", { status: 500 });
        const details = getErrorDetails(err);

        expect(details.title).toBe("GitHub is having trouble");
        expect(details.canRetry).toBe(true);
    });

    it("handles generic unknown error", () => {
        const details = getErrorDetails(new Error("Custom failure"));

        expect(details.title).toBe("Something went wrong");
        expect(details.message).toBe("Custom failure");
        expect(details.canRetry).toBe(true);
    });
});

