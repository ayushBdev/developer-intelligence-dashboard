"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GoLocation, GoLinkExternal } from "react-icons/go";
import { getUser } from "@/api/github/users";
import { qk } from "@/api/github/query-keys";
import { Skeleton } from "@/components/Skeleton";
import { IconLink } from "@/components/IconLink";
import { Button } from "@/components/Button";
import { formatCompactNumber } from "@/lib/format";
import type { UserItem } from "@/types";

export interface UserCardProps {
    user: UserItem;
}

export function UserCard({ user }: UserCardProps) {
    const {
        data: enrichedUser,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: qk.user(user.login),
        queryFn: ({ signal }) => getUser(user.login, signal),
        staleTime: 5 * 60 * 1000,
    });

    const displayName = enrichedUser?.name || user.name || user.login;
    const location = enrichedUser?.location || user.location;
    const followers = enrichedUser?.followers;
    const following = enrichedUser?.following;
    const publicRepos = enrichedUser?.publicRepos;

    return (
        <article className="group relative flex flex-col justify-between p-5 rounded-2xl glass-1 hover:glass-2 hover:-translate-y-0.5 transition-all duration-150 border border-white/10 shadow-sm">
            <div>
                {/* User Header: Avatar, Name, Handle, External link */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <img
                            src={user.avatarUrl}
                            alt=""
                            width={56}
                            height={56}
                            loading="lazy"
                            className="w-14 h-14 rounded-full border border-white/20 bg-white/5 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-content-primary truncate">
                                {displayName}
                            </h3>
                            <p className="text-xs text-content-secondary truncate">
                                @{user.login}
                            </p>
                            {location && (
                                <p className="flex items-center gap-1 text-xs text-content-muted mt-1 truncate">
                                    <GoLocation className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                    <span>{location}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <IconLink
                        href={user.htmlUrl}
                        aria-label={`Open ${user.login}'s profile on GitHub`}
                        className="shrink-0 -mr-1 -mt-1"
                    >
                        <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                    </IconLink>
                </div>
            </div>

            {/* Enriched Stats Area */}
            <div className="pt-3 mt-2 border-t border-white/10">
                {isLoading ? (
                    <div className="flex items-center justify-between gap-2 py-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-between gap-2 py-1 text-xs">
                        <span className="text-content-muted italic">Stats unavailable</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => refetch()}
                            isLoading={isFetching}
                            className="text-xs py-0.5 px-2 min-h-0 h-6"
                        >
                            Retry
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="flex flex-col">
                            <span className="text-content-muted">Followers</span>
                            <span className="font-semibold text-content-primary text-sm">
                                {formatCompactNumber(followers)}
                            </span>
                        </div>
                        <div className="flex flex-col border-x border-white/10">
                            <span className="text-content-muted">Following</span>
                            <span className="font-semibold text-content-primary text-sm">
                                {formatCompactNumber(following)}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-content-muted">Repos</span>
                            <span className="font-semibold text-content-primary text-sm">
                                {formatCompactNumber(publicRepos)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

