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
        <section aria-label="Top contributors" className="flex flex-col gap-3 p-5 rounded-2xl glass-1 border border-white/10">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-sm">
                <FiUsers className="w-4 h-4 text-accent" aria-hidden="true" />
                <span>Top Contributors</span>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-2.5 w-10" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : contributors.length === 0 ? (
                <p className="text-xs text-content-muted">No contributor information available.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {contributors.map((c) => (
                        <a
                            key={c.id}
                            href={c.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <img
                                    src={c.avatarUrl}
                                    alt=""
                                    width={28}
                                    height={28}
                                    loading="lazy"
                                    className="w-7 h-7 rounded-full border border-white/15 object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <span className="block text-xs font-semibold text-content-primary truncate group-hover:text-accent transition-colors">
                                        {c.login}
                                    </span>
                                    <span className="block text-[11px] text-content-muted">
                                        {formatCompactNumber(c.contributions)} commits
                                    </span>
                                </div>
                            </div>
                            <GoLinkExternal className="w-3 h-3 text-content-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}
