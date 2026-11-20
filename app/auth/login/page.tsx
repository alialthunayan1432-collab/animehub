"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-900 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-800 rounded border border-gray-700 text-white"
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded border border-gray-700 text-white"
      />

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <button
        onClick={handleAuth}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
      </button>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-400 mt-4 w-full hover:text-white"
      >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Need an account? Sign Up"}
      </button>
    </div>
  );
}