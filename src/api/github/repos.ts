import { github } from "../client";
import { ApiError } from "../errors";
import {
    rawContributorsResponseSchema,
    rawLanguagesSchema,
    rawRepoDetailSchema,
    rawRepoSchema,
    searchResponseSchema,
} from "./schemas";
import { getLanguageColor } from "@/lib/format";
import type {
    ContributorItem,
    LanguageBreakdown,
    RepoDetail,
    RepoItem,
    SearchResult,
} from "@/types";

export interface SearchReposParams {
    q: string;
    page?: number;
    perPage?: number;
    language?: string;
    minStars?: number;
    signal?: AbortSignal;
}

export function buildRepoQuery(baseQuery: string, language?: string, minStars?: number): string {
    let finalQuery = baseQuery.trim();

    if (language && language.trim() && !finalQuery.toLowerCase().includes("language:")) {
        finalQuery += ` language:${language.trim()}`;
    }

    if (minStars !== undefined && minStars > 0 && !finalQuery.toLowerCase().includes("stars:")) {
        finalQuery += ` stars:>=${minStars}`;
    }

    return finalQuery;
}

export async function searchRepos({
    q,
    page = 1,
    perPage = 12,
    language,
    minStars,
    signal,
}: SearchReposParams): Promise<SearchResult<RepoItem>> {
    const trimmed = q.trim();
    if (!trimmed) {
        return {
            totalCount: 0,
            incompleteResults: false,
            items: [],
        };
    }

    const builtQ = buildRepoQuery(trimmed, language, minStars);

    const response = await github.get("/search/repositories", {
        params: {
            q: builtQ,
            page,
            per_page: perPage,
        },
        signal,
    });

    const parsed = searchResponseSchema(rawRepoSchema).safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse repository search response.", {
            cause: parsed.error,
        });
    }

    const items: RepoItem[] = parsed.data.items.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description ?? null,
        htmlUrl: repo.html_url,
        language: repo.language ?? null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        updatedAt: repo.updated_at,
        owner: {
            login: repo.owner.login,
            avatarUrl: repo.owner.avatar_url,
            htmlUrl: repo.owner.html_url,
        },
    }));

    return {
        totalCount: parsed.data.total_count,
        incompleteResults: parsed.data.incomplete_results,
        items,
    };
}

export async function getRepo(
    owner: string,
    name: string,
    signal?: AbortSignal
): Promise<RepoDetail> {
    const response = await github.get(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, {
        signal,
    });

    const parsed = rawRepoDetailSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse repository details response.", {
            cause: parsed.error,
        });
    }

    const data = parsed.data;
    // Real GitHub watchers is subscribers_count; watchers_count mirrors stargazers_count in GitHub's legacy API.
    const watchers = data.subscribers_count !== undefined ? data.subscribers_count : data.watchers_count;

    return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description ?? null,
        htmlUrl: data.html_url,
        language: data.language ?? null,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        defaultBranch: data.default_branch || "main",
        watchers,
        owner: {
            login: data.owner.login,
            avatarUrl: data.owner.avatar_url,
            htmlUrl: data.owner.html_url,
        },
    };
}

export async function getRepoContributors(
    owner: string,
    name: string,
    perPage: number = 6,
    signal?: AbortSignal
): Promise<ContributorItem[]> {
    const response = await github.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/contributors`,
        {
            params: { per_page: perPage },
            signal,
        }
    );

    const parsed = rawContributorsResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse repository contributors response.", {
            cause: parsed.error,
        });
    }

    return parsed.data.map((c) => ({
        id: c.id,
        login: c.login,
        avatarUrl: c.avatar_url,
        htmlUrl: c.html_url,
        contributions: c.contributions,
    }));
}

export async function getRepoLanguages(
    owner: string,
    name: string,
    signal?: AbortSignal
): Promise<LanguageBreakdown[]> {
    const response = await github.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/languages`,
        { signal }
    );

    const parsed = rawLanguagesSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse repository languages response.", {
            cause: parsed.error,
        });
    }

    const data = parsed.data;
    const totalBytes = Object.values(data).reduce((acc, bytes) => acc + bytes, 0);
    if (totalBytes === 0) {
        return [];
    }

    return Object.entries(data).map(([langName, bytes]) => ({
        name: langName,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 1000) / 10,
        color: getLanguageColor(langName),
    }));
}

