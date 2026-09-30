export const qk = {
    repos: (params: { q: string; page: number; language?: string; minStars?: number }) =>
        ["repos", params] as const,
    users: (params: { q: string; page: number }) =>
        ["users", params] as const,
    user: (login: string) =>
        ["user", login] as const,
    repo: (owner: string, name: string) =>
        ["repo", owner, name] as const,
    issues: (owner: string, name: string) =>
        ["issues", owner, name] as const,
};

