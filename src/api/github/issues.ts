import { github } from "../client";
import { ApiError } from "../errors";
import { rawIssuesResponseSchema } from "./schemas";
import type { IssueItem } from "@/types";

export interface GetRepoIssuesParams {
    owner: string;
    name: string;
    perPage?: number;
    signal?: AbortSignal;
}

export async function getRepoIssues({
    owner,
    name,
    perPage = 15,
    signal,
}: GetRepoIssuesParams): Promise<IssueItem[]> {
    // GitHub issues endpoint includes pull requests, so we over-fetch slightly
    const fetchCount = Math.min(100, Math.max(30, perPage * 2));

    const response = await github.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/issues`,
        {
            params: {
                state: "all",
                sort: "updated",
                direction: "desc",
                per_page: fetchCount,
            },
            signal,
        }
    );

    const parsed = rawIssuesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse repository issues response.", {
            cause: parsed.error,
        });
    }

    // Filter out pull requests (items containing a `pull_request` key)
    const pureIssues = parsed.data.filter((item) => !item.pull_request);

    const issues: IssueItem[] = pureIssues.slice(0, perPage).map((issue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        htmlUrl: issue.html_url,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        author: issue.user?.login || "ghost",
        authorAvatarUrl: issue.user?.avatar_url,
    }));

    return issues;
}

