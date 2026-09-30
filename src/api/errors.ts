export type ApiErrorKind =
    | "network"
    | "timeout"
    | "rate_limited"
    | "validation"
    | "not_found"
    | "server"
    | "invalid_response"
    | "unknown";

export class ApiError extends Error {
    public readonly kind: ApiErrorKind;
    public readonly status?: number;
    public readonly resetAt?: Date;

    constructor(
        kind: ApiErrorKind,
        message: string,
        options?: { status?: number; resetAt?: Date; cause?: unknown }
    ) {
        super(message);
        this.name = "ApiError";
        this.kind = kind;
        this.status = options?.status;
        this.resetAt = options?.resetAt;
        if (options?.cause) {
            this.cause = options.cause;
        }
    }
}

export interface ErrorDetails {
    title: string;
    message: string;
    canRetry: boolean;
    actionLabel?: string;
}

export function getErrorDetails(error: unknown): ErrorDetails {
    if (!(error instanceof ApiError)) {
        return {
            title: "Something went wrong",
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again.",
            canRetry: true,
            actionLabel: "Try again",
        };
    }

    switch (error.kind) {
        case "network":
            return {
                title: "You seem to be offline",
                message: "Check your connection and try again.",
                canRetry: true,
                actionLabel: "Retry",
            };
        case "timeout":
            return {
                title: "Request timed out",
                message: "GitHub took too long to respond. Please try again.",
                canRetry: true,
                actionLabel: "Retry",
            };
        case "rate_limited": {
            let message = "GitHub API rate limit reached.";
            if (error.resetAt) {
                const now = new Date();
                const diffMs = error.resetAt.getTime() - now.getTime();
                const diffMins = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
                const timeString = error.resetAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                message = `Requests resume at ${timeString} (in ~${diffMins} min).`;
            } else {
                message += " Please wait a few minutes before trying again.";
            }

            return {
                title: "GitHub rate limit reached",
                message,
                canRetry: true,
                actionLabel: "Retry",
            };
        }
        case "validation":
            return {
                title: "That search isn't valid",
                message: "Try removing special characters or unsupported qualifiers.",
                canRetry: false,
                actionLabel: "Edit query",
            };
        case "not_found":
            return {
                title: "Resource not found",
                message: "It may be private, deleted, or renamed.",
                canRetry: false,
                actionLabel: "Go back",
            };
        case "server":
            return {
                title: "GitHub is having trouble",
                message: "This is on their side. Try again shortly.",
                canRetry: true,
                actionLabel: "Retry",
            };
        case "invalid_response":
            return {
                title: "Unexpected response shape",
                message: "The response received from GitHub could not be processed.",
                canRetry: true,
                actionLabel: "Retry",
            };
        case "unknown":
        default:
            return {
                title: "Something went wrong",
                message: error.message || "An unexpected error occurred.",
                canRetry: true,
                actionLabel: "Retry",
            };
    }
}

