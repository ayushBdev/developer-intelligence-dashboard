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
        <li className="flex flex-col gap-2 p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary-200)] transition-all duration-150">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-wrap sm:flex-nowrap min-w-0">
                    <IssueStateBadge state={issue.state} className="mt-0.5" />
                    <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 mt-0.5">
                        #{issue.number}
                    </span>
                    <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[var(--text)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] line-clamp-2 transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                        {issue.title}
                    </a>
                </div>

                <a
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open issue #${issue.number} on GitHub`}
                    className="p-1 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-50)] dark:hover:bg-white/5 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                >
                    <GoLinkExternal className="w-4 h-4" aria-hidden="true" />
                </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] flex-wrap pl-1">
                <span className="flex items-center gap-1.5">
                    {issue.authorAvatarUrl && (
                        <img
                            src={issue.authorAvatarUrl}
                            alt=""
                            width={16}
                            height={16}
                            loading="lazy"
                            className="w-4 h-4 rounded-full border border-[var(--border)] object-cover"
                        />
                    )}
                    <span>
                        opened by <strong className="font-medium text-[var(--text)]">{issue.author}</strong>
                    </span>
                </span>
                <span className="text-[var(--text-muted)]">·</span>
                <time
                    dateTime={issue.createdAt}
                    title={`Created on ${formatAbsoluteDate(issue.createdAt)}`}
                    className="text-[var(--text-secondary)]"
                >
                    created {formatRelativeDate(issue.createdAt)}
                </time>
                <span className="text-[var(--text-muted)]">·</span>
                <time
                    dateTime={issue.updatedAt}
                    title={`Updated on ${formatAbsoluteDate(issue.updatedAt)}`}
                    className="text-[var(--text-muted)]"
                >
                    updated {formatRelativeDate(issue.updatedAt)}
                </time>
            </div>
        </li>
    );
}

