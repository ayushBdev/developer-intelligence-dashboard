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
                "inline-flex items-center justify-center p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                className
            )}
            {...props}
        >
            {children}
        </a>
    );
}

