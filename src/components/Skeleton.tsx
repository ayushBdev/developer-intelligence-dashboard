import React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "relative overflow-hidden bg-[var(--surface-muted)] rounded-[var(--r-sm)]",
                "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
                "before:bg-gradient-to-r before:from-transparent before:via-black/[0.04] dark:before:via-white/[0.06] before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

