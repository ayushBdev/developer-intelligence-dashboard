import React from "react";
import { cn } from "@/lib/cn";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    level?: "0" | "1" | "2" | "solid";
    as?: React.ElementType;
}

export function GlassSurface({
    level = "1",
    as: Component = "div",
    className,
    children,
    ...props
}: GlassSurfaceProps) {
    const levelClass = {
        "0": "bg-[var(--surface-muted)] border border-[var(--border)] rounded-[var(--r-md)]",
        "1": "surface-card",
        "2": "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--shadow-sm)]",
        solid: "surface-card",
    }[level];

    return (
        <Component
            className={cn(levelClass, className)}
            {...props}
        >
            {children}
        </Component>
    );
}

