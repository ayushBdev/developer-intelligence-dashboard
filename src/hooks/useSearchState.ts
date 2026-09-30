"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { SearchMode, SearchParamsState } from "@/types";

export const searchParamsSchema = z.object({
    q: z.string().catch(""),
    type: z.enum(["repos", "users"]).catch("repos"),
    page: z.coerce.number().int().positive().catch(1),
    language: z.string().optional(),
    minStars: z.coerce.number().int().nonnegative().optional(),
});

export function useSearchState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const parsedFromUrl: SearchParamsState = useMemo(() => {
        const rawParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            rawParams[key] = value;
        });

        const parsed = searchParamsSchema.parse(rawParams);

        return {
            q: parsed.q,
            type: parsed.type as SearchMode,
            page: parsed.page,
            language: parsed.language || undefined,
            minStars: parsed.minStars !== undefined ? parsed.minStars : undefined,
        };
    }, [searchParams]);

    // Local synchronous state so state updates take effect immediately without waiting for router roundtrip
    const [state, setState] = useState<SearchParamsState>(parsedFromUrl);

    // Keep synced when browser back/forward or external URL changes occur
    useEffect(() => {
        setState(parsedFromUrl);
    }, [parsedFromUrl]);

    const setSearchState = useCallback(
        (
            updates: Partial<SearchParamsState>,
            options?: { replace?: boolean }
        ) => {
            setState((prev) => {
                const nextState = { ...prev, ...updates };

                const params = new URLSearchParams();

                if (nextState.q.trim()) {
                    params.set("q", nextState.q.trim());
                }

                if (nextState.type && nextState.type !== "repos") {
                    params.set("type", nextState.type);
                }

                if (nextState.page && nextState.page > 1) {
                    params.set("page", nextState.page.toString());
                }

                if (nextState.language && nextState.language.trim()) {
                    params.set("language", nextState.language.trim());
                }

                if (nextState.minStars !== undefined && nextState.minStars > 0) {
                    params.set("minStars", nextState.minStars.toString());
                }

                const queryString = params.toString();
                const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

                // Always use replace with scroll: false to avoid triggering Suspense fallback re-renders and flicker
                if (options?.replace !== false) {
                    router.replace(targetUrl, { scroll: false });
                } else {
                    router.push(targetUrl, { scroll: false });
                }

                return nextState;
            });
        },
        [pathname, router]
    );

    return {
        ...state,
        setSearchState,
    };
}

