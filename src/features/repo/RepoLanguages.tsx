"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCode } from "react-icons/fi";
import { getRepoLanguages } from "@/api/github/repos";
import { qk } from "@/api/github/query-keys";
import { Skeleton } from "@/components/Skeleton";

export interface RepoLanguagesProps {
    owner: string;
    name: string;
}

export function RepoLanguages({ owner, name }: RepoLanguagesProps) {
    const {
        data: languages = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: qk.languages(owner, name),
        queryFn: ({ signal }) => getRepoLanguages(owner, name, signal),
    });

    if (isError || (!isLoading && languages.length === 0)) {
        return null; // Gracefully degrade if no language data
    }

    return (
        <section aria-label="Languages breakdown" className="flex flex-col gap-3 p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2 text-[var(--text)] font-semibold text-sm">
                <FiCode className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)]" aria-hidden="true" />
                <span>Languages</span>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="flex gap-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Multi-segmented percentage bar */}
                    <div className="h-2.5 w-full rounded-full flex overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)]">
                        {languages.map((lang) => (
                            <div
                                key={lang.name}
                                style={{
                                    width: `${lang.percentage}%`,
                                    backgroundColor: lang.color,
                                }}
                                title={`${lang.name}: ${lang.percentage}%`}
                                className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                            />
                        ))}
                    </div>

                    {/* Legend chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                        {languages.map((lang) => (
                            <div key={lang.name} className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: lang.color }}
                                    aria-hidden="true"
                                />
                                <span className="font-medium text-[var(--text)]">{lang.name}</span>
                                <span className="text-[var(--text-muted)]">{lang.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

