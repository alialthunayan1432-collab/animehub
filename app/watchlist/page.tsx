"use client";

import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { useWatchlist } from "@/components/WatchlistContext";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <main className="min-h-screen">
      <section className="px-6 py-14 bg-gradient-to-l from-purple-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">My Watchlist</h1>
          <p className="text-gray-400 mt-2">
            {watchlist.length} {watchlist.length === 1 ? "anime" : "animes"} saved
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📺</p>
            <p className="text-xl text-gray-400 mb-2">Your watchlist is empty</p>
            <p className="text-sm text-gray-500 mb-6">
              Add anime from their detail pages
            </p>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold inline-block"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((anime) => (
                <div key={anime.id} className="relative group">
                  <AnimeCard anime={anime} />
                  <button
                    onClick={() => removeFromWatchlist(anime.id)}
                    className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  if (confirm("Clear entire watchlist?")) {
                    watchlist.forEach((a) => removeFromWatchlist(a.id));
                  }
                }}
                className="bg-red-600/20 hover:bg-red-600/40 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm"
              >
                Clear Watchlist
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}