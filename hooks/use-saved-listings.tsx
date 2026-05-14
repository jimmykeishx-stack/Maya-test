"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "maya-haven-saved-listings";

type SavedListingsContextValue = {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const SavedListingsContext = createContext<SavedListingsContextValue | null>(null);

export function SavedListingsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedIds(JSON.parse(stored) as string[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const value: SavedListingsContextValue = {
    savedIds,
    isSaved: (id) => savedIds.includes(id),
    toggleSaved
  };

  return <SavedListingsContext.Provider value={value}>{children}</SavedListingsContext.Provider>;
}

export function useSavedListings() {
  const context = useContext(SavedListingsContext);

  if (!context) {
    throw new Error("useSavedListings must be used within SavedListingsProvider");
  }

  return context;
}
