import React, { Suspense } from "react";
import { SearchPage } from "@/features/search/SearchPage";
import { Skeleton } from "@/components/Skeleton";

function SearchPageFallback() {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <Skeleton className="h-10 w-64 mx-auto rounded-[var(--r-sm)]" />
                <Skeleton className="h-4 w-96 mx-auto rounded-[var(--r-sm)]" />
            </div>
            <div className="p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                <Skeleton className="h-11 w-full rounded-[var(--r-sm)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<SearchPageFallback />}>
            <SearchPage />
        </Suspense>
    );
}

