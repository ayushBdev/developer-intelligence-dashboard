import React from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "accent" | "outline" | "interactive";
    size?: "sm" | "md";
    icon?: React.ReactNode;
    onClick?: () => void;
}

export function Chip({
    variant = "default",
    size = "sm",
    icon,
    children,
    className,
    onClick,
    ...props
}: ChipProps) {
    const isClickable = Boolean(onClick);

    const sizeClasses = {
        sm: "text-xs px-2.5 py-1 gap-1.5",
        md: "text-sm px-3 py-1.5 gap-2",
    }[size];

    const variantClasses = {
        default:
            "bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border)]",
        accent:
            "bg-[var(--primary-50)] dark:bg-[var(--primary-500)]/15 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] border border-[var(--primary-200)] dark:border-[var(--primary-500)]/30 font-medium",
        outline:
            "border border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)]",
        interactive:
            "bg-[var(--primary-50)] dark:bg-[var(--surface-muted)] text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] border border-[var(--primary-200)] dark:border-[var(--border)] hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-500)]/20 cursor-pointer active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]",
    }[variant];

    return (
        <span
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={onClick}
            onKeyDown={
                isClickable
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick?.();
                          }
                      }
                    : undefined
            }
            className={cn(
                "inline-flex items-center rounded-[var(--r-sm)] font-medium transition-colors select-none",
                sizeClasses,
                variantClasses,
                className
            )}
            {...props}
        >
            {icon && <span className="inline-flex shrink-0">{icon}</span>}
            <span>{children}</span>
        </span>
    );
}

