"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <div className="w-20 h-9 bg-gray-800 rounded-lg animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="hidden sm:block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
      >
        <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">
          {user.email?.[0].toUpperCase()}
        </span>
        <span className="hidden md:block max-w-[100px] truncate">
          {user.email?.split("@")[0]}
        </span>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 hover:bg-gray-800 text-sm"
            >
              👤 My Profile
            </Link>
            <Link
              href="/watchlist"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 hover:bg-gray-800 text-sm"
            >
              📺 My Watchlist
            </Link>
            <hr className="border-gray-800" />
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm text-red-400"
            >
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}