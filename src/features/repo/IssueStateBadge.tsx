import React from "react";
import { GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { cn } from "@/lib/cn";

export interface IssueStateBadgeProps {
    state: "open" | "closed";
    className?: string;
}

export function IssueStateBadge({ state, className }: IssueStateBadgeProps) {
    const isOpen = state === "open";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 border",
                isOpen
                    ? "bg-badge-success/15 text-badge-success border-badge-success/30"
                    : "bg-badge-merged/15 text-badge-merged border-badge-merged/30",
                className
            )}
        >
            {isOpen ? (
                <GoIssueOpened className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
                <GoIssueClosed className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{isOpen ? "Open" : "Closed"}</span>
        </span>
    );
}

