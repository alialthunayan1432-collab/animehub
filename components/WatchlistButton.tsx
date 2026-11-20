"use client";

import { useWatchlist } from "./WatchlistContext";
import type { Anime } from "@/data/animes";

export default function WatchlistButton({ anime }: { anime: Anime }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inList = isInWatchlist(anime.id);

  return (
    <button
      onClick={() =>
        inList ? removeFromWatchlist(anime.id) : addToWatchlist(anime)
      }
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
        inList
          ? "bg-gray-800 hover:bg-gray-700 border border-purple-500 text-purple-400"
          : "bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white"
      }`}
    >
      {inList ? "✓ In Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}