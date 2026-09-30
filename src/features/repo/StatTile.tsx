import React from "react";
import { cn } from "@/lib/cn";

export interface StatTileProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
    className?: string;
}

export function StatTile({
    label,
    value,
    icon,
    subtitle,
    className,
}: StatTileProps) {
    return (
        <div
            className={cn(
                "flex flex-col justify-between p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]",
                className
            )}
        >
            <div className="flex items-center justify-between gap-1.5 text-xs text-[var(--text-secondary)] mb-1">
                <span>{label}</span>
                {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
            </div>

            <div className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
                {value}
            </div>

            {subtitle && (
                <div className="text-[11px] text-[var(--text-muted)] mt-1 leading-tight">
                    {subtitle}
                </div>
            )}
        </div>
    );
}

