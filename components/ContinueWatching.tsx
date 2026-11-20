"use client";

import Link from "next/link";
import { useProgress } from "./ProgressContext";

export default function ContinueWatching() {
  const { progress, removeProgress } = useProgress();

  if (progress.length === 0) return null;

  const sorted = [...progress].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Continue Watching</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sorted.map((p) => {
          const pct = Math.min(100, (p.currentTime / p.duration) * 100);
          return (
            <div key={p.animeId} className="relative group">
              <Link
                href={`/watch/${p.animeId}?ep=${p.episode}`}
                className="block bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={p.animeImage}
                    alt={p.animeTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                    EP {p.episode}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm truncate">{p.animeTitle}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.floor(p.currentTime / 60)}m watched
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeProgress(p.animeId)}
                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}