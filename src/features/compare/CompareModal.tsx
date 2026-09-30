"use client";

import React from "react";
import Link from "next/link";
import { FiX, FiCheck, FiAward } from "react-icons/fi";
import { GoStar, GoRepoForked, GoEye, GoIssueOpened, GoLinkExternal } from "react-icons/go";
import { useCompare } from "@/providers/CompareContext";
import { Button } from "@/components/Button";
import {
    formatCompactNumber,
    formatRelativeDate,
    getLanguageColor,
} from "@/lib/format";
import type { RepoItem, RepoDetail } from "@/types";

export function CompareModal() {
    const { compareList, removeFromCompare, clearCompare, isModalOpen, setIsModalOpen } =
        useCompare();

    if (!isModalOpen || compareList.length === 0) {
        return null;
    }

    const repo1 = compareList[0];
    const repo2 = compareList[1];

    const getWinnerClass = (val1: number, val2?: number) => {
        if (val2 === undefined) return "";
        if (val1 > val2) return "text-[var(--success)] font-bold";
        if (val1 < val2) return "text-[var(--text-secondary)]";
        return "text-[var(--text)]";
    };

    const getWatchers = (r?: RepoItem | RepoDetail): number | undefined => {
        if (!r) return undefined;
        return "watchers" in r ? (r as RepoDetail).watchers : undefined;
    };

    const repo1Watchers = getWatchers(repo1);
    const repo2Watchers = getWatchers(repo2);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--r-lg)] p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <div>
                        <h2 id="compare-modal-title" className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
                            <FiAward className="w-6 h-6 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)]" aria-hidden="true" />
                            <span>Repository Comparison</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                            Comparing architectural and popularity metrics side-by-side
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={clearCompare}>
                            Clear all
                        </Button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close comparison modal"
                            className="p-2 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                        >
                            <FiX className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Side by Side Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Repo 1 */}
                    {repo1 && (
                        <div className="flex flex-col justify-between p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={repo1.owner.avatarUrl}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border border-[var(--border)] object-cover"
                                    />
                                    <div className="min-w-0">
                                        <span className="text-xs text-[var(--text-secondary)] block truncate">
                                            {repo1.owner.login}
                                        </span>
                                        <Link
                                            href={`/repo/${encodeURIComponent(repo1.owner.login)}/${encodeURIComponent(repo1.name)}`}
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-lg font-bold text-[var(--text)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] truncate block"
                                        >
                                            {repo1.name}
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo1.id)}
                                    aria-label={`Remove ${repo1.name} from compare`}
                                    className="p-1 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 min-h-[38px]">
                                {repo1.description || <span className="italic text-[var(--text-muted)]">No description</span>}
                            </p>

                            <div className="space-y-2.5 pt-3 border-t border-[var(--border)] text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoStar className="w-4 h-4 text-[var(--star)]" />
                                        <span>Stars</span>
                                    </span>
                                    <span className={getWinnerClass(repo1.stars, repo2?.stars)}>
                                        {formatCompactNumber(repo1.stars)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoRepoForked className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span>Forks</span>
                                    </span>
                                    <span className={getWinnerClass(repo1.forks, repo2?.forks)}>
                                        {formatCompactNumber(repo1.forks)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoEye className="w-4 h-4 text-[var(--primary-500)]" />
                                        <span>Watchers</span>
                                    </span>
                                    <span className={getWinnerClass(repo1Watchers ?? 0, repo2Watchers)}>
                                        {repo1Watchers !== undefined ? formatCompactNumber(repo1Watchers) : "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoIssueOpened className="w-4 h-4 text-[var(--success)]" />
                                        <span>Open Issues</span>
                                    </span>
                                    <span className="text-[var(--text)]">
                                        {formatCompactNumber(repo1.openIssues)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)]">Primary Language</span>
                                    <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getLanguageColor(repo1.language) }}
                                        />
                                        {repo1.language || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)]">Last Updated</span>
                                    <span className="text-xs text-[var(--text)]">
                                        {formatRelativeDate(repo1.updatedAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href={repo1.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--r-sm)] text-xs font-medium border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--surface-muted)] text-[var(--text)] transition-colors"
                                >
                                    <span>GitHub Repository</span>
                                    <GoLinkExternal className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Repo 2 */}
                    {repo2 ? (
                        <div className="flex flex-col justify-between p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={repo2.owner.avatarUrl}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border border-[var(--border)] object-cover"
                                    />
                                    <div className="min-w-0">
                                        <span className="text-xs text-[var(--text-secondary)] block truncate">
                                            {repo2.owner.login}
                                        </span>
                                        <Link
                                            href={`/repo/${encodeURIComponent(repo2.owner.login)}/${encodeURIComponent(repo2.name)}`}
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-lg font-bold text-[var(--text)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] truncate block"
                                        >
                                            {repo2.name}
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo2.id)}
                                    aria-label={`Remove ${repo2.name} from compare`}
                                    className="p-1 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 min-h-[38px]">
                                {repo2.description || <span className="italic text-[var(--text-muted)]">No description</span>}
                            </p>

                            <div className="space-y-2.5 pt-3 border-t border-[var(--border)] text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoStar className="w-4 h-4 text-[var(--star)]" />
                                        <span>Stars</span>
                                    </span>
                                    <span className={getWinnerClass(repo2.stars, repo1?.stars)}>
                                        {formatCompactNumber(repo2.stars)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoRepoForked className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span>Forks</span>
                                    </span>
                                    <span className={getWinnerClass(repo2.forks, repo1?.forks)}>
                                        {formatCompactNumber(repo2.forks)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoEye className="w-4 h-4 text-[var(--primary-500)]" />
                                        <span>Watchers</span>
                                    </span>
                                    <span className={getWinnerClass(repo2Watchers ?? 0, repo1Watchers)}>
                                        {repo2Watchers !== undefined ? formatCompactNumber(repo2Watchers) : "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <GoIssueOpened className="w-4 h-4 text-[var(--success)]" />
                                        <span>Open Issues</span>
                                    </span>
                                    <span className="text-[var(--text)]">
                                        {formatCompactNumber(repo2.openIssues)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)]">Primary Language</span>
                                    <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getLanguageColor(repo2.language) }}
                                        />
                                        {repo2.language || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-secondary)]">Last Updated</span>
                                    <span className="text-xs text-[var(--text)]">
                                        {formatRelativeDate(repo2.updatedAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href={repo2.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--r-sm)] text-xs font-medium border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--surface-muted)] text-[var(--text)] transition-colors"
                                >
                                    <span>GitHub Repository</span>
                                    <GoLinkExternal className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 rounded-[var(--r-md)] border-2 border-dashed border-[var(--border-strong)] text-center text-[var(--text-muted)] min-h-[300px]">
                            <p className="text-sm font-medium mb-1">Add a second repository</p>
                            <p className="text-xs max-w-xs">
                                Click &ldquo;Compare&rdquo; on any other repository card to compare metrics side-by-side.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

