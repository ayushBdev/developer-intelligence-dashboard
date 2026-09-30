"use client";

import React from "react";
import Link from "next/link";
import { FiX, FiBookmark, FiTrash2, FiExternalLink } from "react-icons/fi";
import { GoStar, GoRepoForked } from "react-icons/go";
import { useFavorites } from "@/providers/FavoritesContext";
import { Button } from "@/components/Button";
import { formatCompactNumber, getLanguageColor } from "@/lib/format";

export interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
    const { favorites, toggleFavorite, clearFavorites } = useFavorites();

    if (!isOpen) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="favorites-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--r-lg)] p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-[var(--r-sm)] bg-[var(--primary-50)] text-[var(--star)]">
                            <FiBookmark className="w-5 h-5 fill-current" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="favorites-modal-title" className="text-xl font-bold text-[var(--text)]">
                                Saved Repositories ({favorites.length})
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Repositories saved to your browser&apos;s local storage
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {favorites.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFavorites}
                                leftIcon={<FiTrash2 className="w-3.5 h-3.5" />}
                                className="text-xs text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)]"
                            >
                                Clear all
                            </Button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close favorites modal"
                            className="p-2 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                        >
                            <FiX className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* List or Empty State */}
                <div className="overflow-y-auto max-h-[60vh] space-y-3 pr-1">
                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FiBookmark className="w-12 h-12 text-[var(--text-muted)] mb-3 opacity-40" />
                            <p className="text-base font-semibold text-[var(--text)] mb-1">
                                No favorite repositories yet
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                                Click the bookmark icon on any repository card to save it for quick reference.
                            </p>
                        </div>
                    ) : (
                        favorites.map((repo) => (
                            <div
                                key={repo.id}
                                className="flex items-center justify-between gap-3 p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary-200)] transition-colors shadow-[var(--shadow-sm)]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={repo.owner.avatarUrl}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full border border-[var(--border)] object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <Link
                                            href={`/repo/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`}
                                            onClick={onClose}
                                            className="text-sm font-semibold text-[var(--text)] hover:text-[var(--primary-500)] dark:hover:text-[var(--link,#6b93ff)] truncate block transition-colors"
                                        >
                                            {repo.fullName}
                                        </Link>
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                                            {repo.language && (
                                                <span className="flex items-center gap-1">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                    />
                                                    <span>{repo.language}</span>
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <GoStar className="w-3 h-3 text-[var(--star)]" />
                                                <span>{formatCompactNumber(repo.stars)}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <a
                                        href={repo.htmlUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open ${repo.fullName} on GitHub`}
                                        className="p-1.5 rounded-[var(--r-sm)] text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-50)] dark:hover:bg-white/5 transition-colors"
                                    >
                                        <FiExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(repo)}
                                        aria-label={`Remove ${repo.fullName} from favorites`}
                                        className="p-1.5 rounded-[var(--r-sm)] text-[var(--star)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

