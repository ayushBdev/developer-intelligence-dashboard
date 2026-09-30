import React from "react";
import Link from "next/link";
import { GoStar, GoRepoForked, GoIssueOpened, GoLinkExternal } from "react-icons/go";
import { IconLink } from "@/components/IconLink";
import {
    formatCompactNumber,
    formatRelativeDate,
    formatAbsoluteDate,
    getLanguageColor,
} from "@/lib/format";
import type { RepoItem } from "@/types";

export interface RepoCardProps {
    repo: RepoItem;
}

export function RepoCard({ repo }: RepoCardProps) {
    const ownerName = repo.owner.login;
    const repoName = repo.name;
    const detailHref = `/repo/${encodeURIComponent(ownerName)}/${encodeURIComponent(repoName)}`;

    return (
        <article className="group relative flex flex-col justify-between p-5 rounded-2xl glass-1 hover:glass-2 hover:-translate-y-0.5 transition-all duration-150 border border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-accent">
            <div>
                {/* Header: Owner Avatar, Repo Name Link, External GitHub link */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <img
                            src={repo.owner.avatarUrl}
                            alt=""
                            width={32}
                            height={32}
                            loading="lazy"
                            className="w-8 h-8 rounded-full border border-white/20 bg-white/5 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <span className="block text-xs text-content-secondary truncate">
                                {ownerName}
                            </span>
                            <Link
                                href={detailHref}
                                className="block text-base font-semibold text-content-primary hover:text-accent truncate transition-colors focus-visible:outline-none focus-visible:underline"
                            >
                                {repoName}
                            </Link>
                        </div>
                    </div>

                    <IconLink
                        href={repo.htmlUrl}
                        aria-label={`Open ${repo.fullName} on GitHub`}
                        className="shrink-0 -mr-1 -mt-1"
                    >
                        <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                    </IconLink>
                </div>

                {/* Description */}
                <p className="text-sm text-content-secondary line-clamp-3 mb-4 leading-relaxed break-words min-h-[42px]">
                    {repo.description ? (
                        repo.description
                    ) : (
                        <span className="italic text-content-muted">No description provided</span>
                    )}
                </p>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-content-secondary">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Language */}
                    <div className="flex items-center gap-1.5" title={`Primary language: ${repo.language || "None"}`}>
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                            aria-hidden="true"
                        />
                        <span className="font-medium text-content-primary">
                            {repo.language || "—"}
                        </span>
                    </div>

                    {/* Stars */}
                    <div
                        className="flex items-center gap-1 text-content-secondary hover:text-content-primary transition-colors"
                        title={`${repo.stars.toLocaleString("en-US")} stars`}
                    >
                        <GoStar className="w-3.5 h-3.5 text-badge-star" aria-hidden="true" />
                        <span>{formatCompactNumber(repo.stars)}</span>
                        <span className="sr-only">stars</span>
                    </div>

                    {/* Forks */}
                    <div
                        className="flex items-center gap-1 text-content-secondary hover:text-content-primary transition-colors"
                        title={`${repo.forks.toLocaleString("en-US")} forks`}
                    >
                        <GoRepoForked className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{formatCompactNumber(repo.forks)}</span>
                        <span className="sr-only">forks</span>
                    </div>

                    {/* Open Issues */}
                    <div
                        className="flex items-center gap-1 text-content-secondary hover:text-content-primary transition-colors"
                        title={`${repo.openIssues.toLocaleString("en-US")} open issues`}
                    >
                        <GoIssueOpened className="w-3.5 h-3.5 text-badge-success" aria-hidden="true" />
                        <span>{formatCompactNumber(repo.openIssues)}</span>
                        <span className="sr-only">open issues</span>
                    </div>
                </div>

                {/* Updated At */}
                <time
                    dateTime={repo.updatedAt}
                    title={`Last updated on ${formatAbsoluteDate(repo.updatedAt)}`}
                    className="text-content-muted whitespace-nowrap ml-auto"
                >
                    Updated {formatRelativeDate(repo.updatedAt)}
                </time>
            </div>
        </article>
    );
}

