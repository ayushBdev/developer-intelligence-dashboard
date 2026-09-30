import { describe, it, expect } from "vitest";
import { buildRepoQuery, searchRepos, getRepo } from "@/api/github/repos";

describe("repos API endpoints and query builder", () => {
    describe("buildRepoQuery", () => {
        it("trims the query", () => {
            expect(buildRepoQuery("   react   ")).toBe("react");
        });

        it("appends language qualifier if provided and not already present", () => {
            expect(buildRepoQuery("react", "typescript")).toBe("react language:typescript");
        });

        it("does not duplicate language qualifier if already present", () => {
            expect(buildRepoQuery("react language:typescript", "typescript")).toBe("react language:typescript");
        });

        it("appends stars qualifier if provided and > 0", () => {
            expect(buildRepoQuery("react", undefined, 500)).toBe("react stars:>=500");
        });

        it("combines query with both language and min stars", () => {
            expect(buildRepoQuery("react", "rust", 1000)).toBe("react language:rust stars:>=1000");
        });
    });

    describe("searchRepos", () => {
        it("returns empty result if query is empty or whitespace", async () => {
            const res = await searchRepos({ q: "   " });
            expect(res.totalCount).toBe(0);
            expect(res.items).toEqual([]);
        });

        it("searches repositories and maps camelCase fields correctly", async () => {
            const res = await searchRepos({ q: "react" });
            expect(res.totalCount).toBe(1);
            expect(res.items).toHaveLength(1);

            const repo = res.items[0]!;
            expect(repo.name).toBe("react");
            expect(repo.fullName).toBe("facebook/react");
            expect(repo.stars).toBe(220000);
            expect(repo.forks).toBe(45000);
            expect(repo.openIssues).toBe(1200);
            expect(repo.owner.login).toBe("facebook");
        });
    });

    describe("getRepo", () => {
        it("fetches repo details and uses subscribers_count for watchers", async () => {
            const repo = await getRepo("facebook", "react");

            expect(repo.name).toBe("react");
            expect(repo.stars).toBe(220000);
            // In GitHub API, subscribers_count is the genuine watcher count (6700), whereas watchers_count mirrors stars
            expect(repo.watchers).toBe(6700);
            expect(repo.defaultBranch).toBe("main");
        });

        it("throws not_found ApiError for non-existent repo", async () => {
            await expect(getRepo("error-owner", "react")).rejects.toThrow();
        });
    });
});

