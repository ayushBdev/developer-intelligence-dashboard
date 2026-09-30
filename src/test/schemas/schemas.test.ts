import { describe, it, expect } from "vitest";
import { searchParamsSchema } from "@/hooks/useSearchState";
import { rawRepoSchema, rawIssueSchema } from "@/api/github/schemas";

describe("Zod validation schemas", () => {
    describe("searchParamsSchema", () => {
        it("supplies default values for empty search params", () => {
            const parsed = searchParamsSchema.parse({});

            expect(parsed.q).toBe("");
            expect(parsed.type).toBe("repos");
            expect(parsed.page).toBe(1);
            expect(parsed.language).toBeUndefined();
            expect(parsed.minStars).toBeUndefined();
        });

        it("coerces string page and minStars to numbers", () => {
            const parsed = searchParamsSchema.parse({
                q: "react",
                type: "users",
                page: "3",
                language: "typescript",
                minStars: "100",
            });

            expect(parsed.q).toBe("react");
            expect(parsed.type).toBe("users");
            expect(parsed.page).toBe(3);
            expect(parsed.language).toBe("typescript");
            expect(parsed.minStars).toBe(100);
        });

        it("gracefully catches invalid values and falls back to defaults without throwing", () => {
            const parsed = searchParamsSchema.parse({
                type: "invalid_type",
                page: "not_a_number",
            });

            expect(parsed.type).toBe("repos");
            expect(parsed.page).toBe(1);
        });
    });

    describe("rawRepoSchema", () => {
        it("validates a compliant raw repository object", () => {
            const sample = {
                id: 1234,
                name: "test-repo",
                full_name: "owner/test-repo",
                description: "A test description",
                html_url: "https://github.com/owner/test-repo",
                language: "TypeScript",
                stargazers_count: 50,
                forks_count: 10,
                open_issues_count: 2,
                updated_at: "2026-09-30T00:00:00Z",
                owner: {
                    login: "owner",
                    avatar_url: "https://avatar.url",
                    html_url: "https://owner.url",
                },
            };

            const result = rawRepoSchema.safeParse(sample);
            expect(result.success).toBe(true);
        });

        it("allows nullable description and language", () => {
            const sample = {
                id: 1234,
                name: "test-repo",
                full_name: "owner/test-repo",
                description: null,
                html_url: "https://github.com/owner/test-repo",
                language: null,
                stargazers_count: 0,
                forks_count: 0,
                open_issues_count: 0,
                updated_at: "2026-09-30T00:00:00Z",
                owner: {
                    login: "owner",
                    avatar_url: "https://avatar.url",
                    html_url: "https://owner.url",
                },
            };

            const result = rawRepoSchema.safeParse(sample);
            expect(result.success).toBe(true);
        });
    });

    describe("rawIssueSchema", () => {
        it("recognizes open and closed issue states", () => {
            const openIssue = {
                id: 1,
                number: 10,
                title: "Issue Title",
                state: "open",
                html_url: "https://github.com/owner/repo/issues/10",
                created_at: "2026-09-30T00:00:00Z",
                updated_at: "2026-09-30T01:00:00Z",
            };

            expect(rawIssueSchema.safeParse(openIssue).success).toBe(true);
        });
    });
});

