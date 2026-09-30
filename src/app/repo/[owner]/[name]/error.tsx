"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { ErrorState } from "@/components/ErrorState";

export default function RepoError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log client-side error to console
        console.error("Repository route error:", error);
    }, [error]);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-content-secondary hover:text-content-primary mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-2 py-1 -ml-2"
            >
                <GoArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to search</span>
            </Link>

            <ErrorState
                error={error}
                variant="page"
                onRetry={reset}
            />
        </div>
    );
}

