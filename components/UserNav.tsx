"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
    <div className="hidden sm:flex items-center gap-3 shrink-0">
      <span className="text-sm text-gray-300 max-w-[120px] truncate" title={user.email}>
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
      >
        Sign Out
      </button>
    </div>
  );
}