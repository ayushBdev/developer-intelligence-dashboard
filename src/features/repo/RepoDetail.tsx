"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    GoArrowLeft,
    GoStar,
    GoRepoForked,
    GoEye,
    GoIssueOpened,
    GoLinkExternal,
    GoGitBranch,
} from "react-icons/go";
import { FiBookmark, FiPlus, FiCheck } from "react-icons/fi";
import { getRepo } from "@/api/github/repos";
import { qk } from "@/api/github/query-keys";
import { StatTile } from "./StatTile";
import { IssuesList } from "./IssuesList";
import { RepoContributors } from "./RepoContributors";
import { RepoLanguages } from "./RepoLanguages";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Skeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { useFavorites } from "@/providers/FavoritesContext";
import { useCompare } from "@/providers/CompareContext";
import {
    formatCompactNumber,
    formatAbsoluteDate,
    formatRelativeDate,
    getLanguageColor,
} from "@/lib/format";

export interface RepoDetailProps {
    owner: string;
    name: string;
}

export function RepoDetail({ owner, name }: RepoDetailProps) {
    const router = useRouter();
    const headingRef = useRef<HTMLHeadingElement>(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isInCompare, addToCompare } = useCompare();

    const {
        data: repo,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: qk.repo(owner, name),
        queryFn: ({ signal }) => getRepo(owner, name, signal),
    });

    const favorited = repo ? isFavorite(repo.fullName) : false;
    const comparing = repo ? isInCompare(repo.id) : false;

    // Move focus to page h1 on mount/route change for accessibility (DRD 7 / PRD F8)
    useEffect(() => {
        if (!isLoading && repo && headingRef.current) {
            headingRef.current.focus();
        }
    }, [isLoading, repo]);

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <Skeleton className="h-8 w-36 rounded-lg" />

                {/* Hero Skeleton */}
                <div className="p-6 md:p-8 rounded-2xl glass-2 border border-white/10 space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-7 w-64" />
                        </div>
                    </div>
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>

                {/* Stat Tiles Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-xl glass-1 border border-white/10 space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    leftIcon={<GoArrowLeft className="w-4 h-4" />}
                    className="mb-6"
                >
                    Back to results
                </Button>

                <ErrorState
                    error={error}
                    variant="page"
                    onRetry={() => refetch()}
                    isRetrying={isFetching}
                />
            </div>
        );
    }

    if (!repo) {
        return null;
    }

    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Back Navigation */}
            <div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-content-secondary hover:text-content-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-2 py-1 -ml-2"
                >
                    <GoArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Back to results</span>
                </button>
            </div>

            {/* Repository Hero (glass-2) */}
            <section
                aria-label="Repository Overview"
                className="p-6 md:p-8 rounded-2xl glass-2 border border-white/15 shadow-glass space-y-4"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <img
                            src={repo.owner.avatarUrl}
                            alt=""
                            width={56}
                            height={56}
                            loading="lazy"
                            className="w-14 h-14 rounded-full border border-white/20 bg-white/5 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <span className="text-sm font-medium text-content-secondary block">
                                {repo.owner.login}
                            </span>
                            <h1
                                ref={headingRef}
                                tabIndex={-1}
                                className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight truncate focus-visible:outline-none"
                            >
                                {repo.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
                        {/* Favorite button */}
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => toggleFavorite(repo)}
                            leftIcon={
                                <FiBookmark
                                    className={`w-4 h-4 ${favorited ? "text-badge-star fill-current" : ""}`}
                                />
                            }
                        >
                            <span>{favorited ? "Favorited" : "Favorite"}</span>
                        </Button>

                        {/* Compare button */}
                        <Button
                            variant={comparing ? "primary" : "secondary"}
                            size="md"
                            onClick={() => addToCompare(repo)}
                            leftIcon={comparing ? <FiCheck className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                        >
                            <span>{comparing ? "Comparing" : "Compare"}</span>
                        </Button>

                        {/* Open on GitHub */}
                        <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 min-h-[40px] gap-2 bg-accent hover:bg-accent/90 text-white shadow-md active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <span>Open on GitHub</span>
                            <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl break-words">
                    {repo.description ? (
                        repo.description
                    ) : (
                        <span className="italic text-content-muted">No description provided</span>
                    )}
                </p>

                {/* Badges: Language, Default Branch */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {repo.language && (
                        <Chip
                            variant="default"
                            size="sm"
                            icon={
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                                    aria-hidden="true"
                                />
                            }
                        >
                            {repo.language}
                        </Chip>
                    )}

                    <Chip
                        variant="outline"
                        size="sm"
                        icon={<GoGitBranch className="w-3.5 h-3.5 text-content-muted" aria-hidden="true" />}
                    >
                        <span className="font-mono text-xs">{repo.defaultBranch}</span>
                    </Chip>
                </div>
            </section>

            {/* Stats Grid (glass-1 tiles) */}
            <section aria-label="Repository Statistics">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatTile
                        label="Stars"
                        value={formatCompactNumber(repo.stars)}
                        icon={<GoStar className="w-4 h-4 text-badge-star" aria-hidden="true" />}
                    />
                    <StatTile
                        label="Forks"
                        value={formatCompactNumber(repo.forks)}
                        icon={<GoRepoForked className="w-4 h-4 text-accent" aria-hidden="true" />}
                    />
                    <StatTile
                        label="Watchers"
                        value={formatCompactNumber(repo.watchers)}
                        icon={<GoEye className="w-4 h-4 text-accent-2" aria-hidden="true" />}
                    />
                    <StatTile
                        label="Open Issues"
                        value={formatCompactNumber(repo.openIssues)}
                        subtitle="Includes pull requests"
                        icon={<GoIssueOpened className="w-4 h-4 text-badge-success" aria-hidden="true" />}
                    />
                    <StatTile
                        label="Created"
                        value={formatRelativeDate(repo.createdAt)}
                        subtitle={formatAbsoluteDate(repo.createdAt)}
                    />
                    <StatTile
                        label="Updated"
                        value={formatRelativeDate(repo.updatedAt)}
                        subtitle={formatAbsoluteDate(repo.updatedAt)}
                    />
                </div>
            </section>

            {/* Additional Public API Enhancements: Languages Breakdown & Top Contributors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RepoLanguages owner={owner} name={name} />
                <RepoContributors owner={owner} name={name} />
            </div>

            {/* Recent Issues List Section */}
            <IssuesList owner={owner} name={name} />
        </main>
    );
}
