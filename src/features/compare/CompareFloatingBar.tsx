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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl glass-2 border border-white/20 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200"
        >
            <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 rounded-lg bg-accent/20 text-accent shrink-0">
                    <FiBarChart2 className="w-5 h-5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <span className="block text-xs font-semibold text-content-primary truncate">
                        Compare ({compareList.length}/2 repos)
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 truncate">
                        {compareList.map((repo) => (
                            <span
                                key={repo.id}
                                className="inline-flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-content-secondary truncate"
                            >
                                <span className="truncate max-w-[100px]">{repo.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFromCompare(repo.id)}
                                    aria-label={`Remove ${repo.name} from comparison`}
                                    className="hover:text-content-primary"
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
