import React from "react";
import { GoLinkExternal } from "react-icons/go";
import { IssueStateBadge } from "./IssueStateBadge";
import { formatRelativeDate, formatAbsoluteDate } from "@/lib/format";
import type { IssueItem } from "@/types";

export interface IssueRowProps {
    issue: IssueItem;
}

export function IssueRow({ issue }: IssueRowProps) {
    return (
        <li className="flex flex-col gap-2 p-4 rounded-xl glass-1 hover:glass-2 transition-all duration-150 border border-white/10">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-wrap sm:flex-nowrap min-w-0">
                    <IssueStateBadge state={issue.state} className="mt-0.5" />
                    <span className="text-xs font-mono text-content-muted shrink-0 mt-0.5">
                        #{issue.number}
                    </span>
                    <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-content-primary hover:text-accent line-clamp-2 transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                        {issue.title}
                    </a>
                </div>

                <a
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open issue #${issue.number} on GitHub`}
                    className="p-1 rounded text-content-secondary hover:text-content-primary hover:bg-white/10 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-content-secondary flex-wrap pl-1">
                <span className="flex items-center gap-1.5">
                    {issue.authorAvatarUrl && (
                        <img
                            src={issue.authorAvatarUrl}
                            alt=""
                            width={16}
                            height={16}
                            loading="lazy"
                            className="w-4 h-4 rounded-full border border-white/15 object-cover"
                        />
                    )}
                    <span>
                        opened by <strong className="font-medium text-content-primary">{issue.author}</strong>
                    </span>
                </span>
                <span className="text-content-muted">·</span>
                <time
                    dateTime={issue.createdAt}
                    title={`Created on ${formatAbsoluteDate(issue.createdAt)}`}
                    className="text-content-secondary"
                >
                    created {formatRelativeDate(issue.createdAt)}
                </time>
                <span className="text-content-muted">·</span>
                <time
                    dateTime={issue.updatedAt}
                    title={`Updated on ${formatAbsoluteDate(issue.updatedAt)}`}
                    className="text-content-muted"
                >
                    updated {formatRelativeDate(issue.updatedAt)}
                </time>
            </div>
        </li>
    );
}

