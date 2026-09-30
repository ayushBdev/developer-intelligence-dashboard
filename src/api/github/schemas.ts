import { z } from "zod";

export const ownerSchema = z.object({
    login: z.string(),
    avatar_url: z.string(),
    html_url: z.string(),
});

export const rawRepoSchema = z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable().optional(),
    html_url: z.string(),
    language: z.string().nullable().optional(),
    stargazers_count: z.number().default(0),
    forks_count: z.number().default(0),
    open_issues_count: z.number().default(0),
    updated_at: z.string(),
    owner: ownerSchema,
});

export const rawRepoDetailSchema = rawRepoSchema.extend({
    watchers_count: z.number().default(0),
    subscribers_count: z.number().optional(),
    created_at: z.string(),
    default_branch: z.string().default("main"),
});

export const rawSearchUserSchema = z.object({
    id: z.number(),
    login: z.string(),
    avatar_url: z.string(),
    html_url: z.string(),
});

export const rawUserDetailSchema = z.object({
    id: z.number(),
    login: z.string(),
    avatar_url: z.string(),
    html_url: z.string(),
    name: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    public_repos: z.number().default(0),
    followers: z.number().default(0),
    following: z.number().default(0),
});

export const searchResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
    z.object({
        total_count: z.number(),
        incomplete_results: z.boolean(),
        items: z.array(item),
    });

export const rawIssueSchema = z.object({
    id: z.number(),
    number: z.number(),
    title: z.string(),
    state: z.enum(["open", "closed"]),
    html_url: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    user: z
        .object({
            login: z.string(),
            avatar_url: z.string().optional(),
        })
        .nullable()
        .optional(),
    pull_request: z.unknown().optional(),
});

export const rawIssuesResponseSchema = z.array(rawIssueSchema);

export type RawRepo = z.infer<typeof rawRepoSchema>;
export type RawRepoDetail = z.infer<typeof rawRepoDetailSchema>;
export type RawSearchUser = z.infer<typeof rawSearchUserSchema>;
export type RawUserDetail = z.infer<typeof rawUserDetailSchema>;
export type RawIssue = z.infer<typeof rawIssueSchema>;

