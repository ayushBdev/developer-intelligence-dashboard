"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/api/errors";
import { ThemeProvider } from "./ThemeContext";
import { FavoritesProvider } from "./FavoritesContext";
import { CompareProvider } from "./CompareContext";
import { CompareModal } from "@/features/compare/CompareModal";
import { CompareFloatingBar } from "@/features/compare/CompareFloatingBar";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes
                        refetchOnWindowFocus: false, // Prevents burning rate limits
                        retry: (failureCount, error) => {
                            if (error instanceof ApiError) {
                                if (
                                    error.kind === "rate_limited" ||
                                    error.kind === "validation" ||
                                    error.kind === "not_found" ||
                                    error.kind === "invalid_response"
                                ) {
                                    return false;
                                }
                            }
                            return failureCount < 1;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <FavoritesProvider>
                    <CompareProvider>
                        {children}
                        <CompareFloatingBar />
                        <CompareModal />
                    </CompareProvider>
                </FavoritesProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
