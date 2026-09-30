import React from "react";
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

    const isRateLimit = error instanceof ApiError && error.kind === "rate_limited";
    const isNetwork = error instanceof ApiError && error.kind === "network";
    const isTimeout = error instanceof ApiError && error.kind === "timeout";

    const getIcon = () => {
        if (isNetwork) {
            return <FiWifiOff className="w-8 h-8 text-badge-danger" aria-hidden="true" />;
        }
        if (isRateLimit || isTimeout) {
            return <FiClock className="w-8 h-8 text-badge-warning" aria-hidden="true" />;
        }
        return <FiAlertCircle className="w-8 h-8 text-badge-danger" aria-hidden="true" />;
    };

    if (variant === "inline") {
        return (
            <div
                role="alert"
                className={cn(
                    "flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border",
                    isRateLimit
                        ? "bg-badge-warning/10 border-badge-warning/30 text-content-primary"
                        : "bg-badge-danger/10 border-badge-danger/30 text-content-primary",
                    className
                )}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <FiAlertTriangle
                        className={cn(
                            "w-5 h-5 shrink-0",
                            isRateLimit ? "text-badge-warning" : "text-badge-danger"
                        )}
                        aria-hidden="true"
                    />
                    <div className="text-sm truncate">
                        <span className="font-semibold">{details.title}: </span>
                        <span className="text-content-secondary">{details.message}</span>
                    </div>
                </div>

                {onRetry && details.canRetry && (
                    <Button
                        size="sm"
                        variant={isRateLimit ? "outline" : "danger"}
                        onClick={onRetry}
                        isLoading={isRetrying}
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
            className={cn(
                "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border glass-solid",
                isRateLimit ? "border-badge-warning/40" : "border-badge-danger/40",
                className
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full mb-4",
                    isRateLimit ? "bg-badge-warning/15" : "bg-badge-danger/15"
                )}
            >
                {getIcon()}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-content-primary mb-2">
                {details.title}
            </h2>

            <p className="text-sm md:text-base text-content-secondary max-w-md mb-6 leading-relaxed">
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

