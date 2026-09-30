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
                "relative overflow-hidden bg-white/10 dark:bg-white/10 light:bg-slate-300/60 rounded-md",
                "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

