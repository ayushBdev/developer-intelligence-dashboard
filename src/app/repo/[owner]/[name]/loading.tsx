import { Skeleton } from "@/components/Skeleton";

export default function RepoLoading() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading repository details"
            className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
        >
            <Skeleton className="h-8 w-36 rounded-[var(--r-sm)]" />

            {/* Hero Skeleton: matches hero panel */}
            <div className="p-6 md:p-8 rounded-[var(--r-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-7 w-64" />
                    </div>
                </div>
                <Skeleton className="h-14 w-full rounded-[var(--r-sm)]" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-[var(--r-sm)]" />
                    <Skeleton className="h-6 w-20 rounded-[var(--r-sm)]" />
                </div>
            </div>

            {/* Stat Tiles Skeleton: 6 stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                ))}
            </div>

            {/* Issues List Skeleton: 3-5 issue rows per DRD 6.1 */}
            <div className="space-y-3 mt-8">
                <Skeleton className="h-6 w-32" />
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2"
                    >
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

