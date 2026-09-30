"use client";

import React, { createContext, useContext, useState } from "react";
import type { RepoDetail, RepoItem } from "@/types";

interface CompareContextType {
    compareList: (RepoItem | RepoDetail)[];
    addToCompare: (repo: RepoItem | RepoDetail) => void;
    removeFromCompare: (id: number) => void;
    isInCompare: (id: number) => boolean;
    clearCompare: () => void;
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<(RepoItem | RepoDetail)[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isInCompare = (id: number): boolean => {
        return compareList.some((item) => item.id === id);
    };

    const addToCompare = (repo: RepoItem | RepoDetail) => {
        if (isInCompare(repo.id)) {
            removeFromCompare(repo.id);
            return;
        }

        if (compareList.length >= 2) {
            // Replace the second one or show toast
            setCompareList([compareList[0]!, repo]);
        } else {
            setCompareList([...compareList, repo]);
        }
    };

    const removeFromCompare = (id: number) => {
        setCompareList(compareList.filter((item) => item.id !== id));
    };

    const clearCompare = () => {
        setCompareList([]);
        setIsModalOpen(false);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
                isModalOpen,
                setIsModalOpen,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
