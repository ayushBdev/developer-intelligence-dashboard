import { http, HttpResponse } from "msw";

export const handlers = [
    // Search Repositories
    http.get("https://api.github.com/search/repositories", ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") || "";

        if (q.includes("rate-limit-test")) {
            return new HttpResponse(
                JSON.stringify({ message: "API rate limit exceeded" }),
                {
                    status: 403,
                    headers: {
                        "content-type": "application/json",
                        "x-ratelimit-reset": "1893456000",
                    },
                }
            );
        }

        if (q.includes("validation-error")) {
            return HttpResponse.json(
                { message: "Validation Failed" },
                { status: 422 }
            );
        }

        if (q.includes("empty-test")) {
            return HttpResponse.json({
                total_count: 0,
                incomplete_results: false,
                items: [],
            });
        }

        return HttpResponse.json({
            total_count: 1,
            incomplete_results: false,
            items: [
                {
                    id: 10270250,
                    name: "react",
                    full_name: "facebook/react",
                    description: "The library for web and native user interfaces.",
                    html_url: "https://github.com/facebook/react",
                    language: "JavaScript",
                    stargazers_count: 220000,
                    forks_count: 45000,
                    open_issues_count: 1200,
                    updated_at: "2026-09-30T10:00:00Z",
                    owner: {
                        login: "facebook",
                        avatar_url: "https://avatars.githubusercontent.com/u/69631",
                        html_url: "https://github.com/facebook",
                    },
                },
            ],
        });
    }),

    // Search Users
    http.get("https://api.github.com/search/users", () => {
        return HttpResponse.json({
            total_count: 1,
            incomplete_results: false,
            items: [
                {
                    id: 810438,
                    login: "gaearon",
                    avatar_url: "https://avatars.githubusercontent.com/u/810438",
                    html_url: "https://github.com/gaearon",
                },
            ],
        });
    }),

    // User Details (Enrichment)
    http.get("https://api.github.com/users/:login", ({ params }) => {
        const { login } = params;
        return HttpResponse.json({
            id: 810438,
            login,
            avatar_url: `https://avatars.githubusercontent.com/u/810438`,
            html_url: `https://github.com/${login}`,
            name: "Dan Abramov",
            location: "London, UK",
            public_repos: 260,
            followers: 84000,
            following: 172,
        });
    }),

    // Repo Details
    http.get("https://api.github.com/repos/:owner/:name", ({ params }) => {
        const { owner, name } = params;

        if (owner === "error-owner") {
            return HttpResponse.json(
                { message: "Not Found" },
                { status: 404 }
            );
        }

        return HttpResponse.json({
            id: 10270250,
            name,
            full_name: `${owner}/${name}`,
            description: "A declarative, efficient, and flexible JavaScript library.",
            html_url: `https://github.com/${owner}/${name}`,
            language: "JavaScript",
            stargazers_count: 220000,
            forks_count: 45000,
            open_issues_count: 1200,
            watchers_count: 220000,
            subscribers_count: 6700,
            created_at: "2013-05-24T16:15:54Z",
            updated_at: "2026-09-30T10:00:00Z",
            default_branch: "main",
            owner: {
                login: owner,
                avatar_url: "https://avatars.githubusercontent.com/u/69631",
                html_url: `https://github.com/${owner}`,
            },
        });
    }),

    // Repo Issues (Includes PR to verify PR filtering)
    http.get("https://api.github.com/repos/:owner/:name/issues", ({ params }) => {
        const { name } = params;

        if (name === "issues-fail") {
            return HttpResponse.json(
                { message: "Server error occurred" },
                { status: 500 }
            );
        }

        if (name === "quiet-repo") {
            return HttpResponse.json([]);
        }

        return HttpResponse.json([
            {
                id: 1,
                number: 101,
                title: "Bug: React compiler optimization bug",
                state: "open",
                html_url: "https://github.com/facebook/react/issues/101",
                created_at: "2026-09-28T12:00:00Z",
                updated_at: "2026-09-30T09:00:00Z",
                user: {
                    login: "developer1",
                    avatar_url: "https://avatars.githubusercontent.com/u/1",
                },
                // Pure issue (no pull_request property)
            },
            {
                id: 2,
                number: 102,
                title: "Fix: Typo in documentation",
                state: "closed",
                html_url: "https://github.com/facebook/react/pull/102",
                created_at: "2026-09-27T12:00:00Z",
                updated_at: "2026-09-29T09:00:00Z",
                user: {
                    login: "developer2",
                    avatar_url: "https://avatars.githubusercontent.com/u/2",
                },
                // Pull request item (must be filtered out!)
                pull_request: {
                    url: "https://api.github.com/repos/facebook/react/pulls/102",
                },
            },
            {
                id: 3,
                number: 103,
                title: "Feature: Add support for custom hook tracking",
                state: "open",
                html_url: "https://github.com/facebook/react/issues/103",
                created_at: "2026-09-26T12:00:00Z",
                updated_at: "2026-09-28T09:00:00Z",
                user: {
                    login: "developer3",
                    avatar_url: "https://avatars.githubusercontent.com/u/3",
                },
            },
        ]);
    }),
];

