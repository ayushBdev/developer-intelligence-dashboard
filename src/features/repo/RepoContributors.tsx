"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiUsers } from "react-icons/fi";
import { GoLinkExternal } from "react-icons/go";
import { getRepoContributors } from "@/api/github/repos";
import { qk } from "@/api/github/query-keys";
import { Skeleton } from "@/components/Skeleton";
import { formatCompactNumber } from "@/lib/format";

export interface RepoContributorsProps {
    owner: string;
    name: string;
}

export function RepoContributors({ owner, name }: RepoContributorsProps) {
    const {
        data: contributors = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: qk.contributors(owner, name),
        queryFn: ({ signal }) => getRepoContributors(owner, name, 6, signal),
    });

    if (isError) {
        return null; // Gracefully degrade without blanking hero or stats
    }

    return (
        <section aria-label="Top contributors" className="flex flex-col gap-3 p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2 text-[var(--text)] font-semibold text-sm">
                <FiUsers className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)]" aria-hidden="true" />
                <span>Top Contributors</span>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-[var(--r-sm)] bg-[var(--surface-muted)]">
                            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-2.5 w-10" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : contributors.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No contributor information available.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {contributors.map((c) => (
                        <a
                            key={c.id}
                            href={c.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-2 rounded-[var(--r-sm)] bg-[var(--surface-muted)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-500)]/15 border border-[var(--border)] hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-500)]/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <img
                                    src={c.avatarUrl}
                                    alt=""
                                    width={28}
                                    height={28}
                                    loading="lazy"
                                    className="w-7 h-7 rounded-full border border-[var(--border)] object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <span className="block text-xs font-semibold text-[var(--text)] truncate group-hover:text-[var(--primary-500)] dark:group-hover:text-[var(--link,#6b93ff)] transition-colors">
                                        {c.login}
                                    </span>
                                    <span className="block text-[11px] text-[var(--text-muted)]">
                                        {formatCompactNumber(c.contributions)} commits
                                    </span>
                                </div>
                            </div>
                            <GoLinkExternal className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}

