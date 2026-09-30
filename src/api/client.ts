import axios, { type AxiosError } from "axios";
import { ApiError, type ApiErrorKind } from "./errors";

const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN?.trim();

export const github = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 15000,
});

github.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const headers = error.response?.headers;
        const responseData = error.response?.data;
        const apiMessage = responseData?.message || error.message;

        let resetAt: Date | undefined;
        const resetHeader = headers?.["x-ratelimit-reset"];
        if (resetHeader && typeof resetHeader === "string") {
            const resetSeconds = parseInt(resetHeader, 10);
            if (!Number.isNaN(resetSeconds)) {
                resetAt = new Date(resetSeconds * 1000);
            }
        }

        let kind: ApiErrorKind = "unknown";

        if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
            kind = "timeout";
        } else if (!error.response) {
            kind = "network";
        } else if (status === 403 || status === 429) {
            kind = "rate_limited";
        } else if (status === 422) {
            kind = "validation";
        } else if (status === 404) {
            kind = "not_found";
        } else if (status && status >= 500) {
            kind = "server";
        }

        const mappedError = new ApiError(kind, apiMessage, {
            status,
            resetAt,
            cause: error,
        });

        return Promise.reject(mappedError);
    }
);

