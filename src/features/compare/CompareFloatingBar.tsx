"use client";

import React from "react";
import { FiX, FiBarChart2 } from "react-icons/fi";
import { useCompare } from "@/providers/CompareContext";
import { Button } from "@/components/Button";

export function CompareFloatingBar() {
    const { compareList, removeFromCompare, clearCompare, setIsModalOpen } = useCompare();

    if (compareList.length === 0) {
        return null;
    }

    return (
        <aside
            aria-label="Repository comparison tray"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl bg-[var(--surface)] border border-[var(--border-strong)] p-3 sm:p-4 rounded-[var(--r-lg)] shadow-[var(--shadow-md)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-150"
        >
            <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 rounded-[var(--r-sm)] bg-[var(--primary-50)] dark:bg-[var(--primary-500)]/15 text-[var(--primary-500)] dark:text-[var(--link,#6b93ff)] shrink-0">
                    <FiBarChart2 className="w-5 h-5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <span className="block text-xs font-semibold text-[var(--text)] truncate">
                        Compare ({compareList.length}/2 repos)
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 truncate">
                        {compareList.map((repo) => (
                            <span
                                key={repo.id}
                                className="inline-flex items-center gap-1 text-[11px] bg-[var(--surface-muted)] border border-[var(--border)] px-2 py-0.5 rounded-[var(--r-sm)] text-[var(--text-secondary)] truncate"
                            >
                                <span className="truncate max-w-[100px]">{repo.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo.id)}
                                    aria-label={`Remove ${repo.name} from comparison`}
                                    className="hover:text-[var(--text)]"
                                >
                                    <FiX className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearCompare}
                    className="text-xs px-2"
                >
                    Clear
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-semibold"
                >
                    Compare
                </Button>
            </div>
        </aside>
    );
}

