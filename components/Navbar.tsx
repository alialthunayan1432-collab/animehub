"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useWatchlist } from "./WatchlistContext";
import UserNav from "./UserNav";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { watchlist } = useWatchlist();

  const links = [
    { href: "/", label: "Home" },
    { href: "/trending", label: "Trending" },
    { href: "/top", label: "Top Rated" },
    { href: "/genres", label: "Genres" },
    { href: "/watchlist", label: "My List" },
  ];

  async function goRandom() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/anime?sort=TRENDING_DESC&page=1"
      );
      if (!res.ok) return;
      const data = await res.json();
      const media = data.media || [];
      if (media.length === 0) return;
      const random = media[Math.floor(Math.random() * media.length)];
      router.push(`/anime/${random.id}`);
    } catch {}
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-purple-500 shrink-0">
          AnimeHub
        </Link>

        <nav className="hidden md:flex gap-4 text-sm text-gray-300 shrink-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-white transition relative ${
                pathname === l.href ? "text-purple-400 font-semibold" : ""
              }`}
            >
              {l.label}
              {l.href === "/watchlist" && watchlist.length > 0 && (
                <span className="ml-1 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {watchlist.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <form action="/search" className="flex-1 max-w-md ml-auto">
          <input
            type="text"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </form>

        <button
          onClick={goRandom}
          className="hidden sm:block bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition shrink-0"
          title="Random Anime"
        >
          🎲
        </button>

        <UserNav />
      </div>
    </header>
  );
}