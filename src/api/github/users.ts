import { github } from "../client";
import { ApiError } from "../errors";
import {
    rawSearchUserSchema,
    rawUserDetailSchema,
    searchResponseSchema,
} from "./schemas";
import type { SearchResult, UserItem } from "@/types";

export interface SearchUsersParams {
    q: string;
    page?: number;
    perPage?: number;
    signal?: AbortSignal;
}

export async function searchUsers({
    q,
    page = 1,
    perPage = 10,
    signal,
}: SearchUsersParams): Promise<SearchResult<UserItem>> {
    const trimmed = q.trim();
    if (!trimmed) {
        return {
            totalCount: 0,
            incompleteResults: false,
            items: [],
        };
    }

    const response = await github.get("/search/users", {
        params: {
            q: trimmed,
            page,
            per_page: perPage,
        },
        signal,
    });

    const parsed = searchResponseSchema(rawSearchUserSchema).safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", "Failed to parse users search response.", {
            cause: parsed.error,
        });
    }

    const items: UserItem[] = parsed.data.items.map((user) => ({
        id: user.id,
        login: user.login,
        avatarUrl: user.avatar_url,
        htmlUrl: user.html_url,
        name: null,
        location: null,
        followers: 0,
        following: 0,
        publicRepos: 0,
    }));

    return {
        totalCount: parsed.data.total_count,
        incompleteResults: parsed.data.incomplete_results,
        items,
    };
}

export async function getUser(login: string, signal?: AbortSignal): Promise<UserItem> {
    const response = await github.get(`/users/${encodeURIComponent(login)}`, {
        signal,
    });

    const parsed = rawUserDetailSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new ApiError("invalid_response", `Failed to parse user details for ${login}.`, {
            cause: parsed.error,
        });
    }

    const data = parsed.data;
    return {
        id: data.id,
        login: data.login,
        avatarUrl: data.avatar_url,
        htmlUrl: data.html_url,
        name: data.name ?? null,
        location: data.location ?? null,
        followers: data.followers,
        following: data.following,
        publicRepos: data.public_repos,
    };
}

