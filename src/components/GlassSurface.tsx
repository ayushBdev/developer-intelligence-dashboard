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
        "0": "glass-0",
        "1": "glass-1",
        "2": "glass-2",
        solid: "glass-solid",
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

