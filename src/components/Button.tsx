import React from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            "inline-flex items-center justify-center font-medium rounded-[var(--r-sm)] transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2";

        const sizeClasses = {
            sm: "text-xs px-3 py-1.5 min-h-[36px] gap-1.5",
            md: "text-sm px-4 py-2 min-h-[40px] sm:min-h-[40px] gap-2",
            lg: "text-base px-5 py-2.5 min-h-[44px] gap-2.5",
        }[size];

        const variantClasses = {
            primary:
                "bg-[var(--primary-500)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white shadow-sm",
            secondary:
                "bg-[var(--surface)] hover:bg-[var(--primary-50)] dark:hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)] shadow-sm",
            outline:
                "bg-transparent hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)]",
            ghost:
                "text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] hover:bg-[var(--primary-50)] dark:hover:bg-white/5 hover:underline",
            danger:
                "bg-[var(--danger)] hover:bg-[#991b1b] text-white shadow-sm",
        }[variant];

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                aria-disabled={disabled || isLoading}
                className={cn(baseClasses, sizeClasses, variantClasses, className)}
                {...props}
            >
                {isLoading && <Spinner size={size === "lg" ? "md" : "sm"} />}
                {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";

