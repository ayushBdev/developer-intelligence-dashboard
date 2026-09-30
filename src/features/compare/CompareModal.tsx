"use client";

import React from "react";
import Link from "next/link";
import { FiX, FiCheck, FiExternalLink, FiAward } from "react-icons/fi";
import { GoStar, GoRepoForked, GoEye, GoIssueOpened, GoGitBranch } from "react-icons/go";
import { useCompare } from "@/providers/CompareContext";
import { Button } from "@/components/Button";
import {
    formatCompactNumber,
    formatRelativeDate,
    formatAbsoluteDate,
    getLanguageColor,
} from "@/lib/format";

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
        if (val1 > val2) return "text-badge-success font-bold";
        if (val1 < val2) return "text-content-secondary";
        return "text-content-primary";
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-2 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                        <h2 id="compare-modal-title" className="text-xl sm:text-2xl font-bold text-content-primary flex items-center gap-2">
                            <FiAward className="w-6 h-6 text-accent" aria-hidden="true" />
                            <span>Repository Comparison</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-content-secondary mt-1">
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
                            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <FiX className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Side by Side Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Repo 1 */}
                    {repo1 && (
                        <div className="flex flex-col justify-between p-5 rounded-xl glass-1 border border-white/15 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={repo1.owner.avatarUrl}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border border-white/20 object-cover"
                                    />
                                    <div className="min-w-0">
                                        <span className="text-xs text-content-secondary block truncate">
                                            {repo1.owner.login}
                                        </span>
                                        <Link
                                            href={`/repo/${encodeURIComponent(repo1.owner.login)}/${encodeURIComponent(repo1.name)}`}
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-lg font-bold text-content-primary hover:text-accent truncate block"
                                        >
                                            {repo1.name}
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo1.id)}
                                    aria-label={`Remove ${repo1.name} from compare`}
                                    className="p-1 rounded text-content-muted hover:text-content-primary transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-content-secondary line-clamp-2 min-h-[32px]">
                                {repo1.description || "No description provided"}
                            </p>

                            {/* Comparison Stats List */}
                            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoStar className="w-4 h-4 text-badge-star" /> Stars
                                    </span>
                                    <span className={getWinnerClass(repo1.stars, repo2?.stars)}>
                                        {formatCompactNumber(repo1.stars)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoRepoForked className="w-4 h-4 text-accent" /> Forks
                                    </span>
                                    <span className={getWinnerClass(repo1.forks, repo2?.forks)}>
                                        {formatCompactNumber(repo1.forks)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoIssueOpened className="w-4 h-4 text-badge-success" /> Open Issues
                                    </span>
                                    <span>{formatCompactNumber(repo1.openIssues)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-content-muted">Language</span>
                                    <span className="flex items-center gap-1 font-medium text-content-primary">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getLanguageColor(repo1.language) }}
                                        />
                                        {repo1.language || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-content-muted">Updated</span>
                                    <span>{formatRelativeDate(repo1.updatedAt)}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <Link
                                    href={`/repo/${encodeURIComponent(repo1.owner.login)}/${encodeURIComponent(repo1.name)}`}
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-xs text-accent hover:underline font-medium"
                                >
                                    View Full Details →
                                </Link>

                                <a
                                    href={repo1.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-content-muted hover:text-content-primary"
                                >
                                    <span>GitHub</span>
                                    <FiExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Repo 2 */}
                    {repo2 ? (
                        <div className="flex flex-col justify-between p-5 rounded-xl glass-1 border border-white/15 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={repo2.owner.avatarUrl}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border border-white/20 object-cover"
                                    />
                                    <div className="min-w-0">
                                        <span className="text-xs text-content-secondary block truncate">
                                            {repo2.owner.login}
                                        </span>
                                        <Link
                                            href={`/repo/${encodeURIComponent(repo2.owner.login)}/${encodeURIComponent(repo2.name)}`}
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-lg font-bold text-content-primary hover:text-accent truncate block"
                                        >
                                            {repo2.name}
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo2.id)}
                                    aria-label={`Remove ${repo2.name} from compare`}
                                    className="p-1 rounded text-content-muted hover:text-content-primary transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-content-secondary line-clamp-2 min-h-[32px]">
                                {repo2.description || "No description provided"}
                            </p>

                            {/* Comparison Stats List */}
                            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoStar className="w-4 h-4 text-badge-star" /> Stars
                                    </span>
                                    <span className={getWinnerClass(repo2.stars, repo1?.stars)}>
                                        {formatCompactNumber(repo2.stars)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoRepoForked className="w-4 h-4 text-accent" /> Forks
                                    </span>
                                    <span className={getWinnerClass(repo2.forks, repo1?.forks)}>
                                        {formatCompactNumber(repo2.forks)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-content-muted">
                                        <GoIssueOpened className="w-4 h-4 text-badge-success" /> Open Issues
                                    </span>
                                    <span>{formatCompactNumber(repo2.openIssues)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-content-muted">Language</span>
                                    <span className="flex items-center gap-1 font-medium text-content-primary">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getLanguageColor(repo2.language) }}
                                        />
                                        {repo2.language || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-content-muted">Updated</span>
                                    <span>{formatRelativeDate(repo2.updatedAt)}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <Link
                                    href={`/repo/${encodeURIComponent(repo2.owner.login)}/${encodeURIComponent(repo2.name)}`}
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-xs text-accent hover:underline font-medium"
                                >
                                    View Full Details →
                                </Link>

                                <a
                                    href={repo2.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-content-muted hover:text-content-primary"
                                >
                                    <span>GitHub</span>
                                    <FiExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-white/20 text-center min-h-[260px]">
                            <p className="text-sm font-semibold text-content-primary mb-1">
                                Select another repository
                            </p>
                            <p className="text-xs text-content-muted max-w-xs mb-4">
                                Click &ldquo;+ Compare&rdquo; on any repository card to compare metrics side-by-side.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
