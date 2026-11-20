"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StarRating({
  animeId,
  initialScore = 0,
}: {
  animeId: string;
  initialScore?: number;
}) {
  const [score, setScore] = useState(initialScore);
  const [hover, setHover] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRating() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("ratings")
        .select("score")
        .eq("anime_id", animeId)
        .eq("user_id", user.id)
        .single();
      if (data) setScore(data.score);
    }
    fetchRating();
  }, [animeId, supabase]);

  async function handleRate(value: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setScore(value);
    await supabase.from("ratings").upsert(
      { user_id: user.id, anime_id: animeId, score: value },
      { onConflict: "user_id,anime_id" }
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRate(star)}
          className={`text-2xl transition ${
            star <= (hover || score) ? "text-yellow-400" : "text-gray-600"
          }`}
        >
          ★
        </button>
      ))}
      {score > 0 && (
        <span className="text-sm text-gray-400 ml-2">{score}/10</span>
      )}
    </div>
  );
}