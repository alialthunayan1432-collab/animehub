"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const links = [
    { href: "/", label: "Home" },
    { href: "/top", label: "Top Rated" },
    { href: "/genres", label: "Genres" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-purple-500 shrink-0">
          AnimeHub
        </Link>

        <nav className="hidden md:flex gap-5 text-sm text-gray-300 shrink-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-white transition ${
                pathname === l.href ? "text-purple-400 font-semibold" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* شريط البحث */}
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

        <button className="hidden sm:block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0">
          Sign In
        </button>
      </div>
    </header>
  );
}