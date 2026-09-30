import React from "react";
import { cn } from "@/lib/cn";

export interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    label?: string;
}

export function Spinner({ size = "md", className, label = "Loading..." }: SpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-5 h-5 border-2",
        lg: "w-8 h-8 border-3",
    }[size];

    return (
        <span className="inline-flex items-center gap-2" role="status">
            <span
                className={cn(
                    "inline-block rounded-full border-solid border-current border-r-transparent animate-spin",
                    sizeClasses,
                    className
                )}
            />
            {label && <span className="sr-only">{label}</span>}
        </span>
    );
}

