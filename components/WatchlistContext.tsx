"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Anime } from "@/data/animes";

type WatchlistContextType = {
  watchlist: Anime[];
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
};

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Anime[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("watchlist");
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, mounted]);

  function addToWatchlist(anime: Anime) {
    setWatchlist((prev) => {
      if (prev.find((a) => a.id === anime.id)) return prev;
      return [...prev, anime];
    });
  }

  function removeFromWatchlist(id: string) {
    setWatchlist((prev) => prev.filter((a) => a.id !== id));
  }

  function isInWatchlist(id: string) {
    return watchlist.some((a) => a.id === id);
  }

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}