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
            "inline-flex items-center justify-center font-medium rounded-lg transition-all select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base";

        const sizeClasses = {
            sm: "text-xs px-2.5 py-1.5 min-h-[32px] gap-1.5",
            md: "text-sm px-4 py-2 min-h-[40px] gap-2",
            lg: "text-base px-5 py-2.5 min-h-[46px] gap-2.5",
        }[size];

        const variantClasses = {
            primary:
                "bg-accent hover:bg-accent/90 text-white shadow-md active:translate-y-[1px]",
            secondary:
                "bg-white/10 hover:bg-white/15 text-content-primary border border-white/15 backdrop-blur-md active:translate-y-[1px]",
            outline:
                "border border-white/25 hover:border-white/40 text-content-primary hover:bg-white/5 active:translate-y-[1px]",
            ghost:
                "text-content-secondary hover:text-content-primary hover:bg-white/10",
            danger:
                "bg-badge-danger hover:bg-badge-danger/90 text-white shadow-md active:translate-y-[1px]",
        }[variant];

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
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

