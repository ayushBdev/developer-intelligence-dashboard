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
            "bg-white/10 text-content-primary border border-white/15",
        accent:
            "bg-accent/20 text-accent border border-accent/30 font-medium",
        outline:
            "border border-white/20 text-content-secondary",
        interactive:
            "bg-white/10 hover:bg-white/20 text-content-primary border border-white/20 cursor-pointer active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
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
                "inline-flex items-center rounded-full font-medium transition-colors select-none",
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

