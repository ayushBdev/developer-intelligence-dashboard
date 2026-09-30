import React from "react";
import Link from "next/link";
import { GoStar, GoRepoForked, GoIssueOpened, GoLinkExternal } from "react-icons/go";
import { FiBookmark, FiPlus, FiCheck } from "react-icons/fi";
import { IconLink } from "@/components/IconLink";
import { useFavorites } from "@/providers/FavoritesContext";
import { useCompare } from "@/providers/CompareContext";
import {
    formatCompactNumber,
    formatRelativeDate,
    getLanguageColor,
} from "@/lib/format";
import type { RepoItem } from "@/types";

export interface RepoCardProps {
    repo: RepoItem;
}

export function RepoCard({ repo }: RepoCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isInCompare, addToCompare } = useCompare();

    const favorited = isFavorite(repo.fullName);
    const comparing = isInCompare(repo.id);

    const ownerName = repo.owner.login;
    const repoName = repo.name;
    const detailHref = `/repo/${encodeURIComponent(ownerName)}/${encodeURIComponent(repoName)}`;

    return (
        <article className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary-200)] hover:shadow-[var(--shadow-md)] transition-all duration-150 focus-within:ring-2 focus-within:ring-[var(--primary-500)]">
            <div>
                {/* Header: Owner Avatar, Repo Name Link, Actions */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <img
                            src={repo.owner.avatarUrl}
                            alt=""
                            width={32}
                            height={32}
                            loading="lazy"
                            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <span className="block text-xs text-[var(--text-secondary)] truncate">
                                {ownerName}
                            </span>
                            <Link
                                href={detailHref}
                                className="block text-base font-semibold text-[var(--text)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] truncate transition-colors focus-visible:outline-none focus-visible:underline"
                            >
                                {repoName}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 -mr-1 -mt-1">
                        {/* Favorite button */}
                        <button
                            type="button"
                            onClick={() => toggleFavorite(repo)}
                            aria-label={favorited ? `Remove ${repo.fullName} from favorites` : `Save ${repo.fullName} to favorites`}
                            className={`p-1.5 rounded-[var(--r-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] ${
                                favorited
                                    ? "text-[var(--star)] bg-[var(--primary-50)] dark:bg-[var(--primary-500)]/15"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
                            }`}
                        >
                            <FiBookmark
                                className={`w-4 h-4 ${favorited ? "fill-current" : ""}`}
                                aria-hidden="true"
                            />
                        </button>

                        {/* GitHub external link */}
                        <IconLink
                            href={repo.htmlUrl}
                            aria-label={`Open ${repo.fullName} on GitHub`}
                        >
                            <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                        </IconLink>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 leading-relaxed break-words min-h-[42px]">
                    {repo.description ? (
                        repo.description
                    ) : (
                        <span className="italic text-[var(--text-muted)]">No description provided</span>
                    )}
                </p>
            </div>

            {/* Footer Stats and Compare toggle */}
            <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Language */}
                        <div className="flex items-center gap-1.5" title={`Primary language: ${repo.language || "None"}`}>
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                                aria-hidden="true"
                            />
                            <span className="font-medium text-[var(--text)]">
                                {repo.language || "—"}
                            </span>
                        </div>

                        {/* Stars */}
                        <div
                            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                            title={`${repo.stars.toLocaleString("en-US")} stars`}
                        >
                            <GoStar className="w-3.5 h-3.5 text-[var(--star)]" aria-hidden="true" />
                            <span>{formatCompactNumber(repo.stars)}</span>
                            <span className="sr-only">stars</span>
                        </div>

                        {/* Forks */}
                        <div
                            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                            title={`${repo.forks.toLocaleString("en-US")} forks`}
                        >
                            <GoRepoForked className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                            <span>{formatCompactNumber(repo.forks)}</span>
                            <span className="sr-only">forks</span>
                        </div>

                        {/* Open Issues */}
                        <div
                            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                            title={`${repo.openIssues.toLocaleString("en-US")} open issues`}
                        >
                            <GoIssueOpened className="w-3.5 h-3.5 text-[var(--success)]" aria-hidden="true" />
                            <span>{formatCompactNumber(repo.openIssues)}</span>
                            <span className="sr-only">open issues</span>
                        </div>
                    </div>

                    {/* Updated relative date */}
                    <div
                        className="text-[11px] text-[var(--text-muted)] shrink-0 ml-auto"
                        title={new Date(repo.updatedAt).toLocaleDateString()}
                    >
                        Updated {formatRelativeDate(repo.updatedAt)}
                    </div>
                </div>

                {/* Compare Action Button */}
                <div className="pt-2 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => addToCompare(repo)}
                        aria-label={comparing ? `Remove ${repo.name} from comparison` : `Add ${repo.name} to comparison`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--r-sm)] text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] ${
                            comparing
                                ? "bg-[var(--primary-50)] dark:bg-[var(--primary-500)]/15 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] border-[var(--primary-200)] dark:border-[var(--primary-500)]/30 font-semibold"
                                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                        }`}
                    >
                        {comparing ? (
                            <>
                                <FiCheck className="w-3 h-3 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)]" aria-hidden="true" />
                                <span>Comparing</span>
                            </>
                        ) : (
                            <>
                                <FiPlus className="w-3 h-3 text-[var(--text-muted)]" aria-hidden="true" />
                                <span>Compare</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}

