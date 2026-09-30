import React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
    variant?: "default" | "flat" | "interactive" | "muted";
    padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
    as: Component = "div",
    variant = "default",
    padding = "md",
    className,
    children,
    ...props
}: CardProps) {
    const variantClasses = {
        default: "surface-card",
        flat: "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-md)]",
        interactive: "surface-card surface-card-interactive",
        muted: "bg-[var(--surface-muted)] border border-[var(--border)] rounded-[var(--r-md)]",
    }[variant];

    const paddingClasses = {
        none: "",
        sm: "p-3 sm:p-4",
        md: "p-4 sm:p-5",
        lg: "p-6 sm:p-8",
    }[padding];

    return (
        <Component
            className={cn(variantClasses, paddingClasses, className)}
            {...props}
        >
            {children}
        </Component>
    );
}

