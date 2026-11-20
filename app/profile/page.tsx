"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useWatchlist } from "@/components/WatchlistContext";
import { useProgress } from "@/components/ProgressContext";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { watchlist } = useWatchlist();
  const { progress } = useProgress();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login");
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.email?.split("@")[0]}</h1>
              <p className="text-gray-400 mt-1">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg font-medium transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Continue Watching */}
        {progress.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {progress.map((p) => (
                <Link key={p.animeId} href={`/watch/${p.animeId}?ep=${p.episode}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={p.animeImage}
                      alt={p.animeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${Math.min(100, (p.currentTime / p.duration) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold truncate group-hover:text-purple-400 transition">{p.animeTitle}</h3>
                  <p className="text-xs text-gray-500">Episode {p.episode}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Watchlist */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Watchlist</h2>
            <span className="text-sm text-gray-400">{watchlist.length} anime</span>
          </div>
          
          {watchlist.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-800">
              <p className="text-gray-400">Your watchlist is empty.</p>
              <Link href="/" className="text-purple-400 text-sm mt-2 inline-block hover:underline">
                Browse Anime
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold truncate group-hover:text-purple-400 transition">{anime.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}