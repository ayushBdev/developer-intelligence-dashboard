import React from "react";
import { cn } from "@/lib/cn";

export interface IconLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    "aria-label": string;
    children: React.ReactNode;
}

export function IconLink({
    href,
    className,
    children,
    ...props
}: IconLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center justify-center p-2 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] hover:bg-[var(--primary-50)] dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
                className
            )}
            {...props}
        >
            {children}
        </a>
    );
}

