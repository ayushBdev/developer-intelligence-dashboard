export type SearchMode = "repos" | "users";

export interface RepoItem {
    id: number;
    name: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    language: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    updatedAt: string;
    owner: {
        login: string;
        avatarUrl: string;
        htmlUrl: string;
    };
}

export interface RepoDetail extends RepoItem {
    watchers: number;
    createdAt: string;
    defaultBranch: string;
}

export interface UserItem {
    id: number;
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    name: string | null;
    location: string | null;
    followers: number;
    following: number;
    publicRepos: number;
}

export interface IssueItem {
    id: number;
    number: number;
    title: string;
    state: "open" | "closed";
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    authorAvatarUrl?: string;
}

export interface ContributorItem {
    id: number;
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    contributions: number;
}

export interface LanguageBreakdown {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
}

export interface SearchResult<T> {
    totalCount: number;
    incompleteResults: boolean;
    items: T[];
}

export interface SearchParamsState {
    q: string;
    type: SearchMode;
    page: number;
    language?: string;
    minStars?: number;
}
