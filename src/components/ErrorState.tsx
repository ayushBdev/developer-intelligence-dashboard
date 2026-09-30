import React, { useEffect, useRef } from "react";
import { FiAlertTriangle, FiWifiOff, FiClock, FiAlertCircle } from "react-icons/fi";
import { getErrorDetails, ApiError } from "@/api/errors";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export interface ErrorStateProps {
    error: unknown;
    onRetry?: () => void;
    isRetrying?: boolean;
    variant?: "page" | "inline";
    className?: string;
}

export function ErrorState({
    error,
    onRetry,
    isRetrying = false,
    variant = "page",
    className,
}: ErrorStateProps) {
    const details = getErrorDetails(error);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const isRateLimit = error instanceof ApiError && error.kind === "rate_limited";
    const isNetwork = error instanceof ApiError && error.kind === "network";
    const isTimeout = error instanceof ApiError && error.kind === "timeout";

    // Focus heading on mount for page variant per DRD 6.4
    useEffect(() => {
        if (variant === "page" && headingRef.current) {
            headingRef.current.focus();
        }
    }, [variant]);

    const getIcon = (sizeClasses: string) => {
        if (isNetwork) {
            return <FiWifiOff className={sizeClasses} aria-hidden="true" />;
        }
        if (isRateLimit || isTimeout) {
            return <FiClock className={sizeClasses} aria-hidden="true" />;
        }
        return <FiAlertCircle className={sizeClasses} aria-hidden="true" />;
    };

    if (variant === "inline") {
        return (
            <div
                role="alert"
                aria-live="polite"
                className={cn(
                    "flex flex-wrap items-center justify-between gap-3 p-4 rounded-[var(--r-sm)] border-l-4 border",
                    isRateLimit
                        ? "bg-[var(--warning-bg)] border-[var(--warning)]/30 border-l-[var(--warning)] text-[var(--text)]"
                        : "bg-[var(--danger-bg)] border-[var(--danger)]/30 border-l-[var(--danger)] text-[var(--text)]",
                    className
                )}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <span className={cn("shrink-0", isRateLimit ? "text-[var(--warning)]" : "text-[var(--danger)]")}>
                        {getIcon("w-5 h-5")}
                    </span>
                    <div className="text-sm">
                        <span className="font-semibold">{details.title}: </span>
                        <span className="text-[var(--text-secondary)]">{details.message}</span>
                    </div>
                </div>

                {onRetry && details.canRetry && (
                    <Button
                        size="sm"
                        variant={isRateLimit ? "outline" : "danger"}
                        onClick={onRetry}
                        isLoading={isRetrying}
                        className="text-xs shrink-0"
                    >
                        {details.actionLabel || "Retry"}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={cn(
                "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-[var(--r-lg)] border border-l-4 bg-[var(--surface)] shadow-[var(--shadow-sm)] max-w-xl mx-auto my-6",
                isRateLimit
                    ? "border-[var(--warning)]/30 border-l-[var(--warning)]"
                    : "border-[var(--danger)]/30 border-l-[var(--danger)]",
                className
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full mb-4",
                    isRateLimit
                        ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                        : "bg-[var(--danger-bg)] text-[var(--danger)]"
                )}
            >
                {getIcon("w-7 h-7")}
            </div>

            <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-xl md:text-2xl font-bold text-[var(--text)] mb-2 focus-visible:outline-none"
            >
                {details.title}
            </h2>

            <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
                {details.message}
            </p>

            {onRetry && details.canRetry && (
                <Button
                    size="md"
                    variant={isRateLimit ? "primary" : "secondary"}
                    onClick={onRetry}
                    isLoading={isRetrying}
                >
                    {details.actionLabel || "Retry"}
                </Button>
            )}
        </div>
    );
}

