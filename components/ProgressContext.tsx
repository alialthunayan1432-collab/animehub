"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type WatchProgress = {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episode: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
};

type ProgressContextType = {
  progress: WatchProgress[];
  saveProgress: (data: WatchProgress) => void;
  removeProgress: (animeId: string) => void;
  getProgress: (animeId: string) => WatchProgress | undefined;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = "watch_progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<WatchProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  function saveProgress(data: WatchProgress) {
    setProgress((prev) => {
      const filtered = prev.filter((p) => p.animeId !== data.animeId);
      return [...filtered, { ...data, updatedAt: Date.now() }];
    });
  }

  function removeProgress(animeId: string) {
    setProgress((prev) => prev.filter((p) => p.animeId !== animeId));
  }

  function getProgress(animeId: string) {
    return progress.find((p) => p.animeId === animeId);
  }

  return (
    <ProgressContext.Provider
      value={{ progress, saveProgress, removeProgress, getProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}