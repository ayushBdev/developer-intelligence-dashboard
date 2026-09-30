import { describe, it, expect } from "vitest";
import { getRepoIssues } from "@/api/github/issues";

describe("getRepoIssues and PR filtering", () => {
    it("fetches issues and filters out pull requests", async () => {
        const issues = await getRepoIssues({
            owner: "facebook",
            name: "react",
            perPage: 10,
        });

        // The mock returned 3 items: 2 pure issues, 1 with pull_request
        expect(issues).toHaveLength(2);

        // Issue #101 should be present
        expect(issues[0]?.number).toBe(101);
        expect(issues[0]?.title).toBe("Bug: React compiler optimization bug");
        expect(issues[0]?.author).toBe("developer1");

        // Issue #102 had pull_request, so it MUST be filtered out
        const hasPr = issues.some((i) => i.number === 102);
        expect(hasPr).toBe(false);

        // Issue #103 should be present
        expect(issues[1]?.number).toBe(103);
        expect(issues[1]?.title).toBe("Feature: Add support for custom hook tracking");
    });

    it("returns an empty array when repo has no issues", async () => {
        const issues = await getRepoIssues({
            owner: "facebook",
            name: "quiet-repo",
        });

        expect(issues).toEqual([]);
    });

    it("throws ApiError when endpoint returns server error", async () => {
        await expect(
            getRepoIssues({
                owner: "facebook",
                name: "issues-fail",
            })
        ).rejects.toThrow();
    });
});

